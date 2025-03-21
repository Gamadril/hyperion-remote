/**
 * @class Server
 * @classdesc Server model representing a Hyperion server connection
 */
export class Server {
    /**
     * Creates a new Server instance
     * @param {string} address - Server address
     * @param {number} port - Server port
     * @param {string} [name=''] - Server name
     * @param {boolean} [selected=false] - Whether this server is selected
     * @param {boolean} [forceWs=false] - Whether to force unencrypted WebSocket connection
     */
    constructor(address = '', port = 8090, name = '', selected = false, forceWs = false) {
        this.address = address;
        this.port = port;
        this.name = name;
        this.selected = selected;
        this.forceWs = forceWs;
    }

    /**
     * Validates whether the server has valid connection details
     * @returns {boolean} Whether the server has valid connection details
     */
    isValid() {
        return this.address && this.address.length > 0 && 
               this.port && this.port > 0;
    }

    /**
     * Get the display name for the server
     * @returns {string} The server's name or address if name is not set
     */
    getDisplayName() {
        if (this.name && this.name.length > 0) {
            return this.name;
        }
        return this.address;
    }

    /**
     * Creates a server object from a plain object
     * @param {object} obj - Plain object with server properties
     * @returns {Server} A new Server instance
     */
    static fromObject(obj) {
        return new Server(
            obj.address,
            obj.port,
            obj.name,
            obj.selected,
            obj.forceWs
        );
    }
}
