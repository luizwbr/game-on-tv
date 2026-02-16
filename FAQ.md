# Frequently Asked Questions (FAQ)

## General Questions

### What is Game-on-TV?

Game-on-TV is an open-source solution that allows you to stream PC games to your Samsung Smart TV (Tizen OS) over your local network. It's designed to solve the problem of not being able to play PC games on smart TVs despite having Bluetooth, WiFi, and 4K capabilities.

### Is it really free and open source?

Yes! Game-on-TV is 100% free and open source, licensed under the MIT License. There are no hidden fees, subscriptions, or premium features.

### How is this different from commercial solutions?

- **Open Source**: Full transparency, you can see and modify the code
- **Local Network**: Everything runs on your LAN, no cloud dependency
- **Free**: No subscription fees or one-time purchases
- **Privacy**: Your data never leaves your network
- **Community-Driven**: Improvements come from the community

## Compatibility

### Which Samsung TVs are supported?

Samsung Smart TVs from 2020 or newer with Tizen OS. The app requires Tizen 6.0 or later.

### Which operating systems are supported for the PC Controller?

The PC Controller runs on:
- Windows 10/11
- macOS 10.14 or later
- Linux (Ubuntu, Fedora, etc.)

### Will this work with other TV brands?

Currently, only Samsung Tizen TVs are supported. Support for other platforms (LG webOS, Android TV) could be added in the future.

## Setup and Installation

### Do I need to install anything on my TV?

Yes, you need to install the Game-on-TV Tizen app on your Samsung TV. See the [Quick Start Guide](QUICKSTART.md) for instructions.

### How do I get the PC Controller app?

Download and build from source:
```bash
cd pc-controller
npm install
npm start
```

Pre-built releases may be available in the future.

### Can I use WiFi or do I need Ethernet?

WiFi works, but Ethernet is strongly recommended for both the PC and TV for best performance. If using WiFi:
- Use 5GHz band if available
- Ensure strong signal strength
- Close other network applications

### Do I need to open ports on my firewall?

You need to allow port 8080 (TCP) for the PC Controller. Most personal firewalls will prompt you when you first run the app.

## Performance

### What resolution and frame rate can I expect?

This depends on your network:
- **1080p @ 60 FPS**: Works well on most networks
- **2K @ 60 FPS**: Requires good WiFi or Ethernet
- **4K @ 60 FPS**: Requires excellent network (Ethernet recommended)

### Why is there input lag?

Input lag can be caused by:
- Weak WiFi signal
- Network congestion
- High resolution/FPS settings
- Distance from router

**Solutions:**
- Use Ethernet connection
- Reduce resolution/FPS
- Close other network applications
- Move closer to router

### Can I stream at 120 FPS?

The option is available, but it requires:
- Excellent network (Gigabit Ethernet ideal)
- Powerful PC for encoding
- TV with 120Hz display support

### Why is the stream quality poor?

Try these steps:
1. Check network bandwidth
2. Lower resolution/FPS settings
3. Use wired connection
4. Check for network interference
5. Close bandwidth-heavy applications

## Usage

### How many TVs can I stream to simultaneously?

Currently, one PC can stream to multiple TVs simultaneously (broadcast mode), but all TVs will see the same content.

### Can multiple people play different games?

No, the current implementation streams one PC screen to all connected TVs. Multi-session support is not yet implemented.

### Does this work over the internet?

No, Game-on-TV is designed for local network use only. It requires both the PC and TV to be on the same LAN.

### Can I use a gamepad/controller?

Input forwarding from TV remote to PC is implemented. Gamepad support for the TV is planned for future releases. You can still use a gamepad connected directly to your PC.

### Does audio stream too?

Audio streaming is planned but not yet implemented in the current version.

## Troubleshooting

### The TV can't find my PC

**Check:**
1. Both devices are on the same network
2. PC Controller app is running
3. Firewall isn't blocking port 8080
4. Try restarting both apps
5. Check if PC's IP is in a common subnet (192.168.x.x, 10.0.x.x)

### Connection keeps dropping

**Possible causes:**
1. Weak WiFi signal
2. Network congestion
3. Router issues
4. Insufficient bandwidth

**Solutions:**
- Use Ethernet
- Restart router
- Check for firmware updates
- Reduce stream quality

### I get "Connection Error" on the TV

1. Verify PC Controller is running
2. Check network connectivity
3. Ensure no firewall is blocking
4. Try manually entering PC's IP (if supported)
5. Check PC Controller logs for errors

### The stream is very choppy

1. Lower resolution (try 1080p first)
2. Reduce FPS (try 30 FPS)
3. Close other applications
4. Check network bandwidth
5. Use wired connection

### Input doesn't work

Input forwarding is in the current implementation but some features may be limited. Check:
1. Connection is active
2. Stream is running
3. Check PC Controller logs
4. Restart the stream

## Development

### How can I contribute?

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Where can I report bugs?

Open an issue on the GitHub repository with:
- Clear description of the problem
- Steps to reproduce
- System information
- Logs if available

### Is there a roadmap?

Yes! Check the README and ARCHITECTURE.md for the development roadmap.

### Can I add features?

Absolutely! Fork the repository, make your changes, and submit a pull request.

## Technical

### What protocol does it use?

WebSocket for signaling and control, with plans to use WebRTC for media streaming.

### Why isn't WebRTC fully implemented yet?

WebRTC implementation is complex and is being developed incrementally. The current version establishes the foundation for full WebRTC support.

### Can I use this code for my own project?

Yes! The MIT License allows you to use, modify, and distribute the code. See [LICENSE](LICENSE) for details.

### What's the network bandwidth requirement?

Approximate bandwidth needed:
- 1080p @ 30 FPS: ~10 Mbps
- 1080p @ 60 FPS: ~20 Mbps
- 2K @ 60 FPS: ~35 Mbps
- 4K @ 60 FPS: ~50-60 Mbps

### Is the connection encrypted?

Currently, no. The connection uses plain WebSocket (ws://). Encryption (wss://) is planned for future releases.

## Future Features

### When will [feature X] be available?

Check the roadmap in ARCHITECTURE.md for planned features and timelines.

### Will you support [my TV brand]?

Support for other TV platforms is possible in the future but depends on community interest and contributions.

### Can you add cloud streaming?

The focus is on local network streaming for privacy and performance. Cloud relay might be considered for remote access scenarios.

### Will there be a mobile app?

A mobile app for control/monitoring could be added in the future, but it's not currently on the roadmap.

## Getting Help

### Where can I get help?

1. Check this FAQ
2. Read the documentation (README, QUICKSTART, ARCHITECTURE)
3. Search existing GitHub issues
4. Open a new GitHub issue
5. Join community discussions (if available)

### How do I update to the latest version?

```bash
cd game-on-tv
git pull
cd pc-controller
npm install
npm start
```

For the TV app, rebuild and reinstall the .wgt package.

---

**Don't see your question here?** Open an issue on GitHub!
