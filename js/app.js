/**
 * Alma de María — shared storefront runtime.
 * Cart persistence, currency selection, cart drawer, product card rendering.
 * Requires js/data.js and js/store-core.js to be loaded first.
 */
(function () {
    'use strict';

    var DATA = window.ALMA_DATA;
    var Core = window.StoreCore;

    var CART_KEY = 'alma.cart.v1';
    var CURRENCY_KEY = 'alma.currency.v1';

    // ── State ─────────────────────────────────────────────────────────

    function loadCart() {
        try {
            var raw = localStorage.getItem(CART_KEY);
            var cart = raw ? JSON.parse(raw) : [];
            return Core.pruneCart(Array.isArray(cart) ? cart : [], DATA.PRODUCTS);
        } catch (e) {
            return [];
        }
    }

    function saveCart(cart) {
        try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) { /* private mode */ }
    }

    function getCurrency() {
        try {
            var c = localStorage.getItem(CURRENCY_KEY);
            return Core.CURRENCIES.indexOf(c) !== -1 ? c : 'USD';
        } catch (e) {
            return 'USD';
        }
    }

    function setCurrency(currency) {
        try { localStorage.setItem(CURRENCY_KEY, currency); } catch (e) { /* private mode */ }
        document.dispatchEvent(new CustomEvent('alma:currency', { detail: currency }));
    }

    var state = {
        cart: loadCart(),
        get currency() { return getCurrency(); }
    };

    function updateCart(next) {
        state.cart = next;
        saveCart(next);
        document.dispatchEvent(new CustomEvent('alma:cart', { detail: next }));
    }

    // ── Helpers ───────────────────────────────────────────────────────

    function price(cop) {
        return Core.formatPrice(cop, state.currency);
    }

    function el(tag, className, html) {
        var node = document.createElement(tag);
        if (className) node.className = className;
        if (html !== undefined) node.innerHTML = html;
        return node;
    }

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    // ── Product cards ─────────────────────────────────────────────────

    function productCard(product) {
        var priceHtml = product.variants
            ? 'Desde ' + price(product.variants[0].priceCop)
            : price(product.priceCop);
        var card = el('a', 'product-card reveal');
        card.href = 'product.html?id=' + encodeURIComponent(product.id);
        card.innerHTML =
            '<div class="product-card__image">' +
            '  <img src="' + product.image + '" alt="' + escapeHtml(product.name) + '" loading="lazy">' +
            '</div>' +
            '<div class="product-card__info">' +
            '  <h3 class="product-card__name">' + escapeHtml(product.name) + '</h3>' +
            '  <p class="product-card__price" data-cop="' + (product.variants ? product.variants[0].priceCop : product.priceCop) + '">' + priceHtml + '</p>' +
            '</div>';
        return card;
    }

    function renderGrid(container, products) {
        container.innerHTML = '';
        products.forEach(function (p) { container.appendChild(productCard(p)); });
    }

    /** Render every [data-collection-grid] on the page from the catalog. */
    function renderCollections() {
        var grids = document.querySelectorAll('[data-collection-grid]');
        Array.prototype.forEach.call(grids, function (grid) {
            var id = grid.getAttribute('data-collection-grid');
            var products = DATA.PRODUCTS.filter(function (p) { return p.category === id; });
            renderGrid(grid, products);
        });
    }

    // ── Cart drawer ───────────────────────────────────────────────────

    function drawerLineHtml(line) {
        var product = Core.findProduct(DATA.PRODUCTS, line.id);
        if (!product) return '';
        var key = Core.lineKey(line.id, line.variant);
        var unit = Core.linePriceCop(DATA.PRODUCTS, line);
        return (
            '<div class="drawer-line" data-key="' + escapeHtml(key) + '">' +
            '  <a class="drawer-line__thumb" href="product.html?id=' + encodeURIComponent(product.id) + '">' +
            '    <img src="' + product.image + '" alt="' + escapeHtml(product.name) + '">' +
            '  </a>' +
            '  <div class="drawer-line__body">' +
            '    <p class="drawer-line__name">' + escapeHtml(product.name) + '</p>' +
            (line.variant ? '<p class="drawer-line__variant">' + escapeHtml(line.variant) + '</p>' : '') +
            '    <div class="drawer-line__controls">' +
            '      <div class="qty-picker">' +
            '        <button type="button" data-qty="-1" aria-label="Reducir cantidad">&minus;</button>' +
            '        <span>' + line.qty + '</span>' +
            '        <button type="button" data-qty="1" aria-label="Aumentar cantidad">+</button>' +
            '      </div>' +
            '      <button type="button" class="drawer-line__remove" data-remove>Eliminar</button>' +
            '    </div>' +
            '  </div>' +
            '  <p class="drawer-line__price">' + price(unit * line.qty) + '</p>' +
            '</div>'
        );
    }

    function renderDrawer() {
        var body = document.getElementById('drawer-body');
        var footer = document.getElementById('drawer-footer');
        if (!body || !footer) return;

        if (state.cart.length === 0) {
            body.innerHTML =
                '<div class="drawer-empty">' +
                '  <p>Tu carrito está vacío.</p>' +
                '  <a class="btn btn--dark" href="index.html#rosarios">Ver la colección</a>' +
                '</div>';
            footer.innerHTML = '';
            return;
        }

        body.innerHTML = state.cart.map(drawerLineHtml).join('');
        var subtotal = Core.cartSubtotalCop(state.cart, DATA.PRODUCTS);
        footer.innerHTML =
            '<div class="drawer-subtotal">' +
            '  <span>Subtotal</span>' +
            '  <span>' + price(subtotal) + '</span>' +
            '</div>' +
            '<p class="drawer-note">Envío coordinado al confirmar el pedido.</p>' +
            '<a class="btn btn--dark btn--block" href="checkout.html">Finalizar compra</a>' +
            '<a class="btn btn--shop btn--block" href="checkout.html">Buy with <span class="shop-word">shop</span></a>';
    }

    function updateBadges() {
        var count = Core.cartCount(state.cart);
        Array.prototype.forEach.call(document.querySelectorAll('[data-cart-count]'), function (badge) {
            badge.textContent = count;
            badge.classList.toggle('is-empty', count === 0);
        });
    }

    function openDrawer() {
        document.body.classList.add('drawer-open');
        renderDrawer();
    }

    function closeDrawer() {
        document.body.classList.remove('drawer-open');
    }

    // ── Currency selector (footer country/region) ─────────────────────

    var REGIONS = [
        { label: 'United States (USD $)', currency: 'USD' },
        { label: 'Colombia (COP $)', currency: 'COP' },
        { label: 'Canada (USD $)', currency: 'USD' },
        { label: 'Spain (USD $)', currency: 'USD' },
        { label: 'Mexico (USD $)', currency: 'USD' },
        { label: 'United Kingdom (USD $)', currency: 'USD' }
    ];

    function initRegionSelects() {
        Array.prototype.forEach.call(document.querySelectorAll('[data-region-select]'), function (select) {
            select.innerHTML = REGIONS.map(function (r) {
                return '<option value="' + r.currency + ':' + escapeHtml(r.label) + '">' + escapeHtml(r.label) + '</option>';
            }).join('');
            var current = state.currency;
            // Pick the first region matching the stored currency.
            for (var i = 0; i < select.options.length; i++) {
                if (select.options[i].value.indexOf(current + ':') === 0) {
                    select.selectedIndex = i;
                    break;
                }
            }
            select.addEventListener('change', function () {
                setCurrency(select.value.split(':')[0]);
            });
        });
    }

    /** Sync every static [data-cop] price node to the active currency. */
    function syncStaticPrices() {
        Array.prototype.forEach.call(document.querySelectorAll('[data-cop]'), function (node) {
            var cop = parseInt(node.getAttribute('data-cop'), 10);
            if (!isNaN(cop)) {
                var prefix = node.getAttribute('data-price-prefix') || '';
                node.textContent = prefix + Core.formatPrice(cop, state.currency);
            }
        });
    }

    /** Re-render every price on the page after a currency switch. */
    function refreshPrices() {
        syncStaticPrices();
        renderDrawer();
        document.dispatchEvent(new CustomEvent('alma:prices'));
    }

    // ── Scroll reveal ─────────────────────────────────────────────────

    function initReveal() {
        if (!('IntersectionObserver' in window)) return;
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });
        Array.prototype.forEach.call(document.querySelectorAll('.reveal'), function (node) {
            observer.observe(node);
        });
    }

    // ── Wiring ────────────────────────────────────────────────────────

    function init() {
        renderCollections();
        syncStaticPrices();
        updateBadges();
        initRegionSelects();
        initReveal();

        document.addEventListener('click', function (e) {
            var target = e.target;

            if (target.closest('[data-open-cart]')) {
                e.preventDefault();
                openDrawer();
                return;
            }
            if (target.closest('[data-close-cart]') || target.classList.contains('drawer-backdrop')) {
                closeDrawer();
                return;
            }

            var lineNode = target.closest('.drawer-line');
            if (lineNode) {
                var key = lineNode.getAttribute('data-key');
                var qtyBtn = target.closest('[data-qty]');
                if (qtyBtn) {
                    var delta = parseInt(qtyBtn.getAttribute('data-qty'), 10);
                    var line = state.cart.filter(function (l) { return Core.lineKey(l.id, l.variant) === key; })[0];
                    if (line) updateCart(Core.setQty(state.cart, key, line.qty + delta));
                    return;
                }
                if (target.closest('[data-remove]')) {
                    updateCart(Core.removeItem(state.cart, key));
                    return;
                }
            }

            var navToggle = target.closest('[data-nav-toggle]');
            if (navToggle) {
                document.body.classList.toggle('nav-open');
                return;
            }
            if (target.closest('[data-nav-close]') || (target.closest('.site-nav__link') && document.body.classList.contains('nav-open'))) {
                document.body.classList.remove('nav-open');
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                closeDrawer();
                document.body.classList.remove('nav-open');
            }
        });

        document.addEventListener('alma:cart', function () {
            updateBadges();
            renderDrawer();
        });
        document.addEventListener('alma:currency', function () {
            renderCollections();
            refreshPrices();
            initReveal();
        });
    }

    // Public API for page scripts.
    window.Alma = {
        data: DATA,
        core: Core,
        state: state,
        price: price,
        escapeHtml: escapeHtml,
        addToCart: function (id, variant, qty) {
            updateCart(Core.addItem(state.cart, id, variant, qty));
        },
        clearCart: function () {
            updateCart([]);
        },
        openDrawer: openDrawer,
        closeDrawer: closeDrawer,
        refreshPrices: refreshPrices
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
