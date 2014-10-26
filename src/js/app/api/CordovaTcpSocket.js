/*global chrome */
define(['lib/stapes', 'api/Socket', 'utils/Tools'], function (Stapes, Socket, tools) {
    'use strict';
    return Socket.subclass(/** @lends CordovaTcpSocket.prototype  */{
        DEBUG: false,

        /**
         * @type {number}
         */
        handle: null,

        /**
         * @class CordovaTcpSocket
         * @extends Socket
         * @constructs
         */
        constructor: function () {
            if (!chrome && !chrome.socket) {
                throw new Error('Cordova socket plugin not available');
            }
            this.inputBuffer = '';
        },

        create: function (onSuccess, onError) {
            if (this.DEBUG) {
                console.log('[DEBUG] Creating socket...');
            }

            chrome.socket.create('tcp', {bufferSize: 4096}, function (createInfo) {
                if (this.DEBUG) {
                    console.log('[DEBUG] Socket created: ' + createInfo.socketId);
                }
                this.handle = createInfo.socketId;
                if (onSuccess) {
                    onSuccess();
                }
            }.bind(this));
        },

        isConnected: function (resultCallback) {
            if (this.DEBUG) {
                console.log('[DEBUG] Checking if socket is connected...');
            }

            if (this.handle === null) {
                if (this.DEBUG) {
                    console.log('[DEBUG] Socket not created');
                }

                if (resultCallback) {
                    resultCallback(false);
                }
                return;
            }

            chrome.socket.getInfo(this.handle, function (socketInfo) {
                if (this.DEBUG) {
                    console.log('[DEBUG] Socket connected: ' + socketInfo.connected);
                }

                if (socketInfo.connected) {
                    if (resultCallback) {
                        resultCallback(true);
                    }
                } else {
                    if (resultCallback) {
                        resultCallback(false);
                    }
                }
            }.bind(this));
        },

        connect: function (server, onSuccess, onError) {
            if (this.DEBUG) {
                console.log('[DEBUG] Connecting to peer ' + server.address + ':' + server.port);
            }

            if (this.handle === null) {
                if (this.DEBUG) {
                    console.log('[DEBUG] Socket not created');
                }

                if (onError) {
                    onError('Socket handle is invalid');
                }
                return;
            }

            chrome.socket.connect(this.handle, server.address, server.port, function (result) {
                if (this.DEBUG) {
                    console.log('[DEBUG] Connect result: ' + result);
                }

                if (result !== 0) {
                    if (onError) {
                        onError('Could not connect to ' + server.address + ':' + server.port);
                    }
                } else if (onSuccess) {
                    onSuccess();
                }
            }.bind(this));
        },

        close: function (onSuccess, onError) {
            if (this.DEBUG) {
                console.log('[DEBUG] Closing socket...');
            }

            if (this.handle !== null) {
				chrome.socket.disconnect(this.handle);
                chrome.socket.destroy(this.handle);
                this.handle = null;
            } else {
                if (this.DEBUG) {
                    console.log('[DEBUG] Socket not created');
                }

                if (onError) {
                    onError('Socket handle is invalid');
                }
            }
        },

        write: function (data, onSuccess, onError) {
            var dataToSend = null, dataType = typeof (data);

            if (this.DEBUG) {
                console.log('[DEBUG] writing to socket...');
            }

            if (this.handle === null) {
                if (this.DEBUG) {
                    console.log('[DEBUG] Socket not created');
                }

                if (onError) {
                    onError('Socket handle is invalid');
                }
                return;
            }

            this.isConnected(function (connected) {
                if (connected) {
                    if (dataType === 'string') {
                        if (this.DEBUG) {
                            console.log('> ' + data);
                        }
                        dataToSend = tools.str2ab(data);
                    } else {
                        if (this.DEBUG) {
                            console.log('> ' + tools.ab2hexstr(data));
                        }
                        dataToSend = data;
                    }

                    chrome.socket.write(this.handle, tools.a2ab(dataToSend), function (sendInfo) {
                        if (this.DEBUG) {
                            console.log('[DEBUG] Bytes written: ' + sendInfo.bytesWritten);
                        }

                        if (sendInfo.bytesWritten === 0) {
                            onError('Socket write error');
                        } else if (onSuccess) {
                            onSuccess();
                        }
                    }.bind(this));
                } else {
                    if (onError) {
                        onError('No connection to peer');
                    }
                }
            }.bind(this));

        },

        read: function (onSuccess, onError) {
            if (this.DEBUG) {
                console.log('[DEBUG] reading from socket...');
            }

            if (this.handle === null) {
                if (this.DEBUG) {
                    console.log('[DEBUG] socket not created');
                }

                if (onError) {
                    onError('Socket handle is invalid');
                }
                return;
            }

            this.isConnected(function (connected) {
                var inputBuffer = new Uint8Array(4096), inputBufferIndex = 0, readBufferTimerId;

                function doRead(handle, onSuccess, onError) {
                    readBufferTimerId = setTimeout(function () {
                        if (onSuccess) {
                            onSuccess(inputBuffer.subarray(0, inputBufferIndex));
                        }
                        inputBufferIndex = 0;
                    }, 800);

                    chrome.socket.read(handle, 4096, function (result) {
                        if (readBufferTimerId) {
                            clearTimeout(readBufferTimerId);
                        }

                        if (result.resultCode !== 0) {
                            inputBuffer.set(new Uint8Array(result.data), inputBufferIndex);
                            inputBufferIndex += result.data.byteLength;

                            doRead(handle, onSuccess, onError);
                        } else {
                            if (onError) {
                                onError('Error reading from socket');
                            }
                        }
                    });
                }

                if (!connected) {
                    if (onError) {
                        onError('No connection to peer');
                    }
                } else {
                    doRead(this.handle, onSuccess, onError);
                }
            }.bind(this));
        }
    }, true);
});
