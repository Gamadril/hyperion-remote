/*global define, chrome */
define(['api/Network'], function (Network) {
    'use strict';

    return Network.subclass(/** @lends CordovaNetwork.prototype */{

        /**
         * @class CordovaNetwork
         * @classdesc Network functions for cordova apps
         * @constructs
         */
        constructor: function () {
        },

        getLocalInterfaces: function (onSuccess, onError) {
            var ips = [];

            chrome.socket.getNetworkList(function (networkInterfaces) {
                var i;

                for (i = 0; i < networkInterfaces.length; i++) {
                    // check only ipv4
                    if (networkInterfaces[i].address.indexOf('.') === -1) {
                        continue;
                    }

                    ips.push(networkInterfaces[i].address);
                }

                if (onSuccess) {
                    onSuccess(ips);
                }
            });
        }
    }, true);
});
