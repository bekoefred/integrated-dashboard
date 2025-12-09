const EventEmitter = require('events');
const dgram = require('dgram');
const dns = require('dns').promises;
const net = require('net');

/**
 * Enhanced SIP Monitor with FreeSWITCH ESL Integration
 * Monitors SIP trunk availability, latency, and active calls
 */
class SipMonitor extends EventEmitter {
    constructor(trunks, options = {}) {
        super();
        this.trunks = trunks;
        this.running = false;
        this.interval = options.interval || 5000; // Default 5 seconds
        this.timeout = options.timeout || 3000; // Default 3 second timeout
        this.userAgent = options.userAgent || 'SIP-Dashboard-Monitor/1.0';
        this.monitoringIntervals = new Map();
        this.eslConnections = new Map(); // Store ESL connections
    }

    async start() {
        this.running = true;
        console.log('Starting SIP Monitor...');

        // Start monitoring each trunk
        for (const trunk of this.trunks) {
            this.startMonitoringTrunk(trunk);
        }
    }

    stop() {
        this.running = false;
        console.log('Stopping SIP Monitor...');

        // Clear all monitoring intervals
        for (const [trunkId, intervalId] of this.monitoringIntervals) {
            clearInterval(intervalId);
        }
        this.monitoringIntervals.clear();

        // Close all ESL connections
        for (const [trunkId, connection] of this.eslConnections) {
            if (connection.socket) {
                connection.socket.end();
            }
        }
        this.eslConnections.clear();
    }

    startMonitoringTrunk(trunk) {
        // Initial check
        this.checkTrunk(trunk);

        // Schedule periodic checks
        const intervalId = setInterval(() => {
            this.checkTrunk(trunk);
        }, this.interval);

        this.monitoringIntervals.set(trunk.id, intervalId);
    }

    async checkTrunk(trunk) {
        try {
            // Resolve hostname to IP if needed
            let targetIp = trunk.ip;
            if (!this.isValidIP(trunk.ip)) {
                try {
                    const addresses = await dns.resolve4(trunk.ip);
                    targetIp = addresses[0];
                } catch (dnsError) {
                    console.error(`DNS resolution failed for ${trunk.ip}:`, dnsError.message);
                    this.emitUpdate(trunk.id, {
                        type: 'status',
                        value: 'Down',
                        latency: 'N/A',
                        calls: 0,
                        error: 'DNS resolution failed'
                    });
                    return;
                }
            }

            // Check basic connectivity with SIP OPTIONS
            const startTime = Date.now();
            const result = await this.sendOptionsRequest(targetIp, trunk.port);
            const latency = Date.now() - startTime;

            if (result.success) {
                // Determine status based on latency
                let status = 'Up';
                if (latency > 150) {
                    status = 'Lag';
                }

                // Get call metrics and gateway status if FreeSWITCH ESL is configured
                let calls = 0;
                let gatewayStatus = null;

                if (trunk.eslPort && trunk.eslPassword) {
                    // Get active calls
                    calls = await this.getActiveCalls(trunk, targetIp);

                    // Check gateway registration status for external providers
                    if (trunk.gatewayName) {
                        gatewayStatus = await this.getGatewayStatus(trunk, targetIp);

                        // Override status based on gateway registration
                        if (gatewayStatus && gatewayStatus.state !== 'REGED') {
                            status = 'Down';
                            console.log(`Gateway ${trunk.gatewayName} is ${gatewayStatus.state}, marking as Down`);
                        }
                    }
                }

                this.emitUpdate(trunk.id, {
                    type: 'status',
                    value: status,
                    latency: `${latency}ms`,
                    calls: calls,
                    responseCode: result.code,
                    gatewayState: gatewayStatus ? gatewayStatus.state : null
                });
            } else {
                this.emitUpdate(trunk.id, {
                    type: 'status',
                    value: 'Down',
                    latency: 'N/A',
                    calls: 0,
                    error: result.error
                });
            }
        } catch (error) {
            console.error(`Error checking trunk ${trunk.name}:`, error.message);
            this.emitUpdate(trunk.id, {
                type: 'status',
                value: 'Down',
                latency: 'N/A',
                calls: 0,
                error: error.message
            });
        }
    }

    async getActiveCalls(trunk, ip) {
        try {
            // Query FreeSWITCH ESL for active calls on this gateway/profile
            const command = trunk.gatewayName
                ? `api show calls as json where gateway_name = ${trunk.gatewayName}`
                : `api show calls count`;

            const response = await this.sendESLCommand(ip, trunk.eslPort, trunk.eslPassword, command);

            if (trunk.gatewayName) {
                // Parse JSON response
                try {
                    const data = JSON.parse(response);
                    return data.row_count || 0;
                } catch (e) {
                    console.error(`Failed to parse ESL response for ${trunk.name}:`, e.message);
                    return 0;
                }
            } else {
                // Parse simple count response
                const match = response.match(/(\d+) total/);
                return match ? parseInt(match[1]) : 0;
            }
        } catch (error) {
            console.error(`Failed to get call count for ${trunk.name}:`, error.message);
            return 0;
        }
    }

    async getGatewayStatus(trunk, ip) {
        try {
            // Query FreeSWITCH for gateway status
            const command = `api sofia status gateway ${trunk.gatewayName}`;
            const response = await this.sendESLCommand(ip, trunk.eslPort, trunk.eslPassword, command);

            // Parse response
            // Example output:
            // Gateway twilio_trunk
            // ================================================================================
            // Scheme: Digest
            // Realm: sip.twilio.com
            // Username: +1234567890
            // Password: yes
            // From: <sip:+1234567890@sip.twilio.com>
            // Contact: <sip:gw+twilio_trunk@192.168.1.1:5060>
            // Exten: +1234567890
            // To: sip:+1234567890@sip.twilio.com
            // Proxy: sip:sip.twilio.com
            // Context: public
            // Expires: 600
            // Freq: 600
            // Ping: 25
            // PingFreq: 25
            // PingState: 0/0/0
            // State: REGED
            // Status: UP
            // CallsIN: 0
            // CallsOUT: 0
            // FailedCallsIN: 0
            // FailedCallsOUT: 0

            const stateMatch = response.match(/State:\s+(\w+)/);
            const statusMatch = response.match(/Status:\s+(\w+)/);
            const callsInMatch = response.match(/CallsIN:\s+(\d+)/);
            const callsOutMatch = response.match(/CallsOUT:\s+(\d+)/);

            if (stateMatch) {
                return {
                    state: stateMatch[1],           // REGED, NOREG, FAILED, etc.
                    status: statusMatch ? statusMatch[1] : 'UNKNOWN',  // UP, DOWN
                    callsIn: callsInMatch ? parseInt(callsInMatch[1]) : 0,
                    callsOut: callsOutMatch ? parseInt(callsOutMatch[1]) : 0
                };
            }

            return null;
        } catch (error) {
            console.error(`Failed to get gateway status for ${trunk.name}:`, error.message);
            return null;
        }
    }

    sendESLCommand(ip, port, password, command) {
        return new Promise((resolve, reject) => {
            const socket = new net.Socket();
            let buffer = '';
            let authenticated = false;

            socket.setTimeout(this.timeout);

            socket.on('data', (data) => {
                buffer += data.toString();

                if (!authenticated && buffer.includes('Content-Type: auth/request')) {
                    // Send authentication
                    socket.write(`auth ${password}\n\n`);
                    buffer = '';
                } else if (!authenticated && buffer.includes('Reply-Text: +OK accepted')) {
                    authenticated = true;
                    // Send command
                    socket.write(`${command}\n\n`);
                    buffer = '';
                } else if (authenticated && buffer.includes('\n\n')) {
                    // Got response
                    socket.end();
                    // Extract the body after headers
                    const parts = buffer.split('\n\n');
                    resolve(parts[1] || parts[0]);
                }
            });

            socket.on('error', (err) => {
                socket.destroy();
                reject(err);
            });

            socket.on('timeout', () => {
                socket.destroy();
                reject(new Error('ESL connection timeout'));
            });

            socket.connect(port, ip);
        });
    }

    sendOptionsRequest(ip, port) {
        return new Promise((resolve) => {
            const socket = dgram.createSocket('udp4');
            const callId = this.generateCallId();
            const branch = this.generateBranch();

            // Build SIP OPTIONS request
            const sipRequest = this.buildOptionsRequest(ip, port, callId, branch);

            let timeoutId;
            let resolved = false;

            // Set timeout
            timeoutId = setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    socket.close();
                    resolve({ success: false, error: 'Timeout' });
                }
            }, this.timeout);

            // Handle response
            socket.on('message', (msg) => {
                if (!resolved) {
                    resolved = true;
                    clearTimeout(timeoutId);
                    socket.close();

                    const response = msg.toString();
                    const statusLine = response.split('\r\n')[0];
                    const statusCode = parseInt(statusLine.split(' ')[1]);

                    // Any response indicates the server is UP
                    // 2xx = OK
                    // 401/403 = Unauthorized (Server is up but requires auth)
                    // 404 = Not Found (Server is up but endpoint doesn't exist)
                    // 405 = Method Not Allowed (Server is up but doesn't support OPTIONS)
                    if ((statusCode >= 200 && statusCode < 300) ||
                        statusCode === 401 ||
                        statusCode === 403 ||
                        statusCode === 404 ||
                        statusCode === 405) {
                        resolve({ success: true, code: statusCode });
                    } else {
                        // 5xx/6xx might indicate server issues
                        resolve({ success: false, error: `SIP ${statusCode}` });
                    }
                }
            });

            socket.on('error', (err) => {
                if (!resolved) {
                    resolved = true;
                    clearTimeout(timeoutId);
                    socket.close();
                    resolve({ success: false, error: err.message });
                }
            });

            // Send the request
            try {
                socket.send(sipRequest, port, ip);
            } catch (err) {
                if (!resolved) {
                    resolved = true;
                    clearTimeout(timeoutId);
                    socket.close();
                    resolve({ success: false, error: err.message });
                }
            }
        });
    }

    buildOptionsRequest(ip, port, callId, branch) {
        const fromTag = this.generateTag();
        const cseq = Math.floor(Math.random() * 10000);

        return [
            `OPTIONS sip:${ip}:${port} SIP/2.0`,
            `Via: SIP/2.0/UDP ${this.getLocalIP()}:5060;branch=${branch}`,
            `Max-Forwards: 70`,
            `To: <sip:${ip}:${port}>`,
            `From: <sip:monitor@dashboard>;tag=${fromTag}`,
            `Call-ID: ${callId}`,
            `CSeq: ${cseq} OPTIONS`,
            `Contact: <sip:monitor@${this.getLocalIP()}:5060>`,
            `Accept: application/sdp`,
            `User-Agent: ${this.userAgent}`,
            `Content-Length: 0`,
            '',
            ''
        ].join('\r\n');
    }

    emitUpdate(trunkId, data) {
        this.emit('update', {
            trunkId,
            ...data,
            timestamp: new Date().toISOString()
        });
    }

    updateTrunks(newTrunks) {
        // Stop monitoring removed trunks
        const newTrunkIds = new Set(newTrunks.map(t => t.id));
        for (const [trunkId, intervalId] of this.monitoringIntervals) {
            if (!newTrunkIds.has(trunkId)) {
                clearInterval(intervalId);
                this.monitoringIntervals.delete(trunkId);
            }
        }

        // Start monitoring new trunks
        const existingTrunkIds = new Set(this.trunks.map(t => t.id));
        for (const trunk of newTrunks) {
            if (!existingTrunkIds.has(trunk.id)) {
                this.startMonitoringTrunk(trunk);
            }
        }

        this.trunks = newTrunks;
    }

    // Utility functions
    generateCallId() {
        return `${Date.now()}-${Math.random().toString(36).substring(7)}@dashboard`;
    }

    generateBranch() {
        return `z9hG4bK-${Math.random().toString(36).substring(7)}`;
    }

    generateTag() {
        return Math.random().toString(36).substring(7);
    }

    getLocalIP() {
        const { networkInterfaces } = require('os');
        const nets = networkInterfaces();

        for (const name of Object.keys(nets)) {
            for (const net of nets[name]) {
                // Skip internal and non-IPv4 addresses
                if (net.family === 'IPv4' && !net.internal) {
                    return net.address;
                }
            }
        }

        return '127.0.0.1';
    }

    isValidIP(str) {
        const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
        return ipv4Regex.test(str);
    }
}

module.exports = SipMonitor;
