/**
 * Alma de María — product detail page (product.html?id=...).
 * Requires js/data.js, js/store-core.js and js/app.js.
 */
(function () {
    'use strict';

    var Alma = window.Alma;
    var Core = Alma.core;

    var params = new URLSearchParams(window.location.search);
    var product = Core.findProduct(Alma.data.PRODUCTS, params.get('id'));

    var root = document.getElementById('product-root');
    if (!root) return;

    if (!product) {
        root.innerHTML =
            '<div class="product-missing">' +
            '  <h1>Producto no encontrado</h1>' +
            '  <p>Es posible que el enlace haya cambiado.</p>' +
            '  <a class="btn btn--dark" href="index.html">Volver a la tienda</a>' +
            '</div>';
        return;
    }

    document.title = product.name + ' | Alma de María';

    var selectedVariant = product.variants ? product.variants[0].name : null;
    var qty = 1;

    function currentPriceCop() {
        if (selectedVariant && product.variants) {
            for (var i = 0; i < product.variants.length; i++) {
                if (product.variants[i].name === selectedVariant) return product.variants[i].priceCop;
            }
        }
        return product.priceCop;
    }

    function render() {
        var thumbs = '';
        if (product.images.length > 1) {
            thumbs = '<div class="product-view__thumbs">' + product.images.map(function (src, i) {
                return '<button type="button" class="product-view__thumb" data-thumb="' + i + '">' +
                    '<img src="' + src + '" alt="' + Alma.escapeHtml(product.name) + ' — vista ' + (i + 1) + '">' +
                    '</button>';
            }).join('') + '</div>';
        }

        var variantsHtml = '';
        if (product.variants) {
            variantsHtml =
                '<div class="product-view__variants">' +
                '  <p class="product-view__label">Presentación</p>' +
                '  <div class="variant-pills">' +
                product.variants.map(function (v) {
                    var active = v.name === selectedVariant ? ' is-active' : '';
                    return '<button type="button" class="variant-pill' + active + '" data-variant="' + Alma.escapeHtml(v.name) + '">' +
                        Alma.escapeHtml(v.name) +
                        '</button>';
                }).join('') +
                '  </div>' +
                '</div>';
        }

        root.innerHTML =
            '<nav class="crumbs"><a href="index.html">Inicio</a> / <a href="index.html#' + product.category + '">' + product.category + '</a> / <span>' + Alma.escapeHtml(product.name) + '</span></nav>' +
            '<div class="product-view">' +
            '  <div class="product-view__gallery">' +
            '    <div class="product-view__main"><img id="product-main-img" src="' + product.image + '" alt="' + Alma.escapeHtml(product.name) + '"></div>' +
            thumbs +
            '  </div>' +
            '  <div class="product-view__info">' +
            '    <h1 class="product-view__name">' + Alma.escapeHtml(product.name) + '</h1>' +
            '    <p class="product-view__price" id="product-price" data-cop="' + currentPriceCop() + '">' + Alma.price(currentPriceCop()) + '</p>' +
            variantsHtml +
            '    <div class="product-view__qty">' +
            '      <p class="product-view__label">Cantidad</p>' +
            '      <div class="qty-picker qty-picker--large">' +
            '        <button type="button" data-qty="-1" aria-label="Reducir cantidad">&minus;</button>' +
            '        <span id="qty-value">1</span>' +
            '        <button type="button" data-qty="1" aria-label="Aumentar cantidad">+</button>' +
            '      </div>' +
            '    </div>' +
            '    <button type="button" class="btn btn--outline-dark btn--block" id="add-to-cart">Agregar al carrito</button>' +
            '    <button type="button" class="btn btn--shop btn--block" id="buy-now">Buy with <span class="shop-word">shop</span></button>' +
            '    <p class="product-view__desc">' + Alma.escapeHtml(product.description) + '</p>' +
            '    <ul class="product-view__meta">' +
            '      <li>Hecho a mano en Colombia</li>' +
            '      <li>Envíos a toda Colombia · internacional por WhatsApp</li>' +
            '      <li>Pedido confirmado por WhatsApp — sin pagos en línea</li>' +
            '    </ul>' +
            '  </div>' +
            '</div>';

        wire();
    }

    function updatePrice() {
        var node = document.getElementById('product-price');
        node.setAttribute('data-cop', currentPriceCop());
        node.textContent = Alma.price(currentPriceCop());
    }

    function wire() {
        Array.prototype.forEach.call(root.querySelectorAll('[data-thumb]'), function (btn) {
            btn.addEventListener('click', function () {
                var i = parseInt(btn.getAttribute('data-thumb'), 10);
                document.getElementById('product-main-img').src = product.images[i];
            });
        });

        Array.prototype.forEach.call(root.querySelectorAll('[data-variant]'), function (btn) {
            btn.addEventListener('click', function () {
                selectedVariant = btn.getAttribute('data-variant');
                Array.prototype.forEach.call(root.querySelectorAll('[data-variant]'), function (b) {
                    b.classList.toggle('is-active', b === btn);
                });
                updatePrice();
            });
        });

        Array.prototype.forEach.call(root.querySelectorAll('.product-view__qty [data-qty]'), function (btn) {
            btn.addEventListener('click', function () {
                qty = Math.max(1, qty + parseInt(btn.getAttribute('data-qty'), 10));
                document.getElementById('qty-value').textContent = qty;
            });
        });

        document.getElementById('add-to-cart').addEventListener('click', function () {
            Alma.addToCart(product.id, selectedVariant, qty);
            Alma.openDrawer();
        });

        document.getElementById('buy-now').addEventListener('click', function () {
            Alma.addToCart(product.id, selectedVariant, qty);
            window.location.href = 'checkout.html';
        });
    }

    document.addEventListener('alma:prices', updatePrice);

    render();
})();
