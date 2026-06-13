# SGSC Banner Studio — SSC-26

A browser-based photo collage banner generator built for the SGSC SSC Batch 2026 (All Boys). Each friend can select a featured photo, choose a layout, and export a high-quality banner — all without any backend, app install, or account.

---

## Features

- **61-image collage** — places 60 friends around one featured main image
- **3 layout modes** — Two-Column, Two-Row, and Center (picture frame)
- **Drag-to-resize** — a live divider bar lets you adjust the split between the grid and the main image
- **One-click photo swap** — click any thumbnail to make it the featured image; the old one returns to its correct serial slot automatically
- **Custom canvas** — adjust page dimensions, presets (Facebook Banner, YouTube Banner, OG Image, and more), image gap, margin, grid arrangement (10×6, 12×5, 6×10, etc.), and zoom
- **High-res export** — PNG / JPG / WebP at 0.5x up to 8x scale with a live progress bar and console log
- **Signature overlay** — "Muhtasim Rahman" in a signature font on the main image area
- **Secure** — right-click, F12, and browser devtools keyboard shortcuts are blocked to discourage direct asset download
- **Responsive** — works on desktop and mobile; sidebar collapses into a slide-in drawer on small screens

---

## Project Structure

```
sgsc-friends-ssc26/
├── index.html          Main page
├── style.css           All styles (Inter + Dancing Script)
├── script.js           All interactivity and export logic
├── images/
│   ├── 01.jpg          Friend photos (01 – 61)
│   ├── ...
│   ├── 61.jpg
│   ├── sgsc.gif        School logo (navbar)
│   └── muhtasim.webp   Author avatar (footer badge)
└── README.md
```

---

## How to Use

### Setup

1. Clone or download this repository.
2. Place all 61 friend photos inside `images/` named `01.jpg` through `61.jpg`.
3. Add the school logo as `images/sgsc.gif` (or `images/sgsc.png`).
4. Serve the folder from a local server — for example:

```bash
# Python 3
python -m http.server 8080

# Node.js (npx)
npx serve .
```

Then open `http://localhost:8080` in your browser.

> Running directly from the file system (`file://`) may block image rendering in exports due to browser security policies. A local server or GitHub Pages is recommended.

### Workflow

| Step | Action |
|------|--------|
| 1 | Choose a page preset or enter custom dimensions |
| 2 | Select a layout: 2-Column, 2-Row, or Center |
| 3 | Click any thumbnail to make it the featured image |
| 4 | Drag the divider bar to adjust the size ratio |
| 5 | Fine-tune gap, margin, grid columns, and zoom from the sidebar |
| 6 | Pick a format and scale in the Export panel |
| 7 | Click **Download Banner** — file saves as `sgsc-friends-ssc26-by-turzo(WxH).png` |

### Page Presets

| Preset | Dimensions |
|--------|-----------|
| FB Banner | 1640 × 624 px |
| FB Cover | 820 × 312 px |
| YT Banner | 2560 × 1440 px |
| OG Image | 1200 × 630 px |
| Square | 1080 × 1080 px |
| Portrait | 1080 × 1350 px |

### Export Scales

| Scale | Use case |
|-------|----------|
| 0.5x | Preview / draft |
| 1x | Standard web |
| 2x | Retina / high-DPI |
| 3x | Large print |
| 4x – 8x | Very large print (may be slow) |

---

## Tech Stack

- Vanilla HTML, CSS, and JavaScript — no frameworks, no build step
- [Inter](https://fonts.google.com/specimen/Inter) — UI font
- [Dancing Script](https://fonts.google.com/specimen/Dancing+Script) — signature overlay font
- [Font Awesome 6](https://fontawesome.com/) — icons
- [html2canvas 1.4](https://html2canvas.hertzen.com/) — client-side canvas export

---

## Deployment

This is a static site. Push to GitHub and enable GitHub Pages under **Settings → Pages → Deploy from branch**.

```
Repository: sgsc-friends-ssc26
GitHub Pages URL: https://mdturzo999.github.io/sgsc-friends-ssc26/
```

---

## Author

**Muhtasim Rahman**
Portfolio: [mdturzo.web.app](https://mdturzo.web.app)
GitHub: [@mdturzo999](https://github.com/mdturzo999)
LinkedIn: [mdturzo999](https://linkedin.com/in/mdturzo999)
YouTube: [@mdturzo999](https://youtube.com/@mdturzo999)
Facebook: [mdturzo999](https://facebook.com/mdturzo999)

---

## License

This project is for personal, non-commercial use by SGSC SSC-26 batch members.
&copy; 2025 Muhtasim Rahman. All rights reserved.
