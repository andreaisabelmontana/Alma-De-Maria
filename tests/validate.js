/**
 * Alma de María - Automated Validation Tests
 *
 * Validates HTML structure, image references, product catalog completeness,
 * and link integrity for the static website.
 *
 * Usage: node tests/validate.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');

let passed = 0;
let failed = 0;

function test(name, fn) {
    try {
        fn();
        passed++;
        console.log(`  ✓ ${name}`);
    } catch (err) {
        failed++;
        console.log(`  ✗ ${name}`);
        console.log(`    ${err.message}`);
    }
}

function assert(condition, message) {
    if (!condition) throw new Error(message);
}

// ========================================
// 1. HTML Structure Tests
// ========================================
console.log('\n── HTML Structure ──');

test('index.html exists', () => {
    assert(fs.existsSync(path.join(ROOT, 'index.html')), 'index.html not found');
});

test('styles.css exists', () => {
    assert(fs.existsSync(path.join(ROOT, 'styles.css')), 'styles.css not found');
});

test('script.js exists', () => {
    assert(fs.existsSync(path.join(ROOT, 'script.js')), 'script.js not found');
});

test('has DOCTYPE declaration', () => {
    assert(html.includes('<!DOCTYPE html>'), 'Missing DOCTYPE');
});

test('has lang="es" attribute', () => {
    assert(html.includes('lang="es"'), 'Missing Spanish language attribute');
});

test('has viewport meta tag', () => {
    assert(html.includes('viewport'), 'Missing viewport meta tag');
});

test('has meta description', () => {
    assert(html.includes('meta name="description"'), 'Missing meta description');
});

test('references styles.css', () => {
    assert(html.includes('href="styles.css"'), 'Missing styles.css link');
});

test('references script.js', () => {
    assert(html.includes('src="script.js"'), 'Missing script.js reference');
});

// ========================================
// 2. Required Sections
// ========================================
console.log('\n── Required Sections ──');

const requiredSections = [
    { id: 'header', label: 'Header/Navigation' },
    { id: 'inicio', label: 'Hero section' },
    { id: 'nosotros', label: 'About section' },
    { id: 'rosarios', label: 'Rosarios section' },
    { id: 'pulseras', label: 'Pulseras section' },
    { id: 'escapulario', label: 'Escapulario section' },
    { id: 'contacto', label: 'Contact section' },
];

requiredSections.forEach(({ id, label }) => {
    test(`has ${label} (id="${id}")`, () => {
        assert(html.includes(`id="${id}"`), `Missing section with id="${id}"`);
    });
});

test('has footer', () => {
    assert(html.includes('<footer'), 'Missing footer element');
});

test('has lightbox', () => {
    assert(html.includes('id="lightbox"'), 'Missing lightbox element');
});

// ========================================
// 3. Product Catalog Completeness
// ========================================
console.log('\n── Product Catalog (24 Rosarios) ──');

const expectedRosarios = [
    'Rosario de la Paz',
    'Rosario Lourdes',
    'Rosario Beatriz',
    'Rosario Elsa',
    'Rosario Silvia',
    'Rosario Esperanza Mini',
    'Rosario Mar\u00eda',
    'Rosario Sagrada Familia',
    'Rosario Eulalia',
    'Rosario Claudia',
    'Rosario Andrea',
    'Rosario Pio',
    'Rosario Isabel',
    'Rosario Ana',
    'Rosario Laura',
    'Rosario Alfonso',
];

expectedRosarios.forEach(name => {
    test(`has product: ${name}`, () => {
        // Check for plain text or HTML-encoded version
        const plainCheck = html.includes(name);
        const encodedName = name
            .replace(/í/g, '&iacute;')
            .replace(/á/g, '&aacute;')
            .replace(/é/g, '&eacute;')
            .replace(/ñ/g, '&ntilde;')
            .replace(/ó/g, '&oacute;')
            .replace(/ú/g, '&uacute;');
        const encodedCheck = html.includes(encodedName);
        assert(plainCheck || encodedCheck, `Product "${name}" not found in HTML`);
    });
});

test('has 24 product cards total', () => {
    const cardCount = (html.match(/class="product-card /g) || []).length;
    assert(cardCount === 24, `Expected 24 product cards, found ${cardCount}`);
});

// ========================================
// 4. Image Reference Validation
// ========================================
console.log('\n── Image References ──');

const imgDir = path.join(ROOT, 'img');
const logoDir = path.join(ROOT, 'img', 'logo');

test('img/ directory exists', () => {
    assert(fs.existsSync(imgDir), 'img/ directory not found');
});

test('img/logo/ directory exists', () => {
    assert(fs.existsSync(logoDir), 'img/logo/ directory not found');
});

// Extract all img src attributes from HTML
const srcRegex = /src="(img\/[^"]+)"/g;
const imgRefs = [];
let match;
while ((match = srcRegex.exec(html)) !== null) {
    imgRefs.push(match[1]);
}

test(`found image references in HTML (${imgRefs.length})`, () => {
    assert(imgRefs.length > 0, 'No image references found');
});

// Check each referenced image exists
const missingImages = [];
imgRefs.forEach(ref => {
    const filePath = path.join(ROOT, ref);
    if (!fs.existsSync(filePath)) {
        missingImages.push(ref);
    }
});

test('all referenced images exist on disk', () => {
    assert(
        missingImages.length === 0,
        `Missing images: ${missingImages.join(', ')}`
    );
});

// ========================================
// 5. WhatsApp Integration
// ========================================
console.log('\n── WhatsApp Integration ──');

test('has WhatsApp floating button', () => {
    assert(html.includes('wa-float'), 'Missing WhatsApp floating button');
});

test('WhatsApp links use correct number', () => {
    const waLinks = html.match(/wa\.me\/\d+/g) || [];
    assert(waLinks.length > 0, 'No WhatsApp links found');
    waLinks.forEach(link => {
        assert(link.includes('573237126697'), `Wrong WhatsApp number in: ${link}`);
    });
});

test('has per-product WhatsApp ordering (lightbox)', () => {
    assert(html.includes('id="lightbox-wa"'), 'Missing lightbox WhatsApp link');
});

// ========================================
// 6. Accessibility & SEO
// ========================================
console.log('\n── Accessibility & SEO ──');

test('images have alt attributes', () => {
    const imgsWithoutAlt = (html.match(/<img(?![^>]*alt=)[^>]*>/g) || []);
    assert(
        imgsWithoutAlt.length === 0,
        `Found ${imgsWithoutAlt.length} images without alt attributes`
    );
});

test('has title tag', () => {
    assert(html.includes('<title>'), 'Missing title tag');
});

test('title contains brand name', () => {
    assert(
        html.includes('Alma de Mar') || html.includes('Alma de Mar&iacute;a'),
        'Title does not contain brand name'
    );
});

// ========================================
// 7. Navigation Links
// ========================================
console.log('\n── Navigation ──');

const navLinks = ['#inicio', '#nosotros', '#rosarios', '#pulseras', '#escapulario', '#contacto'];

navLinks.forEach(link => {
    test(`nav link ${link} exists`, () => {
        assert(html.includes(`href="${link}"`), `Missing nav link: ${link}`);
    });
});

// ========================================
// 8. Docker Files
// ========================================
console.log('\n── Docker Configuration ──');

test('Dockerfile exists', () => {
    assert(fs.existsSync(path.join(ROOT, 'Dockerfile')), 'Dockerfile not found');
});

test('docker-compose.yml exists', () => {
    assert(fs.existsSync(path.join(ROOT, 'docker-compose.yml')), 'docker-compose.yml not found');
});

test('nginx.conf exists', () => {
    assert(fs.existsSync(path.join(ROOT, 'nginx.conf')), 'nginx.conf not found');
});

// ========================================
// Summary
// ========================================
console.log('\n══════════════════════════════════');
console.log(`  Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
console.log('══════════════════════════════════\n');

process.exit(failed > 0 ? 1 : 0);
