/**
 * Alma de María — pure store logic (no DOM).
 * Currency conversion, cart operations and order-message building.
 * UMD-ish: usable from the browser (window.StoreCore) and Node tests (module.exports).
 */
(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.StoreCore = factory();
    }
})(typeof self !== 'undefined' ? self : this, function () {

    /** Fixed reference rate used to display USD prices for a COP-priced catalog. */
    var COP_PER_USD = 4000;

    var CURRENCIES = ['USD', 'COP'];

    function copToUsd(cop) {
        return cop / COP_PER_USD;
    }

    /** 150000 -> "150.000" (Colombian thousands separator, no locale dependency). */
    function groupThousands(n) {
        return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    function formatPrice(cop, currency) {
        if (currency === 'COP') {
            return '$' + groupThousands(cop) + ' COP';
        }
        var usd = copToUsd(cop);
        return '$' + usd.toFixed(2);
    }

    // ── Cart ──────────────────────────────────────────────────────────
    // A cart is a plain array of lines: { id, variant (or null), qty }.
    // All operations return a NEW array so callers can persist + re-render.

    function lineKey(id, variant) {
        return variant ? id + '::' + variant : id;
    }

    function addItem(cart, id, variant, qty) {
        qty = qty || 1;
        var key = lineKey(id, variant);
        var found = false;
        var next = cart.map(function (line) {
            if (lineKey(line.id, line.variant) === key) {
                found = true;
                return { id: line.id, variant: line.variant, qty: line.qty + qty };
            }
            return line;
        });
        if (!found) {
            next.push({ id: id, variant: variant || null, qty: qty });
        }
        return next;
    }

    function setQty(cart, key, qty) {
        if (qty <= 0) return removeItem(cart, key);
        return cart.map(function (line) {
            if (lineKey(line.id, line.variant) === key) {
                return { id: line.id, variant: line.variant, qty: qty };
            }
            return line;
        });
    }

    function removeItem(cart, key) {
        return cart.filter(function (line) {
            return lineKey(line.id, line.variant) !== key;
        });
    }

    function cartCount(cart) {
        return cart.reduce(function (sum, line) { return sum + line.qty; }, 0);
    }

    function findProduct(products, id) {
        for (var i = 0; i < products.length; i++) {
            if (products[i].id === id) return products[i];
        }
        return null;
    }

    /** Unit price in COP for a cart line, honouring variant pricing. */
    function linePriceCop(products, line) {
        var product = findProduct(products, line.id);
        if (!product) return 0;
        if (line.variant && product.variants) {
            for (var i = 0; i < product.variants.length; i++) {
                if (product.variants[i].name === line.variant) {
                    return product.variants[i].priceCop;
                }
            }
        }
        return product.priceCop;
    }

    function cartSubtotalCop(cart, products) {
        return cart.reduce(function (sum, line) {
            return sum + linePriceCop(products, line) * line.qty;
        }, 0);
    }

    /** Drop cart lines whose product no longer exists in the catalog. */
    function pruneCart(cart, products) {
        return cart.filter(function (line) {
            return findProduct(products, line.id) !== null;
        });
    }

    // ── Order message (WhatsApp) ─────────────────────────────────────

    function buildOrderMessage(order) {
        // order: { reference, cart, products, currency, contact: {email},
        //          shipping: {name, address, city, country, phone} }
        var lines = [];
        lines.push('🕊️ Nuevo pedido — Alma de María');
        lines.push('Pedido: ' + order.reference);
        lines.push('');
        order.cart.forEach(function (line) {
            var product = findProduct(order.products, line.id);
            if (!product) return;
            var label = product.name + (line.variant ? ' (' + line.variant + ')' : '');
            var unit = linePriceCop(order.products, line);
            lines.push('• ' + line.qty + ' × ' + label + ' — ' + formatPrice(unit * line.qty, order.currency));
        });
        var subtotal = cartSubtotalCop(order.cart, order.products);
        lines.push('');
        lines.push('Subtotal: ' + formatPrice(subtotal, order.currency));
        if (order.currency !== 'COP') {
            lines.push('(' + formatPrice(subtotal, 'COP') + ')');
        }
        lines.push('');
        lines.push('Contacto: ' + order.contact.email);
        var s = order.shipping;
        lines.push('Envío: ' + s.name + ', ' + s.address + ', ' + s.city + ', ' + s.country);
        if (s.phone) lines.push('Tel: ' + s.phone);
        lines.push('');
        lines.push('Envío y pago por confirmar por este medio. ¡Gracias!');
        return lines.join('\n');
    }

    function whatsappUrl(number, message) {
        return 'https://wa.me/' + number + '?text=' + encodeURIComponent(message);
    }

    return {
        COP_PER_USD: COP_PER_USD,
        CURRENCIES: CURRENCIES,
        copToUsd: copToUsd,
        groupThousands: groupThousands,
        formatPrice: formatPrice,
        lineKey: lineKey,
        addItem: addItem,
        setQty: setQty,
        removeItem: removeItem,
        cartCount: cartCount,
        findProduct: findProduct,
        linePriceCop: linePriceCop,
        cartSubtotalCop: cartSubtotalCop,
        pruneCart: pruneCart,
        buildOrderMessage: buildOrderMessage,
        whatsappUrl: whatsappUrl
    };
});
