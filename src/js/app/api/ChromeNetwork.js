/*global chrome */
define(['api/Network'], function (Network) {
    'use strict';

    return Network.subclass(/** @lends ChromeNetwork.prototype */{

        /**
         * @class ChromeNetwork
         * @classdesc Network functions for chrome apps
         * @constructs
         */
        constructor: function () {
        },

        getLocalInterfaces: function (onSuccess, onError) {
            var ips = [];

            chrome.system.network.getNetworkInterfaces(function (networkInterfaces) {
                var i;

                if (chrome.runtime.lastError) {
                    if (onError) {
                        onError('Could not get network interfaces');
                    }
                    return;
                }

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
