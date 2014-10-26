/*global require, requirejs */

requirejs.config({
    baseUrl: 'js/app', paths: {
        'lib': '../vendor'
    }, map: {
        'controllers/AppController': {
            'api/Socket': 'api/CordovaTcpSocket', 'api/Network': 'api/CordovaNetwork'
        }
    }
});

/**
 *
 * @param {HTMLElement} dom
 * @param {function} handler
 */
window.addPointerDownHandler = function (dom, handler) {
    'use strict';
    dom.addEventListener('touchstart', function () {
        handler.apply(this, arguments);
    }, false);
};

/**
 *
 * @param {HTMLElement} dom
 * @param {function} handler
 */
window.addPointerUpHandler = function (dom, handler) {
    'use strict';
    dom.addEventListener('touchend', function () {
        handler.apply(this, arguments);
    }, false);
};

/**
 *
 * @param {HTMLElement} dom
 * @param {function} handler
 */
window.addPointerMoveHandler = function (dom, handler) {
    'use strict';
    dom.addEventListener('touchmove', function () {
        handler.apply(this, arguments);
    }, false);
};

/**
 *
 * @param {HTMLElement} dom
 * @param {function} handler
 */
window.addClickHandler = function (dom, handler) {
    'use strict';
    var toFire = false;

    dom.addEventListener('touchstart', function (event) {
        if (event.touches.length === 1) {
            toFire = true;
        }
    }, false);

    dom.addEventListener('touchmove', function () {
        toFire = false;
    }, false);

    dom.addEventListener('touchend', function (event) {
        if (toFire) {
            handler.apply(this, arguments);
            if (event.target.tagName !== 'INPUT') {
                event.preventDefault();
            }
        }
    }, false);
};

require(['controllers/AppController'], function (AppController) {
    'use strict';
    var script = document.createElement('script');
    script.src = 'cordova.js';
    document.body.appendChild(script);
    document.addEventListener('deviceready', function () {
        var app = new AppController();
        app.init();
    }, false);
});
