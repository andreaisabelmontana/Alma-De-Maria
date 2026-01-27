const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SRC_PHOTOS = path.join(__dirname, 'content', 'Fotos de Producto');
const SRC_LOGOS = path.join(__dirname, 'content', 'Logo');
const OUT_DIR = path.join(__dirname, 'img');
const OUT_LOGOS = path.join(OUT_DIR, 'logo');

const PRODUCT_WIDTH = 800;   // product card images
const HERO_WIDTH = 1600;     // hero/banner images
const JPEG_QUALITY = 80;

// Hero/banner/lifestyle images that need higher resolution
const HERO_IMAGES = new Set([
    '5H0A2080.jpg',  // hero bg
    '5H0A2022.jpg',  // about
    '5H0A2051.jpg',  // banner
    '5H0A2038.jpg',  // banner 2
    '5H0A2070.jpg',  // pulseras main
    '5H0A2062-Editar.jpg', // escapulario
]);

async function optimize() {
    // Create output directories
    if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
    if (!fs.existsSync(OUT_LOGOS)) fs.mkdirSync(OUT_LOGOS, { recursive: true });

    // Optimize product photos
    const photos = fs.readdirSync(SRC_PHOTOS).filter(f => /\.jpe?g$/i.test(f));
    console.log(`Found ${photos.length} product photos to optimize...`);

    let done = 0;
    for (const file of photos) {
        const srcPath = path.join(SRC_PHOTOS, file);
        const outPath = path.join(OUT_DIR, file);
        const width = HERO_IMAGES.has(file) ? HERO_WIDTH : PRODUCT_WIDTH;

        try {
            await sharp(srcPath)
                .resize(width, null, { withoutEnlargement: true })
                .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
                .toFile(outPath);
            done++;
            if (done % 10 === 0) console.log(`  ${done}/${photos.length} done`);
        } catch (err) {
            console.error(`  Error processing ${file}: ${err.message}`);
        }
    }
    console.log(`Product photos: ${done}/${photos.length} optimized.`);

    // Copy logos (PNGs, already small)
    const logos = fs.readdirSync(SRC_LOGOS).filter(f => /\.png$/i.test(f));
    for (const file of logos) {
        const srcPath = path.join(SRC_LOGOS, file);
        const outPath = path.join(OUT_LOGOS, file);
        try {
            await sharp(srcPath)
                .resize(500, null, { withoutEnlargement: true })
                .png({ quality: 85 })
                .toFile(outPath);
        } catch (err) {
            console.error(`  Error processing logo ${file}: ${err.message}`);
        }
    }
    console.log(`Logos: ${logos.length} optimized.`);

    console.log('\nDone! Optimized images saved to ./img/');
}

optimize().catch(console.error);
