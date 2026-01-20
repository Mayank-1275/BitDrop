# Contributing to BitDrop

First off, thank you for considering contributing to BitDrop! It's people like you that make the open-source community such an amazing place to learn, inspire, and create.

## 💡 How Can You Contribute?

We are currently looking for contributions in the following areas:

### 1. New Features (Priority)
We want to expand BitDrop beyond just downsampling. We need help implementing:
* **Image Cropping:** A UI tool to crop images before processing.
* **Image Resizing:** Custom dimension inputs (Width x Height) aside from standard scaling factors.
* **Format Conversion:** Options to export as JPEG/WebP (currently defaults to PNG).

### 2. Reporting Bugs
* If you find a bug, please open an Issue on GitHub.
* Include steps to reproduce the bug and browser version.

### 3. Improving Documentation
* Fix typos or improve the clarity of `README.md` or code comments.

---

## 🚀 How to Submit a Pull Request (PR)

1.  **Fork the Repository:** Click the 'Fork' button at the top right of this page.
2.  **Clone your Fork:**
    ```bash
    git clone [https://github.com/your-username/BitDrop.git](https://github.com/your-username/BitDrop.git)
    ```
3.  **Create a Branch:**
    ```bash
    git checkout -b feature/AmazingFeature
    ```
4.  **Make Changes:** Write your code. Since this is a client-side app, you can test simply by opening `index.html` in your browser.
5.  **Commit your Changes:**
    ```bash
    git commit -m 'Add some AmazingFeature'
    ```
6.  **Push to the Branch:**
    ```bash
    git push origin feature/AmazingFeature
    ```
7.  **Open a Pull Request:** Go to the original BitDrop repository and click "New Pull Request".

## 🧪 Testing Guidelines
* Since BitDrop relies on the Canvas API, please test your changes in **Chrome** and **Firefox** to ensure cross-browser compatibility.
* Check the console for any JavaScript errors before submitting.

Thank you for your help!
