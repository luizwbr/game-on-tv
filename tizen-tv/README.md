# Game-on-TV Tizen Application

This is the Samsung Tizen TV application for Game-on-TV. It allows you to stream and play PC games on your Samsung Smart TV.

## Requirements

- Samsung Tizen TV (2020 or newer)
- Tizen Studio 4.0 or later (for development)
- Local network connection (WiFi or Ethernet recommended)

## Features

- Automatic PC discovery on local network
- WebSocket-based communication
- TV remote control support
- Full HD and 4K streaming support
- Low-latency game streaming

## Installation

### For End Users

1. Download the `.wgt` package file
2. Install on your Samsung TV using one of these methods:
   - USB: Copy to USB drive and install via TV apps
   - Developer Mode: Enable developer mode and install via Tizen Studio

### For Developers

1. Install Tizen Studio
2. Enable Developer Mode on your Samsung TV
3. Build and install:

```bash
# Using Tizen CLI
tizen build-web
tizen package -t wgt
tizen install -n GameOnTV.wgt -t <TV_IP>
```

## TV Remote Controls

- **Arrow Keys**: Navigate menus
- **ENTER/OK**: Select/Confirm
- **RETURN**: Go back / Disconnect
- **INFO**: Show/Hide stream controls
- All other keys are forwarded to PC

## Configuration

The app will automatically discover PC controllers on your local network. Make sure:

1. PC Controller app is running
2. Both TV and PC are on the same network
3. No firewall is blocking port 8080

## Development

### Project Structure

```
tizen-tv/
├── config.xml          # Tizen app configuration
├── index.html          # Main HTML file
├── css/
│   └── style.css      # Styles
└── js/
    └── app.js         # Main application logic
```

### Testing

Test on Tizen emulator or real device using Tizen Studio.

## Troubleshooting

**Cannot find PC controller**
- Ensure PC Controller app is running
- Check both devices are on same network
- Try manual IP entry if discovery fails

**Stream quality issues**
- Use wired Ethernet connection
- Reduce resolution/FPS in PC Controller settings
- Check network bandwidth

**Input lag**
- Minimize WiFi interference
- Close other network applications
- Use 5GHz WiFi if available

## License

MIT License
