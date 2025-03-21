import tools from '../tools';

/**
 * WebSocket implementation for Hyperion communication
 */
export class PWebSocket {
    /**
     * Create a new WebSocket instance
     * @param {boolean} debug - Enable debug logging
     */
    constructor(debug = false) {
        this.DEBUG = debug;
        this.handle = null;
        this.currentResponseCallback = null;
        this.currentErrorCallback = null;
        this.inputBuffer = new Uint8Array(4096);
        this.inputBufferIndex = 0;
        this.readBufferTimerId = null;
    }


    /**
     * Check if socket is connected
     * @returns {boolean} Resolves with connection status
     */
    isConnected() {
        if (this.DEBUG) {
            console.log('[DEBUG] Checking if socket is connected...');
        }

        if (!this.handle) {
            if (this.DEBUG) {
                console.log('[DEBUG] Socket not created');
            }
            return false;
        }

        return this.handle.readyState === WebSocket.OPEN;
    }

    /**
     * Connect to a server
     * @param {../models/Server} server - Server configuration
     * @returns {Promise<void>} Resolves when connected
     */
    connect(server) {
        const protocol = server.forceWs ? 'ws:' : (window.location.protocol === 'https:' ? 'wss:' : 'ws:');
        const url = `${protocol}//${server.address}:${server.port}/`;

        if (this.DEBUG) {
            console.log(`[DEBUG] Connecting to peer ${url}`);
        }

        return new Promise((resolve, reject) => {
            this.handle = new WebSocket(url);

            this.handle.onmessage = this.onDataReceived.bind(this);

            this.handle.onopen = () => {
                resolve();
            };

            this.handle.onclose = () => {
                if (this.DEBUG) {
                    console.log('onClose');
                }
            };

            this.handle.onerror = () => {
                if (this.DEBUG) {
                    console.log('[ERROR]: ');
                }
                reject(new Error('WebSocket error'));
            };
        });
    }

    /**
     * Close the socket connection
     * @returns {void} Resolves when closed
     */
    close() {
        if (this.DEBUG) {
            console.log('[DEBUG] Closing socket...');
        }

        if (this.handle) {
            this.handle.close();
            return;
        }

        if (this.DEBUG) {
            console.log('[DEBUG] Socket not created');
        }
    }

    /**
     * Write data to the socket
     * @param {string|Array} data - Data to send
     * @returns {Promise<void>} Resolves when data is sent
     */
    write(data) {
        if (this.DEBUG) {
            console.log('[DEBUG] writing to socket...');
        }

        if (!this.handle) {
            if (this.DEBUG) {
                console.log('[DEBUG] Socket not created');
            }
            return Promise.reject(new Error('Socket handle is invalid'));
        }

        if (!this.isConnected()) {
            return Promise.reject(new Error('No connection to peer'));
        }


        let dataToSend;
        const dataType = typeof data;

        if (dataType === 'string') {
            if (this.DEBUG) {
                console.log('> ' + data);
            }
            dataToSend = data;
        } else {
            if (this.DEBUG) {
                console.log('> ' + tools.ab2str(data));
            }
            dataToSend = data;
        }

        return new Promise(resolve => {
            this.handle.send(dataToSend);
            resolve();
        });
    }

    /**
     * Read data from the socket
     * @returns {Promise<Array>} Resolves with received data
     */
    read() {
        if (this.DEBUG) {
            console.log('[DEBUG] reading from socket...');
        }

        if (!this.handle) {
            if (this.DEBUG) {
                console.log('[DEBUG] socket not created');
            }
            return Promise.reject(new Error('Socket handle is invalid'));
        }

        if (!this.isConnected()) {
            return Promise.reject(new Error('No connection to peer'));
        }

        return new Promise((resolve, reject) => {
            this.currentResponseCallback = (data) => {
                this.currentResponseCallback = null;
                resolve(data);
            };
            this.currentErrorCallback = (error) => {
                this.currentErrorCallback = null;
                reject(new Error(error));
            };
        });
    }

    /**
     * Handle incoming data
     * @private
     * @param {MessageEvent} event - WebSocket message event
     */
    onDataReceived(event) {
        if (this.DEBUG) {
            console.log('[DEBUG] received data...');
        }

        if (this.handle && event.data) {
            if (this.DEBUG) {
                console.log('< ' + event.data);
            }

            if (this.currentResponseCallback) {
                this.currentResponseCallback(tools.str2ab(event.data));
            }
        }
    }
} 