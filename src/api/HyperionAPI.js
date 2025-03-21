import { PWebSocket } from './PWebSocket';
import tools from '../tools';


/**
 * Interface for the hyperion server control
 * Commands are sent directly to hyperion's server
 */
export class HyperionAPI {
    /**
     * Create a new HyperionAPI instance
     * @param {../models/Server} server - Hyperion server parameter
     */
    constructor(server) {
        this.server = server;
        this.socket = new PWebSocket();
        this.connecting = false;
    }

    /**
     * Try to connect to the server
     * @returns {Promise<void>} Resolves when connected
     */
    connect() {
        if (!this.server) {
            return Promise.reject(new Error('Missing server info'));
        }

        if (this.connecting) {
            return Promise.reject(new Error('Already connecting'));
        }

        this.connecting = true;

        return new Promise((resolve, reject) => {
            this.socket.connect(this.server)
                .then(() => {
                    this.connecting = false;
                    resolve();
                })
                .catch((error) => {
                    this.socket.close();
                    this.connecting = false;
                    reject(new Error(error));
                });
        });
    }

    /**
     * Disconnect from the server
     */
    disconnect() {
        this.socket.close();
    }

    /**
     * Sends the color command to the server
     * @param {object} color - Color to set
     * @param {number} color.r - Red value
     * @param {number} color.g - Green value
     * @param {number} color.b - Blue value
     * @param {number} duration - Duration in seconds
     * @returns {Promise<object>} Resolves with the command sent
     */
    setColor(color, duration) {
        const intColor = [
            Math.floor(color.r),
            Math.floor(color.g),
            Math.floor(color.b)
        ];

        const cmd = {
            command: 'color',
            color: intColor,
            priority: this.server.priority
        };

        if (duration) {
            cmd.duration = duration * 1000;
        }

        return this.sendCommand(cmd);
    }

    /**
     * Clear colors for the current priority
     * @returns {Promise<object>} Resolves with the command sent
     */
    clear() {
        const cmd = {
            command: 'clear',
            priority: this.server.priority
        };
        return this.sendCommand(cmd);
    }

    /**
     * Clear all priorities
     * @returns {Promise<object>} Resolves with the command sent
     */
    clearall() {
        const cmd = {
            command: 'clearall'
        };
        return this.sendCommand(cmd);
    }

    /**
     * Sends a command to run specified effect
     * @param {object} effect - Effect object
     * @param {string} effect.name - Effect name
     * @param {object} effect.args - Effect arguments
     * @returns {Promise<object>} Resolves with the command sent
     */
    runEffect(effect) {
        if (!effect) {
            return Promise.reject(new Error('No effect specified'));
        }

        const cmd = {
            command: 'effect',
            effect: {
                name: effect.name,
                args: effect.args
            },
            priority: this.server.priority
        };
        return this.sendCommand(cmd);
    }

    /**
     * Sends a command for color transformation
     * @param {../models/Transform} transform - Transform parameters
     * @returns {Promise<object>} Resolves with the command sent
     */
    setTransform(transform) {
        if (!transform) {
            return Promise.reject(new Error('No transform specified'));
        }

        const cmd = {
            command: 'transform',
            transform: transform
        };

        return this.sendCommand(cmd);
    }

    /**
     * Sends a command to the server
     * @private
     * @param {object|string} command - Command to send
     * @returns {Promise<object>} Resolves with the command sent
     */
    sendCommand(command) {
        if (!command) {
            return Promise.reject(new Error('No command specified'));
        }

        const data = typeof command === 'string'
            ? command
            : JSON.stringify(command);

        return this.socket.write(data + '\n')
    }

    /**
     * Get the information about the hyperion server
     * @returns {Promise<object>} Resolves with server info
     */
    getServerInfo() {
        const cmd = { command: 'serverinfo' };

        return new Promise((resolve, reject) => {
            this.socket.write(JSON.stringify(cmd) + '\n')
                .then(() => this.socket.read())
                .then(result => {
                    try {
                        const str = tools.ab2str(result);
                        const dataobj = JSON.parse(str);
                        resolve(dataobj.info);
                    } catch (e) {
                        reject(new Error('Failed to parse server info: ' + e.message));
                    }
                })
                .catch(reject);
        });
    }

    /**
     * Check if the API is connecting to the server
     * @returns {boolean} True if connecting
     */
    isConnecting() {
        return this.connecting;
    }

    /**
     * Check if connected to the server
     * @returns {boolean} Resolves with connection status
     */
    isConnected() {
        return this.socket.isConnected();
    }
}