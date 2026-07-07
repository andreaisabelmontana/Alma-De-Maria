/**
 * Alma de María — automated validation tests.
 *
 * 1. Catalog integrity (js/data.js): ids, prices, images on disk.
 * 2. Store logic (js/store-core.js): currency conversion, cart ops, order message.
 * 3. Page structure: every HTML page, its assets and its wiring.
 * 4. Infrastructure files.
 *
 * Usage: node tests/validate.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA = require(path.join(ROOT, 'js', 'data.js'));
const Core = require(path.join(ROOT, 'js', 'store-core.js'));

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

function assertEq(actual, expected, label) {
    assert(actual === expected, `${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

function read(file) {
    return fs.readFileSync(path.join(ROOT, file), 'utf-8');
}

// ========================================
// 1. Catalog integrity
// ========================================
console.log('\n── Catalog (js/data.js) ──');

test('catalog has at least 37 products', () => {
    assert(DATA.PRODUCTS.length >= 37, `Found only ${DATA.PRODUCTS.length}`);
});

test('catalog has 33 rosarios', () => {
    const rosarios = DATA.PRODUCTS.filter(p => p.category === 'rosarios');
    assertEq(rosarios.length, 33, 'rosario count');
});

test('product ids are unique', () => {
    const ids = DATA.PRODUCTS.map(p => p.id);
    assertEq(new Set(ids).size, ids.length, 'unique ids');
});

test('every product has a positive COP price', () => {
    DATA.PRODUCTS.forEach(p => {
        assert(Number.isFinite(p.priceCop) && p.priceCop > 0, `${p.id} has bad price ${p.priceCop}`);
    });
});

test('every product image exists on disk', () => {
    const missing = [];
    DATA.PRODUCTS.forEach(p => {
        [p.image].concat(p.images || []).forEach(src => {
            if (!fs.existsSync(path.join(ROOT, src))) missing.push(`${p.id}: ${src}`);
        });
    });
    assert(missing.length === 0, `Missing images: ${missing.join(', ')}`);
});

test('every product category belongs to a collection', () => {
    const collections = new Set(DATA.COLLECTIONS.map(c => c.id));
    DATA.PRODUCTS.forEach(p => {
        assert(collections.has(p.category), `${p.id} has unknown category ${p.category}`);
    });
});

test('variant products have valid variant prices', () => {
    DATA.PRODUCTS.filter(p => p.variants).forEach(p => {
        assert(p.variants.length >= 2, `${p.id} has fewer than 2 variants`);
        p.variants.forEach(v => {
            assert(v.name && Number.isFinite(v.priceCop) && v.priceCop > 0, `${p.id} variant broken`);
        });
    });
});

test('WhatsApp number configured', () => {
    assertEq(DATA.WHATSAPP_NUMBER, '573237126697', 'WhatsApp number');
});

// ========================================
// 2. Store logic
// ========================================
console.log('\n── Currency conversion ──');

test('COP→USD uses the documented reference rate', () => {
    assertEq(Core.COP_PER_USD, 4000, 'rate');
    assertEq(Core.copToUsd(150000), 37.5, '150.000 COP in USD');
});

test('formatPrice renders USD with cents', () => {
    assertEq(Core.formatPrice(150000, 'USD'), '$37.50', 'USD format');
    assertEq(Core.formatPrice(50000, 'USD'), '$12.50', 'USD format');
});

test('formatPrice renders COP with dot separators', () => {
    assertEq(Core.formatPrice(150000, 'COP'), '$150.000 COP', 'COP format');
    assertEq(Core.formatPrice(1234567, 'COP'), '$1.234.567 COP', 'COP format');
});

console.log('\n── Cart operations ──');

test('addItem adds a new line and merges repeats', () => {
    let cart = Core.addItem([], 'rosario-ana', null, 1);
    cart = Core.addItem(cart, 'rosario-ana', null, 2);
    assertEq(cart.length, 1, 'lines');
    assertEq(cart[0].qty, 3, 'merged qty');
});

test('variants are separate cart lines', () => {
    let cart = Core.addItem([], 'pulsera-cristal-azul', 'Individual', 1);
    cart = Core.addItem(cart, 'pulsera-cristal-azul', 'Set de 3', 1);
    assertEq(cart.length, 2, 'lines');
});

test('setQty updates and removes at zero', () => {
    let cart = Core.addItem([], 'rosario-ana', null, 2);
    cart = Core.setQty(cart, 'rosario-ana', 5);
    assertEq(cart[0].qty, 5, 'set qty');
    cart = Core.setQty(cart, 'rosario-ana', 0);
    assertEq(cart.length, 0, 'removed at zero');
});

test('removeItem removes only the matching line', () => {
    let cart = Core.addItem([], 'rosario-ana', null, 1);
    cart = Core.addItem(cart, 'rosario-laura', null, 1);
    cart = Core.removeItem(cart, 'rosario-ana');
    assertEq(cart.length, 1, 'lines');
    assertEq(cart[0].id, 'rosario-laura', 'remaining line');
});

test('cartSubtotalCop honours variant pricing', () => {
    let cart = Core.addItem([], 'pulsera-cristal-azul', 'Set de 3', 1);
    cart = Core.addItem(cart, 'rosario-nina-maria', null, 2);
    // 170.000 + 2 × 50.000 = 270.000
    assertEq(Core.cartSubtotalCop(cart, DATA.PRODUCTS), 270000, 'subtotal');
});

test('cartCount sums quantities', () => {
    let cart = Core.addItem([], 'rosario-ana', null, 2);
    cart = Core.addItem(cart, 'escapulario', null, 1);
    assertEq(Core.cartCount(cart), 3, 'count');
});

test('pruneCart drops unknown products', () => {
    const cart = [{ id: 'no-longer-sold', variant: null, qty: 1 }, { id: 'rosario-ana', variant: null, qty: 1 }];
    assertEq(Core.pruneCart(cart, DATA.PRODUCTS).length, 1, 'pruned length');
});

console.log('\n── Order message ──');

test('buildOrderMessage includes items, totals and contact', () => {
    const cart = Core.addItem(Core.addItem([], 'rosario-ana', null, 1), 'pulsera-cristal-azul', 'Set de 3', 2);
    const msg = Core.buildOrderMessage({
        reference: 'AM-TEST1',
        cart,
        products: DATA.PRODUCTS,
        currency: 'USD',
        contact: { email: 'cliente@example.com' },
        shipping: { name: 'Ana Pérez', address: 'Calle 1 # 2-3', city: 'Bogotá', country: 'Colombia', phone: '3001234567' }
    });
    ['AM-TEST1', 'Rosario Ana', 'Pulsera Cristal Azul (Set de 3)', 'cliente@example.com', 'Bogotá', 'Subtotal'].forEach(part => {
        assert(msg.includes(part), `Message missing "${part}"`);
    });
    // 150.000 + 2 × 170.000 = 490.000 COP = $122.50
    assert(msg.includes('$122.50'), 'Message missing USD subtotal');
    assert(msg.includes('$490.000 COP'), 'Message missing COP subtotal');
});

test('whatsappUrl encodes the message for wa.me', () => {
    const url = Core.whatsappUrl('573237126697', 'Hola ¿qué tal?');
    assert(url.startsWith('https://wa.me/573237126697?text='), 'URL prefix');
    assert(!url.includes('¿'), 'URL should be percent-encoded');
});

// ========================================
// 3. Page structure
// ========================================
console.log('\n── Pages ──');

const PAGES = ['index.html', 'product.html', 'checkout.html', 'faq.html'];

PAGES.forEach(page => {
    test(`${page} exists with doctype, viewport and stylesheet`, () => {
        const html = read(page);
        assert(html.includes('<!DOCTYPE html>'), 'Missing DOCTYPE');
        assert(html.includes('viewport'), 'Missing viewport meta');
        assert(html.includes('href="styles.css"'), 'Missing styles.css');
        assert(html.includes('<title>'), 'Missing title');
        assert(html.includes('js/data.js') && html.includes('js/store-core.js') && html.includes('js/app.js'), 'Missing store scripts');
    });
});

test('index.html renders collection grids from the catalog', () => {
    const html = read('index.html');
    assert(html.includes('data-collection-grid="rosarios"'), 'Missing rosarios grid');
    assert(html.includes('data-collection-grid="pulseras"'), 'Missing pulseras grid');
});

test('index.html keeps its section anchors', () => {
    const html = read('index.html');
    ['inicio', 'rosarios', 'pulseras', 'escapulario', 'nosotros', 'contacto'].forEach(id => {
        assert(html.includes(`id="${id}"`), `Missing id="${id}"`);
    });
});

test('index.html has country/region selector and payment icons', () => {
    const html = read('index.html');
    assert(html.includes('data-region-select'), 'Missing region select');
    assert(html.includes('payment-icons'), 'Missing payment icons');
    assert(html.includes('Country/region'), 'Missing region label');
});

test('product.html has the product root and page script', () => {
    const html = read('product.html');
    assert(html.includes('id="product-root"'), 'Missing product root');
    assert(html.includes('js/product-page.js'), 'Missing product page script');
});

test('checkout.html has steps + summary containers and page script', () => {
    const html = read('checkout.html');
    assert(html.includes('id="checkout-steps"'), 'Missing steps container');
    assert(html.includes('id="checkout-summary"'), 'Missing summary container');
    assert(html.includes('js/checkout-page.js'), 'Missing checkout script');
});

test('storefront pages include the cart drawer', () => {
    ['index.html', 'product.html', 'faq.html'].forEach(page => {
        const html = read(page);
        assert(html.includes('id="drawer-body"') && html.includes('id="drawer-footer"'), `${page} missing cart drawer`);
        assert(html.includes('data-open-cart'), `${page} missing cart button`);
    });
});

test('all referenced images exist on disk', () => {
    const missing = [];
    PAGES.forEach(page => {
        const html = read(page);
        const srcRegex = /src="(img\/[^"]+)"/g;
        let match;
        while ((match = srcRegex.exec(html)) !== null) {
            if (!fs.existsSync(path.join(ROOT, match[1]))) missing.push(`${page}: ${match[1]}`);
        }
    });
    assert(missing.length === 0, `Missing images: ${missing.join(', ')}`);
});

test('images have alt attributes', () => {
    PAGES.forEach(page => {
        const html = read(page);
        const withoutAlt = html.match(/<img(?![^>]*alt=)[^>]*>/g) || [];
        assert(withoutAlt.length === 0, `${page} has ${withoutAlt.length} images without alt`);
    });
});

test('WhatsApp links use the correct number', () => {
    PAGES.forEach(page => {
        const html = read(page);
        (html.match(/wa\.me\/\d+/g) || []).forEach(link => {
            assert(link.includes('573237126697'), `${page}: wrong number in ${link}`);
        });
    });
});

test('checkout is honest about payment handling', () => {
    const js = read('js/checkout-page.js');
    assert(/no se procesa en este sitio|no procesa tarjetas/i.test(js), 'Checkout must state that no card payments are processed on-site');
});

// ========================================
// 4. Infrastructure
// ========================================
console.log('\n── Infrastructure ──');

['Dockerfile', 'docker-compose.yml', 'nginx.conf', '.github/workflows/ci.yml', '.github/workflows/static.yml'].forEach(file => {
    test(`${file} exists`, () => {
        assert(fs.existsSync(path.join(ROOT, file)), `${file} not found`);
    });
});

// ========================================
// Summary
// ========================================
console.log('\n══════════════════════════════════');
console.log(`  Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
console.log('══════════════════════════════════\n');

process.exit(failed > 0 ? 1 : 0);
