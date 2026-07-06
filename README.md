# Alma de María - Jewelry Showcase Website (FIRST PROTOTYPE ITERATION)

## Overview
Static e-commerce showcase website for **Alma de María**, a Colombian artisan jewelry brand specializing in handcrafted rosaries, bracelets, and escapularios. Features a responsive product catalog with lightbox gallery, WhatsApp ordering integration, and scroll-reveal animations.

## Tech Stack
- **Frontend:** HTML5, CSS3 (Custom Properties, BEM), Vanilla JavaScript
- **Styling:** Responsive CSS Grid/Flexbox, Google Fonts (Playfair Display, Work Sans)
- **Images:** Optimized with Sharp (Node.js) — resized from 4480×6720 originals to web-friendly sizes
- **Infrastructure:** Docker, Nginx (containerized), GitHub Pages (static hosting)
- **CI/CD:** GitHub Actions (automated testing, Docker build, Pages deployment)

## Features
- ✅ Responsive single-page design (mobile-first, 4 breakpoints)
- ✅ 24 rosary product cards with names and prices
- ✅ Lightbox gallery with product details
- ✅ WhatsApp ordering integration (floating button + per-product links)
- ✅ Bracelet collection with pricing cards
- ✅ Escapulario featured section
- ✅ Scroll-reveal animations (IntersectionObserver)
- ✅ Sticky header with scroll effect
- ✅ Mobile navigation drawer
- ✅ Active nav link tracking on scroll
- ✅ Smooth scrolling for anchor links
- ✅ Keyboard accessibility (ESC to close lightbox)
- ✅ Optimized images (69 photos + 6 logos)
- ✅ Lazy loading for off-screen images

## Quick Start

### Prerequisites
- Docker & Docker Compose **or**
- Any static file server (e.g., Live Server, Python http.server, Nginx)
- Node.js 18+ (only for image optimization script)

---

## Option A: Run with Docker (Recommended)

```bash
# Clone and navigate to project
git clone https://github.com/andreaisabelmontana/Alma-De-Maria.git
cd Alma-De-Maria

# Start the containerized website
docker-compose up --build
```

| Service | URL |
|---------|-----|
| **Website** | http://localhost:8080 |

**Stop container:**
```bash
docker-compose down
```

---

## Option B: Run Without Docker (Manual Setup)

### Using Python (built-in):
```bash
cd Alma-De-Maria
python -m http.server 8080
```

### Using Node.js:
```bash
cd Alma-De-Maria
npx serve -l 8080
```

### Using VS Code:
1. Install the "Live Server" extension
2. Right-click `index.html` → "Open with Live Server"

Website available at: **http://localhost:8080**

---

## Image Optimization

The original product photos (4480×6720, 5–15 MB each) are stored in `content/` and excluded from the repo. Optimized versions live in `img/`.

To re-optimize from source photos:
```bash
npm install sharp
node optimize-images.js
```

| Setting | Value |
|---------|-------|
| Product card width | 800px |
| Hero/banner width | 1600px |
| JPEG quality | 80% (MozJPEG) |
| Logo width | 500px (PNG) |

---

## Project Structure

```
Alma-De-Maria/
├── .github/
│   └── workflows/
│       ├── static.yml        # GitHub Pages deployment
│       └── ci.yml            # CI pipeline (test + Docker build)
├── img/                      # Optimized product photos (69 JPGs)
│   └── logo/                 # Optimized brand logos (6 PNGs)
├── tests/
│   └── validate.js           # Automated HTML/link validation tests
├── index.html                # Main single-page website
├── styles.css                # All styles (CSS custom properties, BEM)
├── script.js                 # Interactivity (lightbox, nav, animations)
├── Dockerfile                # Nginx-based production container
├── docker-compose.yml        # Docker Compose configuration
├── nginx.conf                # Nginx server configuration
├── package.json              # Node.js dependencies & test scripts
├── optimize-images.js        # Image optimization script (Sharp)
├── .gitignore                # Excludes content/, node_modules/
└── README.md                 # This file
```

---

## CI/CD Pipeline

GitHub Actions workflows automatically:
1. **Test** — Validate HTML structure, check for broken image references, verify all product cards exist
2. **Docker Build** — Build and verify the Nginx container image
3. **Deploy** — Push static site to GitHub Pages on every merge to `main`

---

## Testing

Run all tests:
```bash
# Install dependencies
npm install

# Run tests
npm test
```

Tests validate:
- HTML structure (required sections: header, hero, rosarios, pulseras, escapulario, contacto, footer)
- All 24 rosary product cards present with names and prices
- All image `src` attributes reference existing files in `img/`
- Logo references are valid
- WhatsApp links are properly formatted
- No broken internal anchor links

---

## Product Catalog

### Rosarios (24 products)
| Product | Price (COP) |
|---------|-------------|
| Rosario de la Paz | $150.000 |
| Rosario Lourdes | $120.000 |
| Rosario Beatriz | $150.000 |
| Rosario Elsa | $150.000 |
| Rosario Sofía | $120.000 |
| Rosario Silvia | $150.000 |
| Rosario Fátima | $120.000 |
| Rosario Paz | $120.000 |
| Rosario Esperanza Mini | $150.000 |
| Rosario Niña Maria | $50.000 |
| Rosario Jose María | $120.000 |
| Rosario Lucía | $120.000 |
| Rosario Sagrada Familia | $150.000 |
| Rosario María | $100.000 |
| Rosario Eulalia | $120.000 |
| Rosario Claudia | $150.000 |
| Rosario Andrea | $120.000 |
| Rosario Niña María Rosado | $50.000 |
| Rosario Pio | $120.000 |
| Rosario Isabel | $120.000 |
| Rosario Ana | $150.000 |
| Rosario Andrés | $120.000 |
| Rosario Laura | $150.000 |
| Rosario Alfonso | $120.000 |

### Pulseras
| Product | Price (COP) |
|---------|-------------|
| Pulsera Individual | $60.000 |
| Set de 3 Pulseras | $170.000 |

### Escapulario
| Product | Price (COP) |
|---------|-------------|
| Escapulario | $100.000 |

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Container port for Nginx | `80` |
| `HOST_PORT` | Host port mapping | `8080` |

---

## Contact & Social
- **WhatsApp:** +57 323 712 6697
- **Instagram:** [@alma.de.maria.joyas](https://instagram.com/alma.de.maria.joyas)
- **Payment methods:** Efectivo, Nequi, Bancolombia

---

## Live Site
**https://andreaisabelmontana.github.io/Alma-De-Maria/**

---

## License
MIT License
