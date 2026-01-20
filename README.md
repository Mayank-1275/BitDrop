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

#### Option 1: Run Locally
1.  Clone the repository:
    ```bash
    git clone [https://github.com/Mayank-1275/BitDrop](https://github.com/Mayank-1275/BitDrop)
    ```
2.  Navigate to the directory:
    ```bash
    cd bitdrop
    ```
3.  Open `index.html` in any modern web browser (Chrome, Firefox, Edge).

#### Option 2: Live Demo
[https://mayank-1275.github.io/BitDrop/]

## 🧪 Technical Implementation

Unlike traditional Python-based tools that rely on NumPy/OpenCV, BitDrop implements pooling algorithms directly via pixel manipulation in the HTML5 Canvas API. This allows for:
1.  **Zero-dependency deployment.**
2.  **Educational transparency:** The code demonstrates how kernel-based operations (like $2\times2$ sliding windows) work at the pixel array level.

   ## 🧪 Reliability & Testing
BitDrop follows strict rigorous testing standards. We include an automated browser-based test suite that validates:
1.  **Core Algorithms:** Max, Min, Average, and Median Pooling.
2.  **Degradation Logic:** Verifies correct downsampling across 3 levels (Original → 2x → 4x → 8x).
3.  **Mathematical Accuracy:** Ensures output dimensions match theoretical expectations ($W_{out} = \lfloor W_{in} / Factor \rfloor$).

### 🔴 Live Test Demo
You can run the automated verification suite directly in your browser without installing dependencies:
👉 **[Run Automated Test Suite](https://mayank-1275.github.io/BitDrop/test/)**

*(This suite processes a sample image in real-time and validates the pixel manipulation logic)*.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ✍️ Author

**Mayank Kumar Mishra** Independent Researcher
