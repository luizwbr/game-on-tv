const EventEmitter = require('events');
const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const os = require('os');

class StreamingServer extends EventEmitter {
  constructor() {
    super();
    this.app = express();
    this.server = null;
    this.wss = null;
    this.clients = new Map();
    this.port = 8080;
    this.isStreaming = false;
    this.streamConfig = null;
  }

  start() {
    this.app.use(express.json());
    this.app.use(express.static('public'));

    // Discovery endpoint for TV apps
    this.app.get('/api/discover', (req, res) => {
      res.json({
        name: os.hostname(),
        version: '1.0.0',
        capabilities: ['webrtc', 'websocket', '4k'],
        port: this.port
      });
    });

    // Server info endpoint
    this.app.get('/api/info', (req, res) => {
      res.json(this.getInfo());
    });

    // Create HTTP server
    this.server = http.createServer(this.app);

    // Create WebSocket server
    this.wss = new WebSocket.Server({ server: this.server });

    this.wss.on('connection', (ws, req) => {
      const clientId = this.generateClientId();
      const clientInfo = {
        id: clientId,
        ip: req.socket.remoteAddress,
        connectedAt: new Date().toISOString()
      };

      this.clients.set(clientId, { ws, info: clientInfo });
      this.emit('client-connected', clientInfo);

      ws.on('message', (message) => {
        this.handleClientMessage(clientId, message);
      });

      ws.on('close', () => {
        this.clients.delete(clientId);
        this.emit('client-disconnected', clientId);
      });

      ws.on('error', (error) => {
        console.error(`WebSocket error for client ${clientId}:`, error);
      });

      // Send welcome message
      ws.send(JSON.stringify({
        type: 'connected',
        clientId: clientId,
        serverInfo: this.getInfo()
      }));
    });

    this.server.listen(this.port, () => {
      console.log(`Streaming server started on port ${this.port}`);
      this.emit('status', {
        running: true,
        port: this.port,
        addresses: this.getLocalAddresses()
      });
    });
  }

  stop() {
    if (this.wss) {
      this.wss.close();
    }
    if (this.server) {
      this.server.close();
    }
    this.emit('status', { running: false });
  }

  handleClientMessage(clientId, message) {
    try {
      const data = JSON.parse(message);
      const client = this.clients.get(clientId);

      if (!client) return;

      switch (data.type) {
        case 'input':
          this.handleInput(data.input);
          break;
        case 'request-stream':
          this.handleStreamRequest(clientId, data.config);
          break;
        case 'stop-stream':
          this.handleStopStream(clientId);
          break;
        case 'ping':
          client.ws.send(JSON.stringify({ type: 'pong' }));
          break;
        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error handling client message:', error);
    }
  }

  handleInput(input) {
    // Input handling will be implemented with robotjs
    // For now, just log the input
    console.log('Received input:', input);
  }

  handleStreamRequest(clientId, config) {
    const client = this.clients.get(clientId);
    if (!client) return;

    // Acknowledge stream request
    client.ws.send(JSON.stringify({
      type: 'stream-ready',
      config: {
        resolution: config.resolution || '1920x1080',
        fps: config.fps || 60,
        codec: 'h264'
      }
    }));

    this.isStreaming = true;
    this.streamConfig = config;
  }

  handleStopStream(clientId) {
    const client = this.clients.get(clientId);
    if (!client) return;

    client.ws.send(JSON.stringify({
      type: 'stream-stopped'
    }));

    this.isStreaming = false;
    this.streamConfig = null;
  }

  startStreaming(config) {
    this.isStreaming = true;
    this.streamConfig = config;
    
    // Broadcast to all clients
    this.broadcast({
      type: 'stream-started',
      config: config
    });

    return { success: true };
  }

  stopStreaming() {
    this.isStreaming = false;
    this.streamConfig = null;

    this.broadcast({
      type: 'stream-stopped'
    });

    return { success: true };
  }

  broadcast(message) {
    const data = JSON.stringify(message);
    this.clients.forEach((client) => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(data);
      }
    });
  }

  getInfo() {
    return {
      hostname: os.hostname(),
      platform: os.platform(),
      addresses: this.getLocalAddresses(),
      port: this.port,
      isStreaming: this.isStreaming,
      clientCount: this.clients.size,
      streamConfig: this.streamConfig
    };
  }

  getLocalAddresses() {
    const interfaces = os.networkInterfaces();
    const addresses = [];

    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          addresses.push(iface.address);
        }
      }
    }

    return addresses;
  }

  generateClientId() {
    return `client_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  }
}

module.exports = StreamingServer;
