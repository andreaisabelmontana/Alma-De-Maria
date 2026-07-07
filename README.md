# Alma de María — Artisan Jewelry Store

Static e-commerce storefront for **Alma de María**, a Colombian artisan jewelry brand (handcrafted rosaries, bracelets and escapularios). Built as a real multi-page store: product pages, persistent cart, dual-currency pricing (USD/COP) and a guided checkout that completes each order through WhatsApp — the brand's actual sales channel.

**Live site:** https://andreaisabelmontana.github.io/Alma-De-Maria/

## How buying works

1. Browse the catalog (26 products, 24 unique rosaries) and open any product page.
2. Add to cart (drawer with quantities and variants) or hit the purple express-checkout button.
3. Checkout in three steps — email → shipping address → review.
4. "Complete order" opens WhatsApp with a pre-composed order message (reference number, items, totals in both currencies, shipping details). Payment (Nequi / Bancolombia / cash) and shipping cost are confirmed there.

No card data is collected or processed anywhere on the site — it is a static page; WhatsApp is the order/payment confirmation channel.

## Currency

The catalog is priced in COP. Prices display in **USD by default** using a fixed reference rate (4 000 COP/USD, defined once in `js/store-core.js`), with a `Country/region` selector in the footer to switch to COP. Checkout shows the total in the selected currency plus the COP equivalent.

## Architecture

```
index.html            Home: hero, collections (grids rendered from the catalog), about, contact
product.html?id=…     Product detail: gallery, variants, quantity, add-to-cart / express checkout
checkout.html         3-step checkout (contact → shipping → review) + live order summary
faq.html              Shipping, payments, currency, care
js/data.js            Product catalog — single source of truth (UMD: browser + Node)
js/store-core.js      Pure store logic: currency, cart ops, order message (UMD, fully unit-tested)
js/app.js             Shared runtime: cart drawer, localStorage persistence, currency switcher
js/product-page.js    Product page controller
js/checkout-page.js   Checkout controller
styles.css            Single stylesheet (cream editorial theme, responsive, reduced-motion aware)
tests/validate.js     39 checks: catalog integrity, cart/currency unit tests, page structure
```

Vanilla HTML/CSS/JS — no build step, no framework, deployable on any static host.

## Features

- Product detail pages with image galleries and variant pricing (e.g. bracelet single vs. set of 3)
- Cart drawer with quantity controls, persisted in `localStorage` across pages/visits
- Dual currency (USD default / COP) — every price on every page re-renders on switch
- Three-step checkout with validation and a live order summary column
- WhatsApp order handoff with generated order reference
- Country/region + payment-method footer, announcement bar, mobile nav drawer
- Lazy-loaded images, IntersectionObserver reveals, `prefers-reduced-motion` support

## Run locally

```bash
# Docker
docker-compose up --build        # → http://localhost:8080

# or any static server
python -m http.server 8080
npx serve -l 8080
```

## Tests

```bash
npm test        # node tests/validate.js — 39 checks, also run in CI
```

CI (GitHub Actions) runs the test suite and a Docker build on every push; a second workflow deploys the site to GitHub Pages from `main`.

## License

MIT — see [LICENSE](LICENSE). Product photography © Alma de María.
