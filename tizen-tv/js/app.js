// Game-on-TV Tizen Application
class GameOnTVApp {
    constructor() {
        this.ws = null;
        this.servers = [];
        this.selectedServer = null;
        this.focusedServerIndex = 0;
        this.isConnected = false;
        this.streamConfig = null;
        this.controlsPanelVisible = false;
        this.overlayVisible = true;
        this.overlayTimeout = null;

        this.init();
    }

    init() {
        console.log('Initializing Game-on-TV app');
        this.registerKeys();
        this.showScreen('discoveryScreen');
        this.discoverServers();
    }

    registerKeys() {
        // Register TV remote keys
        try {
            tizen.tvinputdevice.registerKey('MediaPlay');
            tizen.tvinputdevice.registerKey('MediaPause');
            tizen.tvinputdevice.registerKey('MediaStop');
            tizen.tvinputdevice.registerKey('0');
            tizen.tvinputdevice.registerKey('1');
            tizen.tvinputdevice.registerKey('2');
            tizen.tvinputdevice.registerKey('3');
            tizen.tvinputdevice.registerKey('4');
            tizen.tvinputdevice.registerKey('5');
            tizen.tvinputdevice.registerKey('6');
            tizen.tvinputdevice.registerKey('7');
            tizen.tvinputdevice.registerKey('8');
            tizen.tvinputdevice.registerKey('9');
        } catch (e) {
            console.error('Error registering keys:', e);
        }

        // Handle key events
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    handleKeyDown(event) {
        const keyCode = event.keyCode;
        const currentScreen = document.querySelector('.screen.active').id;

        console.log('Key pressed:', keyCode, 'Current screen:', currentScreen);

        switch (currentScreen) {
            case 'discoveryScreen':
                this.handleDiscoveryKeys(keyCode);
                break;
            case 'streamingScreen':
                this.handleStreamingKeys(keyCode);
                break;
            case 'errorScreen':
                if (keyCode === 10009) { // RETURN
                    this.showScreen('discoveryScreen');
                    this.discoverServers();
                }
                break;
        }
    }

    handleDiscoveryKeys(keyCode) {
        switch (keyCode) {
            case 38: // UP
                this.navigateServers(-1);
                break;
            case 40: // DOWN
                this.navigateServers(1);
                break;
            case 13: // ENTER/OK
                if (this.servers.length === 0) {
                    this.discoverServers();
                } else {
                    this.connectToServer(this.servers[this.focusedServerIndex]);
                }
                break;
            case 10009: // RETURN
                tizen.application.getCurrentApplication().exit();
                break;
        }
    }

    handleStreamingKeys(keyCode) {
        // Show overlay on any key
        this.showOverlay();

        switch (keyCode) {
            case 10009: // RETURN
                this.disconnect();
                break;
            case 457: // INFO
                this.toggleControlsPanel();
                break;
            default:
                // Forward input to PC
                this.sendInput(keyCode);
                break;
        }
    }

    navigateServers(direction) {
        if (this.servers.length === 0) return;

        this.focusedServerIndex += direction;
        if (this.focusedServerIndex < 0) {
            this.focusedServerIndex = this.servers.length - 1;
        } else if (this.focusedServerIndex >= this.servers.length) {
            this.focusedServerIndex = 0;
        }

        this.updateServerFocus();
    }

    updateServerFocus() {
        const items = document.querySelectorAll('.server-item');
        items.forEach((item, index) => {
            if (index === this.focusedServerIndex) {
                item.classList.add('focused');
            } else {
                item.classList.remove('focused');
            }
        });
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    async discoverServers() {
        console.log('Discovering servers...');
        const discoveryText = document.getElementById('discoveryText');
        const serverList = document.getElementById('serverList');

        discoveryText.textContent = 'Searching for PC controllers on your network...';
        serverList.innerHTML = '';
        this.servers = [];

        try {
            // Common subnet patterns to try
            const subnets = ['192.168.1', '192.168.0', '10.0.0', '192.168.100'];
            const promises = [];
            const BATCH_SIZE = 20; // Scan in batches to avoid overwhelming the network

            for (const subnet of subnets) {
                // Scan most common addresses first
                const commonAddresses = [1, 100, 101, 102, 254];
                
                for (const addr of commonAddresses) {
                    const ip = `${subnet}.${addr}`;
                    promises.push(this.checkServer(ip, 8080));
                }
            }

            // Wait for common addresses first
            await Promise.all(promises);

            if (this.servers.length > 0) {
                discoveryText.textContent = `Found ${this.servers.length} PC controller(s)`;
                this.renderServers();
            } else {
                // If nothing found, scan more addresses in batches
                discoveryText.textContent = 'Scanning additional addresses...';
                
                for (const subnet of subnets) {
                    for (let i = 2; i < 254; i += BATCH_SIZE) {
                        const batchPromises = [];
                        for (let j = 0; j < BATCH_SIZE && (i + j) < 254; j++) {
                            const ip = `${subnet}.${i + j}`;
                            batchPromises.push(this.checkServer(ip, 8080));
                        }
                        await Promise.all(batchPromises);
                        
                        if (this.servers.length > 0) {
                            discoveryText.textContent = `Found ${this.servers.length} PC controller(s)`;
                            this.renderServers();
                            return;
                        }
                    }
                }

                discoveryText.textContent = 'No PC controllers found';
                serverList.innerHTML = '<div class="empty-state">Make sure your PC is running the Game-on-TV PC Controller app and connected to the same network</div>';
            }
        } catch (error) {
            console.error('Discovery error:', error);
            discoveryText.textContent = 'Error during discovery';
        }
    }

    async getLocalSubnet() {
        // This method is no longer used - keeping for API compatibility
        return '192.168.1';
    }

    async checkServer(ip, port) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1000);

        try {
            const response = await fetch(`http://${ip}:${port}/api/discover`, {
                method: 'GET',
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                this.servers.push({
                    ip: ip,
                    port: port,
                    name: data.name,
                    version: data.version,
                    capabilities: data.capabilities
                });
            }
        } catch (error) {
            // Server not found at this IP or timeout - this is expected
            clearTimeout(timeoutId);
        }
    }

    renderServers() {
        const serverList = document.getElementById('serverList');
        serverList.innerHTML = '';

        this.servers.forEach((server, index) => {
            const serverItem = document.createElement('div');
            serverItem.className = 'server-item';
            if (index === this.focusedServerIndex) {
                serverItem.classList.add('focused');
            }

            serverItem.innerHTML = `
                <h3>🖥️ ${server.name}</h3>
                <p><strong>IP:</strong> ${server.ip}:${server.port}</p>
                <p><strong>Version:</strong> ${server.version}</p>
                <p><strong>Capabilities:</strong> ${server.capabilities.join(', ')}</p>
            `;

            serverItem.addEventListener('click', () => {
                this.connectToServer(server);
            });

            serverList.appendChild(serverItem);
        });
    }

    connectToServer(server) {
        console.log('Connecting to server:', server);
        this.selectedServer = server;
        this.showScreen('connectingScreen');
        
        const connectingText = document.getElementById('connectingText');
        connectingText.textContent = `Connecting to ${server.name} (${server.ip})...`;

        const wsUrl = `ws://${server.ip}:${server.port}`;
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
            console.log('WebSocket connected');
            this.isConnected = true;
            this.requestStream();
        };

        this.ws.onmessage = (event) => {
            this.handleServerMessage(event.data);
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.showError('Connection failed. Please check your network and try again.');
        };

        this.ws.onclose = () => {
            console.log('WebSocket closed');
            this.isConnected = false;
            if (document.querySelector('.screen.active').id === 'streamingScreen') {
                this.showError('Connection lost');
            }
        };
    }

    handleServerMessage(data) {
        try {
            const message = JSON.parse(data);
            console.log('Received message:', message.type);

            switch (message.type) {
                case 'connected':
                    console.log('Connected to server, client ID:', message.clientId);
                    break;
                case 'stream-ready':
                    this.startStreaming(message.config);
                    break;
                case 'stream-started':
                    this.updateStreamInfo(message.config);
                    break;
                case 'stream-stopped':
                    this.disconnect();
                    break;
                case 'pong':
                    // Handle ping/pong
                    break;
            }
        } catch (error) {
            console.error('Error handling server message:', error);
        }
    }

    requestStream() {
        if (!this.ws || !this.isConnected) return;

        const config = {
            resolution: '1920x1080',
            fps: 60
        };

        this.ws.send(JSON.stringify({
            type: 'request-stream',
            config: config
        }));
    }

    startStreaming(config) {
        console.log('Starting stream with config:', config);
        this.streamConfig = config;
        this.showScreen('streamingScreen');

        // Update stream info
        this.updateStreamInfo(config);

        // Setup video player (in a real implementation, this would use WebRTC)
        const videoPlayer = document.getElementById('videoPlayer');
        
        // For demonstration, we'll show a message
        // In production, you would set up WebRTC here
        console.log('Video streaming would start here with WebRTC');

        // Start overlay auto-hide timer
        this.startOverlayTimer();
    }

    updateStreamInfo(config) {
        document.getElementById('streamInfo').textContent = 
            `${this.selectedServer.name} | ${config.resolution} @ ${config.fps}fps`;
        document.getElementById('currentResolution').textContent = config.resolution;
        document.getElementById('currentFPS').textContent = config.fps;
    }

    sendInput(keyCode) {
        if (!this.ws || !this.isConnected) return;

        this.ws.send(JSON.stringify({
            type: 'input',
            input: {
                keyCode: keyCode,
                timestamp: Date.now()
            }
        }));
    }

    toggleControlsPanel() {
        this.controlsPanelVisible = !this.controlsPanelVisible;
        const panel = document.getElementById('controlsPanel');
        
        if (this.controlsPanelVisible) {
            panel.classList.remove('hidden');
            // Update latency and other stats
            this.updateStreamStats();
        } else {
            panel.classList.add('hidden');
        }
    }

    updateStreamStats() {
        // In production, calculate real latency
        document.getElementById('latency').textContent = '~20ms';
        document.getElementById('connectionStatus').textContent = 
            this.isConnected ? 'Connected' : 'Disconnected';
    }

    showOverlay() {
        const overlay = document.getElementById('streamingOverlay');
        overlay.classList.remove('hidden');
        this.overlayVisible = true;

        this.startOverlayTimer();
    }

    startOverlayTimer() {
        if (this.overlayTimeout) {
            clearTimeout(this.overlayTimeout);
        }

        this.overlayTimeout = setTimeout(() => {
            const overlay = document.getElementById('streamingOverlay');
            overlay.classList.add('hidden');
            this.overlayVisible = false;
        }, 5000);
    }

    disconnect() {
        console.log('Disconnecting...');

        if (this.ws) {
            this.ws.send(JSON.stringify({ type: 'stop-stream' }));
            this.ws.close();
            this.ws = null;
        }

        this.isConnected = false;
        this.showScreen('discoveryScreen');
        this.discoverServers();
    }

    showError(message) {
        document.getElementById('errorText').textContent = message;
        this.showScreen('errorScreen');
    }
}

// Initialize app when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    window.app = new GameOnTVApp();
});
