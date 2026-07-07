/**
 * Alma de María — checkout page.
 * Three steps: contact (Shop-style sign-in card) → shipping → review.
 * The order is completed via WhatsApp — no payment details are collected here.
 * Requires js/data.js, js/store-core.js and js/app.js.
 */
(function () {
    'use strict';

    var Alma = window.Alma;
    var Core = Alma.core;

    var COUNTRIES = ['Colombia', 'United States', 'Canada', 'Spain', 'Mexico', 'United Kingdom', 'Otro'];

    var order = {
        contact: { email: '' },
        shipping: { name: '', address: '', city: '', country: 'United States', phone: '' }
    };
    var step = 1; // 1 contact, 2 shipping, 3 review

    var stepsRoot = document.getElementById('checkout-steps');
    var summaryRoot = document.getElementById('checkout-summary');
    if (!stepsRoot || !summaryRoot) return;

    // ── Order summary (right column) ──────────────────────────────────

    function renderSummary() {
        var cart = Alma.state.cart;
        if (cart.length === 0) {
            summaryRoot.innerHTML =
                '<div class="summary-empty">' +
                '  <p>Tu carrito está vacío.</p>' +
                '  <a class="btn btn--dark" href="index.html#rosarios">Ver la colección</a>' +
                '</div>';
            stepsRoot.innerHTML = '';
            return false;
        }

        var itemsHtml = cart.map(function (line) {
            var product = Core.findProduct(Alma.data.PRODUCTS, line.id);
            if (!product) return '';
            var unit = Core.linePriceCop(Alma.data.PRODUCTS, line);
            return (
                '<div class="summary-line">' +
                '  <div class="summary-line__thumb">' +
                '    <img src="' + product.image + '" alt="' + Alma.escapeHtml(product.name) + '">' +
                '    <span class="summary-line__qty">' + line.qty + '</span>' +
                '  </div>' +
                '  <div class="summary-line__body">' +
                '    <p class="summary-line__name">' + Alma.escapeHtml(product.name) + '</p>' +
                (line.variant ? '<p class="summary-line__variant">' + Alma.escapeHtml(line.variant) + '</p>' : '') +
                '  </div>' +
                '  <p class="summary-line__price">' + Alma.price(unit * line.qty) + '</p>' +
                '</div>'
            );
        }).join('');

        var subtotal = Core.cartSubtotalCop(cart, Alma.data.PRODUCTS);
        var shippingLabel = step < 3 ? 'Ingresa tu dirección' : 'Se coordina por WhatsApp';

        summaryRoot.innerHTML =
            itemsHtml +
            '<div class="summary-totals">' +
            '  <div class="summary-row"><span>Subtotal</span><span>' + Alma.price(subtotal) + '</span></div>' +
            '  <div class="summary-row summary-row--muted"><span>Envío</span><span>' + shippingLabel + '</span></div>' +
            '  <div class="summary-row summary-row--total"><span>Total</span><span><em>' + Alma.state.currency + '</em> ' + Alma.price(subtotal) + '</span></div>' +
            (Alma.state.currency === 'USD'
                ? '<p class="summary-fx">≈ ' + Core.formatPrice(subtotal, 'COP') + ' · tasa de referencia ' + Core.groupThousands(Core.COP_PER_USD) + ' COP/USD</p>'
                : '') +
            '</div>';
        return true;
    }

    // ── Steps (left column) ───────────────────────────────────────────

    function stepBadge() {
        return (
            '<ol class="checkout-progress">' +
            ['Contacto', 'Envío', 'Confirmar'].map(function (label, i) {
                var n = i + 1;
                var cls = n === step ? ' is-current' : (n < step ? ' is-done' : '');
                return '<li class="' + cls + '"><span>' + n + '</span>' + label + '</li>';
            }).join('') +
            '</ol>'
        );
    }

    function renderContact() {
        stepsRoot.innerHTML =
            stepBadge() +
            '<div class="signin-card">' +
            '  <h1 class="signin-card__title">Sign in</h1>' +
            '  <p class="signin-card__sub">Or continue as guest</p>' +
            '  <form id="contact-form" novalidate>' +
            '    <input class="signin-card__input" id="email-input" type="email" inputmode="email" autocomplete="email" placeholder="Enter your email" value="' + Alma.escapeHtml(order.contact.email) + '" required>' +
            '    <p class="field-error" id="email-error" hidden>Ingresa un correo válido.</p>' +
            '    <button class="btn btn--shop btn--block" type="submit">Continue with <span class="shop-word">shop</span></button>' +
            '  </form>' +
            '  <p class="signin-card__fine">Al continuar aceptas que usemos tu correo para coordinar este pedido. ' +
            'El pago no se procesa en este sitio: el pedido se confirma por WhatsApp (Nequi, Bancolombia o efectivo).</p>' +
            '</div>' +
            '<a class="checkout-back" href="index.html">Back</a>';

        document.getElementById('contact-form').addEventListener('submit', function (e) {
            e.preventDefault();
            var input = document.getElementById('email-input');
            var email = input.value.trim();
            var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            document.getElementById('email-error').hidden = ok;
            if (!ok) { input.focus(); return; }
            order.contact.email = email;
            step = 2;
            render();
        });
    }

    function field(id, label, value, opts) {
        opts = opts || {};
        return (
            '<label class="ship-field' + (opts.half ? ' ship-field--half' : '') + '">' +
            '  <span>' + label + '</span>' +
            '  <input id="' + id + '" type="' + (opts.type || 'text') + '" value="' + Alma.escapeHtml(value) + '"' +
            (opts.autocomplete ? ' autocomplete="' + opts.autocomplete + '"' : '') +
            (opts.optional ? '' : ' required') + '>' +
            '</label>'
        );
    }

    function renderShipping() {
        stepsRoot.innerHTML =
            stepBadge() +
            '<div class="checkout-card">' +
            '  <h1 class="checkout-card__title">Dirección de envío</h1>' +
            '  <form id="shipping-form" class="ship-grid" novalidate>' +
            field('ship-name', 'Nombre completo', order.shipping.name, { autocomplete: 'name' }) +
            field('ship-address', 'Dirección', order.shipping.address, { autocomplete: 'street-address' }) +
            field('ship-city', 'Ciudad', order.shipping.city, { half: true, autocomplete: 'address-level2' }) +
            '    <label class="ship-field ship-field--half"><span>País / Región</span>' +
            '      <select id="ship-country">' +
            COUNTRIES.map(function (c) {
                return '<option' + (c === order.shipping.country ? ' selected' : '') + '>' + c + '</option>';
            }).join('') +
            '      </select>' +
            '    </label>' +
            field('ship-phone', 'Teléfono (WhatsApp)', order.shipping.phone, { type: 'tel', optional: true, autocomplete: 'tel' }) +
            '    <p class="field-error" id="ship-error" hidden>Completa nombre, dirección y ciudad.</p>' +
            '    <button class="btn btn--dark btn--block" type="submit">Continuar</button>' +
            '  </form>' +
            '</div>' +
            '<button class="checkout-back" id="back-1" type="button">Back</button>';

        document.getElementById('shipping-form').addEventListener('submit', function (e) {
            e.preventDefault();
            order.shipping = {
                name: document.getElementById('ship-name').value.trim(),
                address: document.getElementById('ship-address').value.trim(),
                city: document.getElementById('ship-city').value.trim(),
                country: document.getElementById('ship-country').value,
                phone: document.getElementById('ship-phone').value.trim()
            };
            var ok = order.shipping.name && order.shipping.address && order.shipping.city;
            document.getElementById('ship-error').hidden = !!ok;
            if (!ok) return;
            step = 3;
            render();
        });
        document.getElementById('back-1').addEventListener('click', function () { step = 1; render(); });
    }

    function renderReview() {
        var s = order.shipping;
        stepsRoot.innerHTML =
            stepBadge() +
            '<div class="checkout-card">' +
            '  <h1 class="checkout-card__title">Confirmar pedido</h1>' +
            '  <dl class="review-list">' +
            '    <div><dt>Contacto</dt><dd>' + Alma.escapeHtml(order.contact.email) + '</dd></div>' +
            '    <div><dt>Envío</dt><dd>' + Alma.escapeHtml(s.name) + '<br>' + Alma.escapeHtml(s.address) + ', ' + Alma.escapeHtml(s.city) + '<br>' + Alma.escapeHtml(s.country) + (s.phone ? '<br>' + Alma.escapeHtml(s.phone) : '') + '</dd></div>' +
            '    <div><dt>Pago</dt><dd>Se confirma por WhatsApp — Nequi, Bancolombia o efectivo. Este sitio no procesa tarjetas.</dd></div>' +
            '  </dl>' +
            '  <button class="btn btn--shop btn--block" id="place-order">Completar pedido por WhatsApp</button>' +
            '</div>' +
            '<button class="checkout-back" id="back-2" type="button">Back</button>';

        document.getElementById('back-2').addEventListener('click', function () { step = 2; render(); });

        document.getElementById('place-order').addEventListener('click', function () {
            var reference = 'AM-' + Date.now().toString(36).toUpperCase();
            var message = Core.buildOrderMessage({
                reference: reference,
                cart: Alma.state.cart,
                products: Alma.data.PRODUCTS,
                currency: Alma.state.currency,
                contact: order.contact,
                shipping: order.shipping
            });
            window.open(Core.whatsappUrl(Alma.data.WHATSAPP_NUMBER, message), '_blank', 'noopener');
            renderDone(reference);
        });
    }

    function renderDone(reference) {
        Alma.clearCart();
        stepsRoot.innerHTML =
            '<div class="checkout-card checkout-card--done">' +
            '  <h1 class="checkout-card__title">¡Gracias! 🕊️</h1>' +
            '  <p>Tu pedido <strong>' + reference + '</strong> se abrió en WhatsApp. Envía el mensaje para confirmarlo — te responderemos con el valor del envío y los datos de pago.</p>' +
            '  <a class="btn btn--dark" href="index.html">Volver a la tienda</a>' +
            '</div>';
        summaryRoot.innerHTML = '';
    }

    function render() {
        if (!renderSummary()) return;
        if (step === 1) renderContact();
        else if (step === 2) renderShipping();
        else renderReview();
        window.scrollTo(0, 0);
    }

    document.addEventListener('alma:prices', function () { renderSummary(); });

    render();
})();
