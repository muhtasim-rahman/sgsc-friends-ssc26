# SGSC SSC-26 Batch Banner Generator 🎓📸

A highly customizable, client-side web application designed to generate dynamic photo collage banners for the boys of the SGSC SSC-26 batch. This tool arranges exactly 61 images into various geometric patterns, allowing any specific friend's picture to be the hero image.

## ✨ Features

### 61-Image Engine
- Dynamically aligns exactly **1 main image** and **60 surrounding images** perfectly without breaking layout.

### Interactive Swapping
- Click on any of the 60 smaller images in the grid to instantly swap it with the main image.
- The previous main image automatically sorts back into its serial position (**01 to 61**).

### 5 Custom Layouts
- Left & Right (Landscape dual-column split)
- Top & Bottom (Portrait row split)
- Center (Complex CSS Grid dense mapping wrapping around a central image)

### Responsive Aspect Ratios
- Facebook Banner (**820:312**)
- Widescreen (**16:9**)
- Portrait (**4:5**)

### Touch & Slider Adjust
- Custom slider to manually configure the exact aspect ratio on the fly.

### Auto Export Ready
- Integrated with Exporter-Pro for 1-click high-resolution DOM-to-Image downloading.

### Smart Fallbacks
- Integrated placeholder generation so the UI never breaks if an image is missing locally.

---

## 🚀 How to Run Locally

Because the project relies on direct file paths for the specific 61 images, no build step or node package is required. It's built with raw vanilla Web technologies and Tailwind CSS via CDN.

### 1. Clone the Repository

```bash
git clone https://github.com/muhtasim-rahman/sgsc-friends-ssc26.git
cd sgsc-friends-ssc26
```

### 2. Prepare the Images Folder

Ensure you have an `images/` directory at the root level.

Place your 61 images inside the folder, strictly named:

```text
01.jpg
02.jpg
03.jpg
...
61.jpg
```

Also include:

```text
sgsc.jpg
```

for the navbar logo.

### 3. Launch the App

Simply open:

```text
index.html
```

in your favorite modern browser.

No local server is required (unless dictated by your export script's CORS policy).

---

## 🛠️ Architecture & Tech Stack

### HTML5
- Semantic structure
- Accessible `.page` canvas container

### CSS3
- Flexbox layouts
- CSS Grid
- `grid-auto-flow: dense` for the complex Center layout algorithm

### JavaScript (ES6)
- State management
- DOM manipulation
- Pad mapping
- Array filtering to maintain the 01–61 serial continuity during image swaps

### Tailwind CSS
- UI framework and control panels (via CDN)

### FontAwesome & Google Fonts (Inter)
- Beautiful typography and icons

---

## 🤝 Author & Contributions

Designed and developed by **Muhtasim Rahman**.

### 🌐 Portfolio
https://mdturzo.web.app

### 💼 GitHub
https://github.com/muhtasim-rahman

Pull requests for layout enhancements or code optimizations are highly welcome!

---

## 📜 License

© 2026 SGSC SSC-26 Batch. All rights reserved.
