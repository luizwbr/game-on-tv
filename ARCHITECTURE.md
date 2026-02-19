# Technical Architecture

This document describes the technical architecture of Game-on-TV.

## Overview

Game-on-TV is a distributed system consisting of two main components that communicate over a local network:

1. **PC Controller** - Electron-based desktop application
2. **Tizen TV App** - Web-based Samsung Smart TV application

## Component Architecture

### PC Controller (Electron App)

```
┌─────────────────────────────────────┐
│        Electron Application         │
├─────────────────────────────────────┤
│  Main Process (Node.js)             │
│  ├─ App Lifecycle Management        │
│  ├─ Window Management               │
│  └─ IPC Communication               │
├─────────────────────────────────────┤
│  Renderer Process (Chromium)        │
│  ├─ UI (HTML/CSS/JS)               │
│  ├─ User Controls                   │
│  └─ Status Display                  │
├─────────────────────────────────────┤
│  Streaming Server (Node.js)         │
│  ├─ HTTP Server (Express)          │
│  │  ├─ Discovery API                │
│  │  └─ Info API                     │
│  ├─ WebSocket Server                │
│  │  ├─ Client Connection Mgmt       │
│  │  ├─ Message Routing              │
│  │  └─ Stream Control                │
│  └─ Network Discovery               │
└─────────────────────────────────────┘
```

### Tizen TV App

```
┌─────────────────────────────────────┐
│      Tizen Web Application          │
├─────────────────────────────────────┤
│  UI Layer (HTML/CSS)                │
│  ├─ Discovery Screen                │
│  ├─ Connection Screen               │
│  ├─ Streaming Screen                │
│  └─ Error Screen                    │
├─────────────────────────────────────┤
│  Application Logic (JavaScript)     │
│  ├─ Screen Management               │
│  ├─ TV Remote Key Handling          │
│  ├─ Network Discovery               │
│  └─ State Management                │
├─────────────────────────────────────┤
│  Network Layer                      │
│  ├─ HTTP Client (Discovery)         │
│  ├─ WebSocket Client                │
│  └─ Video Player (HTML5)            │
├─────────────────────────────────────┤
│  Tizen WebAPIs                      │
│  ├─ TV Input Device                 │
│  ├─ Application Manager             │
│  └─ Network Info                    │
└─────────────────────────────────────┘
```

## Communication Protocol

### Discovery Phase

```
TV App                           PC Controller
   │                                    │
   │───── HTTP GET /api/discover ──────▶│
   │                                    │
   │◀──── Server Info (JSON) ───────────│
   │                                    │
```

### Connection Establishment

```
TV App                           PC Controller
   │                                    │
   │───── WebSocket Connect ───────────▶│
   │                                    │
   │◀──── Connected Message ────────────│
   │      (client ID assigned)          │
   │                                    │
```

### Stream Request

```
TV App                           PC Controller
   │                                    │
   │───── request-stream ──────────────▶│
   │      {resolution, fps}             │
   │                                    │
   │◀──── stream-ready ─────────────────│
   │      {config}                      │
   │                                    │
   │◀──── Video Stream ─────────────────│
   │      (WebRTC/WebSocket)            │
   │                                    │
```

### Input Forwarding

```
TV App                           PC Controller
   │                                    │
   │───── input ───────────────────────▶│
   │      {keyCode, timestamp}          │
   │                                    │
   │                                    │──▶ OS Input
   │                                    │    Simulation
```

## Message Format

All WebSocket messages use JSON format:

### Client → Server Messages

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

```json
{
  "type": "ping"
}
```

### Server → Client Messages

```json
{
  "type": "connected",
  "clientId": "client_123_abc",
  "serverInfo": {
    "hostname": "GAMING-PC",
    "platform": "win32",
    "addresses": ["192.168.1.100"],
    "port": 8080
  }
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

```json
{
  "type": "stream-started",
  "config": {
    "resolution": "1920x1080",
    "fps": 60
  }
}
```

```json
{
  "type": "stream-stopped"
}
```

```json
{
  "type": "pong"
}
```

## Network Requirements

### Ports

- **8080** (TCP): HTTP API and WebSocket server
- Future: Additional ports for WebRTC media streams

### Bandwidth Requirements

| Resolution | FPS | Estimated Bandwidth |
|-----------|-----|---------------------|
| 1920x1080 | 30  | ~10 Mbps           |
| 1920x1080 | 60  | ~20 Mbps           |
| 2560x1440 | 60  | ~35 Mbps           |
| 3840x2160 | 60  | ~50-60 Mbps        |

### Latency Targets

- **Optimal**: < 30ms
- **Acceptable**: 30-50ms
- **Poor**: > 50ms

## Data Flow

```
┌──────────┐         ┌───────────┐         ┌──────────┐
│  Game    │────────▶│ Screen    │────────▶│ Video    │
│ Process  │  Render │ Capture   │ Encode  │ Encoder  │
└──────────┘         └───────────┘         └──────────┘
                                                  │
                                                  ▼
┌──────────┐         ┌───────────┐         ┌──────────┐
│  User    │◀────────│  Input    │◀────────│ Network  │
│ Input    │ Inject  │ Receiver  │  Decode │ Stream   │
└──────────┘         └───────────┘         └──────────┘
```

## Technology Stack

### PC Controller

- **Runtime**: Electron (Node.js + Chromium)
- **HTTP Server**: Express.js
- **WebSocket**: ws library
- **UI**: HTML5, CSS3, Vanilla JavaScript
- **Future**: 
  - Screen capture: electron-screenshot or native APIs
  - Video encoding: FFmpeg or WebRTC
  - Input simulation: RobotJS or native APIs

### Tizen TV App

- **Platform**: Tizen Web Application
- **UI**: HTML5, CSS3
- **Logic**: JavaScript (ES6+)
- **APIs**: Tizen WebAPIs
- **Video**: HTML5 Video Element
- **Future**: WebRTC for media streaming

## Security Considerations

### Current Implementation

- Local network only (no internet exposure)
- No authentication (trust-based on local network)
- No encryption (plain WebSocket)

### Future Enhancements

- Optional authentication (PIN code)
- TLS/SSL for WebSocket (WSS)
- Input validation and sanitization
- Rate limiting for input events

## Performance Optimizations

### Current

- Efficient JSON parsing
- Connection pooling
- Event-driven architecture

### Planned

- Video compression
- Adaptive bitrate streaming
- Frame skipping for network congestion
- Input batching
- Predictive input handling

## Scalability

### Current Limitations

- Single PC streams to multiple TVs (broadcast model)
- No peer-to-peer streaming
- No cloud relay

### Future Considerations

- Per-client stream quality
- Multiple simultaneous games
- Stream recording
- Cloud relay for remote access

## Development Roadmap

### Phase 1: Foundation (Current)
- ✅ Basic architecture
- ✅ WebSocket communication
- ✅ Discovery protocol
- ✅ UI framework

### Phase 2: Streaming (Next)
- ⏳ Screen capture integration
- ⏳ Video encoding
- ⏳ WebRTC implementation
- ⏳ Audio streaming

### Phase 3: Input (Planned)
- ⏳ Keyboard/mouse forwarding
- ⏳ Gamepad support
- ⏳ Touch input (future TVs)

### Phase 4: Optimization (Future)
- ⏳ Adaptive streaming
- ⏳ Latency reduction
- ⏳ Quality improvements
- ⏳ Multi-monitor support

### Phase 5: Security (Future)
- ⏳ Authentication
- ⏳ Encryption
- ⏳ Access control

## Testing Strategy

### Unit Testing
- Component-level tests
- Message parsing/formatting
- State management

### Integration Testing
- WebSocket communication
- Discovery protocol
- End-to-end message flow

### Performance Testing
- Latency measurement
- Bandwidth usage
- Frame rate stability

### Compatibility Testing
- Different TV models
- Various network conditions
- Multiple OS platforms

## Monitoring and Debugging

### Logging

- Server logs in PC Controller
- Console logs in Tizen app
- Network traffic monitoring

### Metrics

- Connection count
- Message throughput
- Latency measurements
- Error rates

## References

- [Electron Documentation](https://www.electronjs.org/docs)
- [Tizen Web App Guide](https://developer.samsung.com/smarttv/develop/web-application/guides.html)
- [WebSocket Protocol](https://tools.ietf.org/html/rfc6455)
- [WebRTC Specification](https://www.w3.org/TR/webrtc/)
