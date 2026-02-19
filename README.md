# 🎮 Game-on-TV

Stream PC games to your Samsung Tizen OS Smart TV over local network - a free and open-source solution for playing PC games on your 4K smart TV.

## 🌟 Overview

Game-on-TV is an open-source project that solves the problem of not being able to play PC games on Samsung Smart TVs. It consists of two applications that work together to enable game streaming over your local network:

1. **PC Controller** - Desktop application (Windows/macOS/Linux) that captures and streams games
2. **Tizen TV App** - Smart TV application that receives and displays the game stream

### Why Game-on-TV?

- ✅ **Open Source** - Free and fully open-source solution
- ✅ **Local Network** - No cloud dependency, works entirely on your LAN
- ✅ **4K Support** - Stream in Full HD, 2K, or 4K resolution
- ✅ **Low Latency** - Optimized for minimal input lag
- ✅ **Samsung Tizen** - Specifically designed for Samsung Smart TVs

## 🚀 Quick Start

### 1. Install PC Controller

```bash
cd pc-controller
npm install
npm start
```

### 2. Install Tizen TV App

See [tizen-tv/README.md](tizen-tv/README.md) for installation instructions.

### 3. Connect and Play

1. Start the PC Controller application on your computer
2. Open the Game-on-TV app on your Samsung TV
3. The TV will automatically discover your PC
4. Select your PC and start streaming!

## 📋 Requirements

### PC Controller
- Node.js 16 or later
- Windows, macOS, or Linux
- Local network connection

### Tizen TV App
- Samsung Smart TV (2020 or newer with Tizen OS)
- Local network connection (Ethernet recommended)

## 🏗️ Architecture

```
┌──────────────────┐         Local Network        ┌──────────────────┐
│                  │                               │                  │
│  PC Controller   │◄────── WebSocket ────────────►│   Tizen TV App   │
│                  │                               │                  │
│  - Screen Cap    │         Port 8080             │  - Video Player  │
│  - Input Recv    │                               │  - Input Send    │
│  - WebSocket     │                               │  - Discovery     │
│                  │                               │                  │
└──────────────────┘                               └──────────────────┘
```

## 📚 Documentation

- [PC Controller Documentation](pc-controller/README.md)
- [Tizen TV App Documentation](tizen-tv/README.md)

## 🎯 Features

### Current Features
- ✅ WebSocket-based communication
- ✅ Automatic PC discovery
- ✅ Client connection management
- ✅ Resolution configuration (1080p/2K/4K)
- ✅ FPS configuration (30/60/120)
- ✅ TV remote control support

### Planned Features
- 🔄 WebRTC video streaming
- 🔄 Screen capture integration
- 🔄 Keyboard/mouse/gamepad input forwarding
- 🔄 Audio streaming
- 🔄 Encryption for secure streaming
- 🔄 Multiple monitor support

## 🛠️ Development

### Prerequisites
- Node.js 16+
- Tizen Studio (for TV app development)
- Git

### Building from Source

**PC Controller:**
```bash
cd pc-controller
npm install
npm run build
```

**Tizen TV App:**
```bash
cd tizen-tv
tizen build-web
tizen package -t wgt
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

### Development Setup
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

This project was created to address the lack of open-source solutions for streaming PC games to Samsung Tizen OS Smart TVs.

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the documentation in each application's README
- Review the troubleshooting sections

## 🌐 Network Configuration

For optimal performance:
- Use wired Ethernet connection for both PC and TV
- Ensure both devices are on the same local network
- Configure your firewall to allow port 8080
- Use 5GHz WiFi if Ethernet is not available

---

**Note:** This project is in active development. Some features are still being implemented. Check the roadmap in each component's README for details.