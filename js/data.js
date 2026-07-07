/**
 * Alma de María — product catalog.
 * Single source of truth for every product on the site.
 * UMD-ish: usable from the browser (window.ALMA_DATA) and Node tests (module.exports).
 */
(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.ALMA_DATA = factory();
    }
})(typeof self !== 'undefined' ? self : this, function () {

    var ROSARIO_DESC = 'Rosario artesanal elaborado a mano con piedras naturales, cristales y medalla religiosa. Cada pieza es única — la foto muestra el diseño exacto que recibirás. Hecho por encargo en Colombia.';

    function rosario(id, name, image, priceCop) {
        return {
            id: id,
            name: name,
            category: 'rosarios',
            priceCop: priceCop,
            image: image,
            images: [image],
            description: ROSARIO_DESC
        };
    }

    var PRODUCTS = [
        rosario('rosario-de-la-paz', 'Rosario de la Paz', 'img/5H0A2082.jpg', 150000),
        rosario('rosario-lourdes', 'Rosario Lourdes', 'img/5H0A2083.jpg', 120000),
        rosario('rosario-beatriz', 'Rosario Beatriz', 'img/5H0A2084.jpg', 150000),
        rosario('rosario-elsa', 'Rosario Elsa', 'img/5H0A2085.jpg', 150000),
        rosario('rosario-sofia', 'Rosario Sofía', 'img/5H0A2086.jpg', 120000),
        rosario('rosario-silvia', 'Rosario Silvia', 'img/5H0A2087.jpg', 150000),
        rosario('rosario-fatima', 'Rosario Fátima', 'img/5H0A2088.jpg', 120000),
        rosario('rosario-paz', 'Rosario Paz', 'img/5H0A2089.jpg', 120000),
        rosario('rosario-esperanza-mini', 'Rosario Esperanza Mini', 'img/5H0A2091.jpg', 150000),
        rosario('rosario-nina-maria', 'Rosario Niña María', 'img/5H0A2092.jpg', 50000),
        rosario('rosario-jose-maria', 'Rosario José María', 'img/5H0A2094.jpg', 120000),
        rosario('rosario-lucia', 'Rosario Lucía', 'img/5H0A2095.jpg', 120000),
        rosario('rosario-sagrada-familia', 'Rosario Sagrada Familia', 'img/5H0A2096.jpg', 150000),
        rosario('rosario-maria', 'Rosario María', 'img/5H0A2097.jpg', 100000),
        rosario('rosario-eulalia', 'Rosario Eulalia', 'img/5H0A2098.jpg', 120000),
        rosario('rosario-claudia', 'Rosario Claudia', 'img/5H0A2100.jpg', 150000),
        rosario('rosario-andrea', 'Rosario Andrea', 'img/5H0A2102.jpg', 120000),
        rosario('rosario-nina-maria-rosado', 'Rosario Niña María Rosado', 'img/5H0A2103.jpg', 50000),
        rosario('rosario-pio', 'Rosario Pío', 'img/5H0A2104.jpg', 120000),
        rosario('rosario-isabel', 'Rosario Isabel', 'img/5H0A2105.jpg', 120000),
        rosario('rosario-ana', 'Rosario Ana', 'img/5H0A2106.jpg', 150000),
        rosario('rosario-andres', 'Rosario Andrés', 'img/5H0A2107.jpg', 120000),
        rosario('rosario-laura', 'Rosario Laura', 'img/5H0A2108.jpg', 150000),
        rosario('rosario-alfonso', 'Rosario Alfonso', 'img/5H0A2090.jpg', 120000),
        {
            id: 'pulsera-alma',
            name: 'Pulsera Alma',
            category: 'pulseras',
            priceCop: 60000,
            image: 'img/5H0A2070.jpg',
            images: ['img/5H0A2070.jpg', 'img/5H0A2074.jpg', 'img/5H0A2075.jpg'],
            description: 'Pulsera artesanal con cristales, cruces y medallas religiosas. Combina varias para un look único. El set de 3 ahorra $10.000 COP frente al precio individual.',
            variants: [
                { name: 'Individual', priceCop: 60000 },
                { name: 'Set de 3', priceCop: 170000 }
            ]
        },
        {
            id: 'escapulario',
            name: 'Escapulario Bordado',
            category: 'escapulario',
            priceCop: 100000,
            image: 'img/5H0A2062-Editar.jpg',
            images: ['img/5H0A2062-Editar.jpg', 'img/5H0A2065-Editar.jpg'],
            description: 'Escapulario artesanal bordado a mano, con imágenes de la Virgen María y el Sagrado Corazón de Jesús, elaborado con cuentas doradas y detalles únicos.'
        }
    ];

    var COLLECTIONS = [
        { id: 'rosarios', title: 'Rosarios', subtitle: 'Piedras naturales, cristales y medallas religiosas — cada rosario es único.' },
        { id: 'pulseras', title: 'Pulseras', subtitle: 'Cristales, cruces y medallas. Combina varias para un look único.' },
        { id: 'escapulario', title: 'Escapulario', subtitle: 'Bordado a mano con cuentas doradas.' }
    ];

    var WHATSAPP_NUMBER = '573237126697';
    var INSTAGRAM = 'alma.de.maria.joyas';

    return {
        PRODUCTS: PRODUCTS,
        COLLECTIONS: COLLECTIONS,
        WHATSAPP_NUMBER: WHATSAPP_NUMBER,
        INSTAGRAM: INSTAGRAM
    };
});
