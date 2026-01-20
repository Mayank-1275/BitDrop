# BitDrop: Advanced Image Downsampling & Analysis Tool

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status](https://joss.theoj.org/papers/status_badge_placeholder.svg)](https://joss.theoj.org/papers/status_badge_placeholder)

**BitDrop** is a lightweight, client-side web application designed to demonstrate, analyze, and perform various image downsampling techniques. It provides a real-time environment for researchers and students to visualize the impact of different pooling strategies and interpolation methods on image structure and quality.

## 🚀 Features

* **Multiple Downsampling Methods:**
    * **Pooling Strategies:** Max, Min, Average, Median.
    * **Interpolation:** Bilinear, Bicubic, Lanczos, Nearest Neighbor.
    * **Filtering:** Gaussian Pooling (for aliasing control).
* **Real-Time Processing:** Built using vanilla JavaScript and the Canvas API for instant feedback without server latency.
* **Iterative Analysis:** Support for multi-level downsampling (e.g., Level 1 to Level 3) to visualize progressive information loss.
* **Privacy Focused:** All processing happens in the browser; no images are uploaded to external servers.
* **Visual Comparison:** Side-by-side Grid and List views to compare original vs. processed outputs.

## 🛠️ Installation & Usage

BitDrop is a client-side application requiring no complex backend setup.

### Option 1: Run Locally
1.  Clone the repository:
    ```bash
    git clone [https://github.com/your-username/bitdrop.git](https://github.com/your-username/bitdrop.git)
    ```
2.  Navigate to the directory:
    ```bash
    cd bitdrop
    ```
3.  Open `index.html` in any modern web browser (Chrome, Firefox, Edge).

### Option 2: Live Demo
[Insert Link to GitHub Pages if available]

## 🧪 Technical Implementation

Unlike traditional Python-based tools that rely on NumPy/OpenCV, BitDrop implements pooling algorithms directly via pixel manipulation in the HTML5 Canvas API. This allows for:
1.  **Zero-dependency deployment.**
2.  **Educational transparency:** The code demonstrates how kernel-based operations (like $2\times2$ sliding windows) work at the pixel array level.

## 🤝 Contributing

Contributions are welcome! Please read `CONTRIBUTING.md` for details on our code of conduct, and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ✍️ Author

**Mayank Kumar Mishra** Independent Researcher
