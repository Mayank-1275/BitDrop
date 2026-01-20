// State
let originalImage = null;
let processedImages = [];
let currentView = 'grid';

// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const processBtn = document.getElementById('processBtn');
const downloadAllBtn = document.getElementById('downloadAllBtn');
const resultsContainer = document.getElementById('resultsContainer');
const emptyState = document.getElementById('emptyState');
const statsContainer = document.getElementById('statsContainer');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const progressPercent = document.getElementById('progressPercent');

// Upload Area Events
uploadArea.addEventListener('click', () => fileInput.click());

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleFileUpload(file);
    }
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleFileUpload(file);
    }
});

// Handle File Upload
function handleFileUpload(file) {
    if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            originalImage = img;
            processBtn.disabled = false;
            updateUploadAreaText(file.name);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function updateUploadAreaText(filename) {
    uploadArea.innerHTML = `
        <div class="upload-icon">✅</div>
        <div class="upload-text">
            <strong>${filename}</strong><br>
            <small>Click to upload another image</small>
        </div>
    `;
}

// Process Image
processBtn.addEventListener('click', async () => {
    if (!originalImage) return;

    processBtn.disabled = true;
    downloadAllBtn.disabled = true;
    processedImages = [];
    resultsContainer.innerHTML = '';
    statsContainer.innerHTML = '';
    
    const method = document.getElementById('downsampleMethod').value;
    const factor = parseInt(document.getElementById('downsampleFactor').value);
    const levels = parseInt(document.getElementById('levels').value);
    const showIntermediate = document.getElementById('showIntermediate').checked;
    const maintainAspect = document.getElementById('maintainAspect').checked;

    progressBar.classList.add('active');
    emptyState.classList.add('hidden');
    resultsContainer.classList.remove('hidden');

    try {
        // Add original image
        processedImages.push({
            name: 'Original',
            image: originalImage,
            width: originalImage.width,
            height: originalImage.height,
            size: calculateImageSize(originalImage.width, originalImage.height)
        });

        let currentImg = originalImage;
        
        for (let i = 1; i <= levels; i++) {
            updateProgress(i, levels, `Processing level ${i}/${levels}...`);
            
            await sleep(100); // Simulate processing time
            
            const downsampled = downsampleImage(currentImg, factor, method, maintainAspect);
            
            // Only show intermediate steps if checkbox is checked
            if (showIntermediate || i === levels) {
                processedImages.push({
                    name: `Level ${i} (${factor}x)`,
                    image: downsampled,
                    width: downsampled.width,
                    height: downsampled.height,
                    size: calculateImageSize(downsampled.width, downsampled.height),
                    level: i
                });
            }
            
            currentImg = downsampled;
        }

        updateProgress(100, 100, 'Complete!');
        displayResults();
        displayStats();
        downloadAllBtn.disabled = false;
        
        setTimeout(() => {
            progressBar.classList.remove('active');
        }, 1000);

    } catch (error) {
        console.error('Processing error:', error);
        alert('An error occurred during processing');
        progressBar.classList.remove('active');
    }

    processBtn.disabled = false;
});

// Downsampling Function
function downsampleImage(img, factor, method, maintainAspect) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const newWidth = Math.floor(img.width / factor);
    const newHeight = Math.floor(img.height / factor);
    
    canvas.width = newWidth;
    canvas.height = newHeight;

    if (method === 'nearest') {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
    } else if (method === 'bilinear') {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'low';
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
    } else if (method === 'bicubic') {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
    } else if (method === 'lanczos') {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
    } else {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = img.width;
        tempCanvas.height = img.height;
        tempCtx.drawImage(img, 0, 0);
        
        const imageData = tempCtx.getImageData(0, 0, img.width, img.height);
        const newImageData = ctx.createImageData(newWidth, newHeight);
        
        for (let y = 0; y < newHeight; y++) {
            for (let x = 0; x < newWidth; x++) {
                const pixel = getPooledPixel(imageData, x * factor, y * factor, factor, method);
                const index = (y * newWidth + x) * 4;
                newImageData.data[index] = pixel.r;
                newImageData.data[index + 1] = pixel.g;
                newImageData.data[index + 2] = pixel.b;
                newImageData.data[index + 3] = pixel.a;
            }
        }
        
        ctx.putImageData(newImageData, 0, 0);
    }

    const result = new Image();
    result.src = canvas.toDataURL();
    result.width = newWidth;
    result.height = newHeight;
    return result;
}

function getPooledPixel(imageData, startX, startY, factor, method) {
    const pixels = [];
    
    for (let y = startY; y < startY + factor && y < imageData.height; y++) {
        for (let x = startX; x < startX + factor && x < imageData.width; x++) {
            const index = (y * imageData.width + x) * 4;
            pixels.push({
                r: imageData.data[index],
                g: imageData.data[index + 1],
                b: imageData.data[index + 2],
                a: imageData.data[index + 3]
            });
        }
    }

    if (method === 'average') {
        return {
            r: Math.round(pixels.reduce((sum, p) => sum + p.r, 0) / pixels.length),
            g: Math.round(pixels.reduce((sum, p) => sum + p.g, 0) / pixels.length),
            b: Math.round(pixels.reduce((sum, p) => sum + p.b, 0) / pixels.length),
            a: Math.round(pixels.reduce((sum, p) => sum + p.a, 0) / pixels.length)
        };
    } else if (method === 'max') {
        return {
            r: Math.max(...pixels.map(p => p.r)),
            g: Math.max(...pixels.map(p => p.g)),
            b: Math.max(...pixels.map(p => p.b)),
            a: Math.max(...pixels.map(p => p.a))
        };
    } else if (method === 'min') {
        return {
            r: Math.min(...pixels.map(p => p.r)),
            g: Math.min(...pixels.map(p => p.g)),
            b: Math.min(...pixels.map(p => p.b)),
            a: Math.min(...pixels.map(p => p.a))
        };
    } else if (method === 'median') {
        const median = (arr) => {
            const sorted = [...arr].sort((a, b) => a - b);
            const mid = Math.floor(sorted.length / 2);
            return sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
        };
        return {
            r: median(pixels.map(p => p.r)),
            g: median(pixels.map(p => p.g)),
            b: median(pixels.map(p => p.b)),
            a: median(pixels.map(p => p.a))
        };
    } else if (method === 'gaussian') {
        // Gaussian weighted average (center pixel gets more weight)
        const centerIdx = Math.floor(pixels.length / 2);
        let totalWeight = 0;
        let sumR = 0, sumG = 0, sumB = 0, sumA = 0;
        
        pixels.forEach((p, idx) => {
            const distance = Math.abs(idx - centerIdx);
            const weight = Math.exp(-(distance * distance) / (2 * factor * factor));
            totalWeight += weight;
            sumR += p.r * weight;
            sumG += p.g * weight;
            sumB += p.b * weight;
            sumA += p.a * weight;
        });
        
        return {
            r: Math.round(sumR / totalWeight),
            g: Math.round(sumG / totalWeight),
            b: Math.round(sumB / totalWeight),
            a: Math.round(sumA / totalWeight)
        };
    }
    
    return pixels[0];
}

// Display Results
function displayResults() {
    resultsContainer.innerHTML = '';
    resultsContainer.className = currentView === 'grid' ? 'images-grid' : 'images-list';
    
    processedImages.forEach((imgData, index) => {
        const card = createImageCard(imgData, index);
        resultsContainer.appendChild(card);
    });
}

function createImageCard(imgData, index) {
    const card = document.createElement('div');
    card.className = 'image-card';
    
    const wrapper = document.createElement('div');
    wrapper.className = 'image-wrapper';
    
    const img = document.createElement('img');
    img.src = imgData.image.src;
    img.alt = imgData.name;
    
    wrapper.appendChild(img);
    
    const info = document.createElement('div');
    info.className = 'image-info';
    
    const title = document.createElement('div');
    title.className = 'image-title';
    title.textContent = imgData.name;
    
    const meta = document.createElement('div');
    meta.className = 'image-meta';
    meta.innerHTML = `
        <div class="image-meta-row">
            <span>Dimensions:</span>
            <span>${imgData.width} × ${imgData.height}</span>
        </div>
        <div class="image-meta-row">
            <span>Est. Size:</span>
            <span>${imgData.size}</span>
        </div>
    `;
    
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'download-btn';
    downloadBtn.textContent = '📥 Download';
    downloadBtn.onclick = () => downloadImage(imgData);
    
    info.appendChild(title);
    info.appendChild(meta);
    info.appendChild(downloadBtn);
    
    card.appendChild(wrapper);
    card.appendChild(info);
    
    return card;
}

// Display Stats
function displayStats() {
    if (processedImages.length === 0) return;
    
    const original = processedImages[0];
    const final = processedImages[processedImages.length - 1];
    const reductionRatio = ((original.width * original.height) / (final.width * final.height)).toFixed(2);
    
    statsContainer.innerHTML = `
        <div class="stats-grid">
            <div class="stat-item">
                <div class="stat-value">${processedImages.length}</div>
                <div class="stat-label">Total Images</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${original.width}×${original.height}</div>
                <div class="stat-label">Original Size</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${final.width}×${final.height}</div>
                <div class="stat-label">Final Size</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${reductionRatio}x</div>
                <div class="stat-label">Reduction Ratio</div>
            </div>
        </div>
    `;
    
    statsContainer.classList.remove('hidden');
}

// Download Functions
function downloadImage(imgData) {
    const link = document.createElement('a');
    link.download = `${imgData.name.replace(/\s+/g, '_')}.png`;
    link.href = imgData.image.src;
    link.click();
}

downloadAllBtn.addEventListener('click', () => {
    processedImages.forEach((imgData, index) => {
        setTimeout(() => downloadImage(imgData), index * 200);
    });
});

// View Toggle
document.querySelectorAll('.view-toggle button').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.view-toggle button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentView = btn.dataset.view;
        if (processedImages.length > 0) {
            displayResults();
        }
    });
});

// Utility Functions
function updateProgress(current, total, text) {
    const percent = Math.round((current / total) * 100);
    progressFill.style.width = `${percent}%`;
    progressPercent.textContent = `${percent}%`;
    progressText.textContent = text;
}

function calculateImageSize(width, height) {
    const bytes = width * height * 4;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}