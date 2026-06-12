# SGSC Friends Collage – SSC-26

> A lightweight, client‑side photo collage generator for the SSC‑26 batch of SGSC.  
> Build custom Facebook‑style banners using 61 student photos with one click.

---

## Features

- **61‑image collage** – 1 main featured photo + 60 thumbnails in a responsive grid.
- **Click‑to‑swap** – Tap any thumbnail to promote it as the main image; the previous main returns to its numeric slot (`01.jpg`–`61.jpg`).
- **5 layout modes** – Landscape (main left/right), portrait (main top/bottom), and centre‑focus.
- **Grid density** – Choose between `10×6` or `12×5` for the thumbnail area.
- **Preset ratios** – Facebook Cover (851×315), YouTube Banner (2560×1440), Twitter Header (1500×500), and more.
- **Custom dimensions** – Enter any width/height in pixels.
- **Image export** – Download the final collage as a high‑quality PNG via [Exporter Pro](https://muhtasim-rahman.github.io/exporter-pro/).
- **Fully offline** – No backend, no database, all static files.

---

## Tech Stack

- HTML5, CSS3 (custom properties, grid, flex), vanilla JavaScript
- [Font Awesome 6](https://fontawesome.com/) – icons
- [Google Fonts](https://fonts.google.com/) – Inter & Outfit
- [Exporter Pro](https://muhtasim-rahman.github.io/exporter-pro/export.js) – image download

---

## File Structure

+++
sgsc-friends-ssc26/
├── index.html        # main application (CSS & JS embedded)
├── README.md
└── images/
    ├── sgsc.jpg      # navbar logo (replaceable)
    ├── 01.jpg
    ├── 02.jpg
    ├── ...
    └── 61.jpg
+++

*All photos must follow the naming `01.jpg`–`61.jpg`. Aspect ratio 4:3 is recommended to minimise cropping.*

---

## Getting Started

1. **Clone the repository**
   +++
   git clone https://github.com/Muhtasim-Rahman/sgsc-friends-ssc26.git
   cd sgsc-friends-ssc26
   +++

2. **Add your photos** – Place 61 student photos inside the `images/` folder using the correct filenames.

3. **Open** `index.html` in any modern browser. No server required.

4. **Customise**  
   - Use the control panel to change layout, grid density, and aspect ratio.  
   - Click any thumbnail to set it as the main image.  
   - Use the **Export** button (automatically added) to save the collage.

---

## Workflow Summary

| Step | Action |
|------|--------|
| 1 | Select a **Layout** (landscape, portrait, centre) |
| 2 | Pick a **Grid Density** (`10×6` or `12×5`) |
| 3 | Choose an **Aspect Ratio** (preset or custom) |
| 4 | **Click a thumbnail** to swap the main photo |
| 5 | Press **Export** to download the banner |

A detailed visual guide is embedded on the page itself.

---

## Customisation

- **Change the default main image** – Edit the `state.mainImage` variable inside the `<script>` tag in `index.html`.
- **Modify grid proportions** – In the `updatePageSize()` function, adjust the width/height ratios (currently 72/28% landscape, 62/38% portrait).
- **Branding** – Replace `images/sgsc.jpg` with your own logo. Footer links can be updated directly in the HTML.

---

## Author

**Muhtasim Rahman**  
- Portfolio: [mdturzo.web.app](https://mdturzo.web.app)  
- GitHub: [@Muhtasim-Rahman](https://github.com/Muhtasim-Rahman)  
- LinkedIn: [muhtasim-rahman](https://linkedin.com/in/muhtasim-rahman)  
- YouTube: [@muhtasimrahman](https://youtube.com/@muhtasimrahman)  
- Facebook: [muhtasim.rahman.turzo](https://facebook.com/muhtasim.rahman.turzo)

---

## License

This project is open‑source under the [MIT License](LICENSE).  
Feel free to use, modify, and share it.