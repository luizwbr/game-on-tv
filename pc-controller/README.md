# Game-on-TV PC Controller

The PC Controller application for Game-on-TV allows you to stream your PC games to Samsung Tizen TVs over your local network.

## Features

- 🎮 Stream PC games to Samsung Smart TV
- 🌐 WebSocket-based communication
- 🎯 Low-latency game streaming
- 📺 Support for Full HD and 4K resolutions
- 🎛️ Configurable FPS (30/60/120)
- 👥 Multiple client support
- 🔍 Automatic discovery by TV apps

## Requirements

- Node.js 16 or later
- Windows, macOS, or Linux
- Local network connection (Ethernet recommended for best performance)

## Installation

### From Source

```bash
cd pc-controller
npm install
```

## Usage

### Start the Application

```bash
npm start
```

Or for development mode with DevTools:

```bash
npm run dev
```

### Building

To build distributable packages:

```bash
npm run build
```

This will create platform-specific packages in the `dist/` directory.

## How It Works

1. The PC Controller starts a WebSocket server on port 8080
2. It broadcasts discovery information on the local network
3. Tizen TV apps can discover and connect to the controller
4. Game streaming begins when a TV client requests it

## Configuration

### Stream Settings

Configure in the application UI:
- **Resolution**: 1080p, 2K, or 4K
- **Frame Rate**: 30, 60, or 120 FPS

### Network Settings

The application automatically detects local network interfaces. Ensure:
- Port 8080 is not blocked by firewall
- PC and TV are on the same local network

## Architecture

```
┌─────────────────┐
│   Electron UI   │
│  (Renderer)     │
└────────┬────────┘
         │
    ┌────┴────┐
    │  Main   │
    │ Process │
    └────┬────┘
         │
    ┌────┴─────────┐
    │  Streaming   │
    │   Server     │
    │ (WebSocket)  │
    └──────────────┘
         │
         │ WebSocket
         │
    ┌────┴──────┐
    │ Tizen TV  │
    │   Client  │
    └───────────┘
```

## API Endpoints

### HTTP Endpoints

- `GET /api/discover` - Discovery endpoint for TV apps
- `GET /api/info` - Server information

### WebSocket Messages

#### Client → Server

```json
{
  "type": "request-stream",
  "config": {
    "resolution": "1920x1080",
    "fps": 60
  }
}
```

```json
{
  "type": "input",
  "input": {
    "keyCode": 37,
    "timestamp": 1234567890
  }
}
```

```json
{
  "type": "stop-stream"
}
```

#### Server → Client

```json
{
  "type": "connected",
  "clientId": "client_123",
  "serverInfo": { ... }
}
```

```json
{
  "type": "stream-ready",
  "config": {
    "resolution": "1920x1080",
    "fps": 60,
    "codec": "h264"
  }
}
```

## Development

### Project Structure

```
pc-controller/
├── package.json
├── src/
│   ├── main.js          # Electron main process
│   ├── server.js        # WebSocket server
│   ├── index.html       # UI
│   ├── styles.css       # Styles
│   └── renderer.js      # UI logic
└── dist/                # Build output
```

### Technologies Used

- **Electron**: Cross-platform desktop application framework
- **Express**: HTTP server for REST API
- **WebSocket (ws)**: Real-time bidirectional communication
- **Node-WebRTC**: WebRTC support for video streaming (planned)
- **RobotJS**: Keyboard/mouse input simulation (planned)

## Roadmap

- [x] Basic WebSocket communication
- [x] Client discovery and connection
- [x] UI for server management
- [ ] WebRTC video streaming implementation
- [ ] Screen capture integration
- [ ] Input forwarding (keyboard/mouse/gamepad)
- [ ] Audio streaming
- [ ] Encryption for secure streaming

## Troubleshooting

**Server won't start**
- Check if port 8080 is already in use
- Ensure you have proper network permissions

**TV cannot discover PC**
- Check firewall settings
- Ensure both devices are on same network
- Verify the server is running

**Performance issues**
- Use wired Ethernet connection
- Reduce resolution/FPS settings
- Close other network-intensive applications

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

MIT License
