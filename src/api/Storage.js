import { Server } from '../models/Server';

export class Storage {
    static saveServers(servers) {
        localStorage.setItem('servers', JSON.stringify(servers));
    }

    static loadServers() {
        const serversData = localStorage.getItem('servers');
        if (serversData) {
            try {
                const parsedServers = JSON.parse(serversData);
                // Convert plain objects to Server instances
                return parsedServers.map(serverObj => Server.fromObject(serverObj));
            } catch (error) {
                console.error('Error parsing servers from storage:', error);
                return [];
            }
        }
        return [];
    }
}