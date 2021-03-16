const Cache = require('memory-cache');
const ping = require('ping');
const request = require('request');

class Pterodactyl {

    constructor(interval = 10000) {
        this.interval = interval;
        this.panelURL = global.Config.get("pterodactyl.panel.url");
        this.panelAPIKey = global.Config.get("pterodactyl.panel.apiKey");
        this.initCache();
    }

    initCache() {
        let that = this;
        setInterval(async function() {
            that.updateNodes();
            that.updateStatus();
            that.updateLocations();
            that.updateServers();
            that.updateUsers();
        }, this.interval)
        this.updateNodes();
        this.updateStatus();
        this.updateLocations();
        this.updateServers();
        this.updateUsers();
        this.lastUpdated = Date.now();
    }

    updateNodes() {
        request.get(this.panelURL + "/api/application/nodes", {
            auth: {
                bearer: this.panelAPIKey
            }
        }, async function(err, response, body) {
            if (err) throw err
            body = JSON.parse(body);
            await Cache.put("nodes", body.data.map(n => {
                let data = n.attributes;
                delete data.memory_overallocate;
                delete data.disk_overallocate;
                delete data.allocated_resources;
                return data;
            }));
        });
    }

    updateLocations() {
        request.get(this.panelURL + "/api/application/locations", {
            auth: {
                bearer: this.panelAPIKey
            }
        }, async function(err, response, body) {
            if (err) throw err
            body = JSON.parse(body);
            await Cache.put("locations", body.data.map(n => n.attributes));
        });
    }

    async updateStatus() {
        let nodes = await Cache.get("nodes", false);
        if (!nodes) return;

        let locations = await Cache.get("locations", false);
        if (!locations) return;

        let output = {
            nodes: {},
            lastUpdated: Date.now(),
        };

        nodes.forEach(function(node, index) {
            ping.sys.probe(node.fqdn, function(isAlive) {

                let location = locations.find(l => l.id === node.location_id)["long"];
                if (!location) return;

                if (output.nodes.hasOwnProperty(location)) {
                    output.nodes[location].push({
                        host: node.display_fqdn || node.fqdn,
                        online: isAlive,
                    });
                } else {
                    output.nodes[location] = [{
                        host: node.display_fqdn || node.fqdn,
                        online: isAlive,
                    }
                    ];
                }

            });
        });

        return Cache.put("status", output);;
    }

    updateServers() {
        request.get(this.panelURL + "/api/application/servers", {
            auth: {
                bearer: this.panelAPIKey
            }
        }, async function(err, response, body) {
            if (err) throw err
            body = JSON.parse(body);
            await Cache.put("servers", body['meta']['pagination']['total']);
        });
    }

    updateUsers() {
        request.get(this.panelURL + "/api/application/users", {
            auth: {
                bearer: this.panelAPIKey
            }
        }, async function(err, response, body) {
            if (err) throw err
            body = JSON.parse(body);
            await Cache.put("users", body['meta']['pagination']['total']);
        });
    }

    async getNodes(cache = true) {
        if (cache) return Cache.get("nodes");
    }

    async getLocations(cache = true) {
        if (cache) return Cache.get("locations");
    }

    async getStatus(cache = true) {
        if (cache) return Cache.get("status");
    }

    async getServers(cache = true) {
        if (cache) return Cache.get("servers");
    }

    async getUsers(cache = true) {
        if (cache) return Cache.get("users");
    }

    async getStats(cache = true) {
        if (cache) return {
            users: Cache.get("users"),
            servers: Cache.get("servers"),
            nodes: Cache.get("nodes").length
        }
    }

}

module.exports = Pterodactyl;
