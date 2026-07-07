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

    var ROSARIO_SUFFIX = ' Cada rosario es único — la foto muestra el diseño exacto que recibirás. Hecho a mano por encargo en Colombia.';

    function rosario(id, name, image, priceCop, desc) {
        return {
            id: id,
            name: name,
            category: 'rosarios',
            priceCop: priceCop,
            image: image,
            images: [image],
            description: desc + ROSARIO_SUFFIX
        };
    }

    var PRODUCTS = [
        rosario('rosario-de-la-paz', 'Rosario de la Paz', 'img/5H0A2082.jpg', 150000,
            'Cuentas rojas con separadores azul marino sobre cordón anudado, medalla mariana calada y cruz dorada estilo San Benito.'),
        rosario('rosario-lourdes', 'Rosario Lourdes', 'img/5H0A2083.jpg', 120000,
            'Cristales azul grisáceo iridiscente, Medalla Milagrosa, crucifijo del Perdón en plata, dije de llave y borla azul rey.'),
        rosario('rosario-beatriz', 'Rosario Beatriz', 'img/5H0A2084.jpg', 150000,
            'Cristales facetados color menta con separadores dorados, medalla de la Virgen de Guadalupe, crucifijo dorado del Perdón y borla azul marino.'),
        rosario('rosario-elsa', 'Rosario Elsa', 'img/5H0A2085.jpg', 150000,
            'Cristales aqua translúcidos con toques dorados, medalla de la Virgen de Fátima, crucifijo de San Benito y borla verde esmeralda.'),
        rosario('rosario-sofia', 'Rosario Sofía', 'img/5H0A2086.jpg', 120000,
            'Cristales negros metalizados, medalla de la Sagrada Familia en plata, crucifijo de San Benito, dije de llave y borla gris plata.'),
        rosario('rosario-silvia', 'Rosario Silvia', 'img/5H0A2087.jpg', 150000,
            'Cristales rosa pálido con acentos azul rey, Medalla Milagrosa con borde de cristales, crucifijo de San Benito y borla azul.'),
        rosario('rosario-fatima', 'Rosario Fátima', 'img/5H0A2088.jpg', 120000,
            'Cuentas verde esmeralda tipo jade sobre cordón dorado anudado, medalla dorada y cruz de cristales verdes engastados en dorado.'),
        rosario('rosario-paz', 'Rosario Paz', 'img/5H0A2089.jpg', 120000,
            'Delicadas perlas marfil con crucecitas de nácar, medalla dorada y crucifijo dorado con corpus; cierre corredizo ajustable.'),
        rosario('rosario-esperanza-mini', 'Rosario Esperanza Mini', 'img/5H0A2091.jpg', 150000,
            'Cristales amatista con acentos azul claro, Medalla Milagrosa, crucifijo de filigrana en plata, dije de llave y borla azul rey.'),
        rosario('rosario-nina-maria', 'Rosario Niña María', 'img/5H0A2092.jpg', 50000,
            'Cuentas de madera de olivo sobre cordón rojo anudado, medalla de la Virgen de Guadalupe, medallitas esmaltadas y crucifijo de madera de San Benito.'),
        rosario('rosario-jose-maria', 'Rosario José María', 'img/5H0A2094.jpg', 120000,
            'Cristales pastel — menta, rosa y lila — anudados sobre cordón lila, con acentos amatista y crucifijo esbelto de San Benito.'),
        rosario('rosario-lucia', 'Rosario Lucía', 'img/5H0A2095.jpg', 120000,
            'Cuentas rojo profundo con acentos crema y aqua, Medalla Milagrosa, crucifijo de San Benito, dije de llave y borla blanca.'),
        rosario('rosario-sagrada-familia', 'Rosario Sagrada Familia', 'img/5H0A2096.jpg', 150000,
            'Cuentas verdes tipo jade con acentos de cuarzo rosa, medalla de San Benito dorada, cruz de piedras verdes y dije de llave dorado.'),
        rosario('rosario-maria', 'Rosario María', 'img/5H0A2097.jpg', 100000,
            'Mostacillas lila con toques verdes y aqua, crucecitas de nácar, dije de niña y cruz esmaltada; cierre corredizo ajustable.'),
        rosario('rosario-eulalia', 'Rosario Eulalia', 'img/5H0A2098.jpg', 120000,
            'Cuentas rosa pálido tipo cuarzo, estrellitas de nácar, dije de niña y cruz esmaltada en dorado; cierre corredizo ajustable.'),
        rosario('rosario-claudia', 'Rosario Claudia', 'img/5H0A2100.jpg', 150000,
            'Cuentas rojo brillante con acentos aqua y beige, medalla de la Virgen, crucifijo de San Benito y borla beige.'),
        rosario('rosario-andrea', 'Rosario Andrea', 'img/5H0A2102.jpg', 120000,
            'Piedra jaspe aqua con vetas naturales y cristales rojos, medalla de la Virgen, crucifijo del Perdón, dije de llave y borla durazno.'),
        rosario('rosario-nina-maria-rosado', 'Rosario Niña María Rosado', 'img/5H0A2103.jpg', 50000,
            'Perlas blancas con cuentas de jade verde, Medalla Milagrosa, crucifijo de San Benito, dije de llave y borla verde esmeralda.'),
        rosario('rosario-pio', 'Rosario Pío', 'img/5H0A2104.jpg', 120000,
            'Cristales verde azulado iridiscente con acentos amatista y separadores dorados, medalla mariana calada, crucifijo del Perdón y dije de llave.'),
        rosario('rosario-isabel', 'Rosario Isabel', 'img/5H0A2105.jpg', 120000,
            'Cuentas coral translúcido con acentos de jaspe aqua, corazón dorado con silueta de la Virgen, llave dorada y borla café claro.'),
        rosario('rosario-ana', 'Rosario Ana', 'img/5H0A2106.jpg', 150000,
            'Cristales transparentes iridiscentes con acentos azul verdoso, Medalla Milagrosa dorada y crucifijo dorado; diseño delicado.'),
        rosario('rosario-andres', 'Rosario Andrés', 'img/5H0A2107.jpg', 120000,
            'Jaspe aqua con vetas óxido y cuentas de coral rojo, medalla de la Virgen de Fátima, crucifijo del Perdón y borla crema.'),
        rosario('rosario-laura', 'Rosario Laura', 'img/5H0A2108.jpg', 150000,
            'Cuentas verdes tipo jade con separadores de cristal, Medalla Milagrosa, crucifijo del Perdón, dije de llave y borla gris.'),
        rosario('rosario-alfonso', 'Rosario Alfonso', 'img/5H0A2090.jpg', 120000,
            'Madera de olivo sobre cordón rojo anudado con cruces claras, medalla de la Virgen de Guadalupe, dije de llave y crucifijo de madera de San Benito.'),

        // Nuevos diseños incorporados al catálogo (fotos verificadas pieza por pieza)
        rosario('rosario-guadalupe', 'Rosario Guadalupe', 'img/5H0A2010.jpg', 150000,
            'Cuentas redondas verde menta tipo jade, medalla de la Virgen de Guadalupe, crucifijo del Perdón con medallas laterales y borla azul marino.'),
        rosario('rosario-carmen', 'Rosario Carmen', 'img/5H0A2078.jpg', 150000,
            'Cristales rojos y transparentes, medalla de la Virgen de Guadalupe, crucifijo del Perdón en plata, dije de llave y borla vinotinto.'),
        rosario('rosario-francisco', 'Rosario Francisco', 'img/5H0A2081.jpg', 120000,
            'Madera de olivo sobre cordón rojo anudado, cruces de madera oscura, Medalla Milagrosa ovalada y crucifijo de madera de San Benito.'),
        rosario('rosario-estrella', 'Rosario Estrella', 'img/5H0A2109.jpg', 150000,
            'Cristales aqua facetados con separadores dorados, medalla de la Virgen con borde de cristales, crucifijo del Perdón y borla beige.'),
        rosario('rosario-violeta', 'Rosario Violeta', 'img/5H0A2110.jpg', 120000,
            'Cristales morado oscuro con acentos rosa pálido, Medalla Milagrosa, crucifijo de San Benito, dije de llave y borla rosa.'),
        rosario('rosario-benedicto', 'Rosario Benedicto', 'img/5H0A2111.jpg', 150000,
            'Cristales negros y transparentes alternados con crucecitas de nácar, Medalla Milagrosa, crucifijo ornamentado, dije de llave y borla gris salvia.'),
        rosario('rosario-cecilia', 'Rosario Cecilia', 'img/5H0A2112.jpg', 120000,
            'Cristales rojos y transparentes, medalla de la Virgen de Guadalupe, crucifijo de San Benito, dije de llave y borla gris.'),
        rosario('rosario-teresa', 'Rosario Teresa', 'img/5H0A2113.jpg', 150000,
            'Coral rojo con acentos aqua amazonita, medalla de la Virgen de Fátima, crucifijo del Perdón, dije de llave y borla crema.'),
        rosario('rosario-valentina', 'Rosario Valentina', 'img/5H0A2114.jpg', 150000,
            'Cristales rosa pálido con acentos morados, Medalla Milagrosa, crucifijo del Perdón, dije de llave y borla marfil.'),

        {
            id: 'pulsera-cristal-azul',
            name: 'Pulsera Cristal Azul',
            category: 'pulseras',
            priceCop: 60000,
            image: 'img/5H0A2070.jpg',
            images: ['img/5H0A2070.jpg', 'img/5H0A2069.jpg', 'img/5H0A2062-Editar.jpg'],
            description: 'Pulsera artesanal de cristales azul iridiscente con dijes dorados: cruz, ángel, estrella y medalla religiosa. Combínalas para un look único — el set de 3 ahorra $10.000 COP frente al precio individual.',
            variants: [
                { name: 'Individual', priceCop: 60000 },
                { name: 'Set de 3', priceCop: 170000 }
            ]
        },
        {
            id: 'pulsera-amatista',
            name: 'Pulsera Amatista',
            category: 'pulseras',
            priceCop: 60000,
            image: 'img/5H0A2073.jpg',
            images: ['img/5H0A2073.jpg', 'img/5H0A2072.jpg', 'img/5H0A2071.jpg'],
            description: 'Pulsera artesanal de cristales morados con dijes dorados: cruz, pez, ángel y medalla "Fe". Combínalas para un look único — el set de 3 ahorra $10.000 COP frente al precio individual.',
            variants: [
                { name: 'Individual', priceCop: 60000 },
                { name: 'Set de 3', priceCop: 170000 }
            ]
        },
        {
            id: 'pulsera-aqua',
            name: 'Pulsera Aqua',
            category: 'pulseras',
            priceCop: 60000,
            image: 'img/5H0A2074.jpg',
            images: ['img/5H0A2074.jpg', 'img/5H0A2075.jpg'],
            description: 'Pulsera artesanal de cristales aqua, blancos e iridiscentes con dijes dorados de cruz, corazón y medalla. Combínalas para un look único — el set de 3 ahorra $10.000 COP frente al precio individual.',
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
            image: 'img/5H0A2055.jpg',
            images: ['img/5H0A2055.jpg'],
            description: 'Escapulario artesanal bordado a mano, con imágenes de la Virgen de Guadalupe y el Sagrado Corazón de Jesús, elaborado con cuentas doradas sobre cordón azul marino y detalles únicos.'
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
