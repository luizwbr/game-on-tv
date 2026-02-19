# Quick Start Guide

This guide will help you get Game-on-TV up and running quickly.

## Prerequisites

- **For PC:**
  - Node.js 16 or later installed
  - Windows, macOS, or Linux
  - Connected to local network

- **For Samsung TV:**
  - Samsung Smart TV (2020 or newer) with Tizen OS
  - Connected to the same local network as your PC

## Step 1: Setup PC Controller

1. Navigate to the PC controller directory:
   ```bash
   cd pc-controller
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application:
   ```bash
   npm start
   ```

4. The PC Controller window will open. Note the IP addresses shown - you'll need these for the TV app.

## Step 2: Install Tizen TV App

### Option A: Pre-built Package (Recommended for Users)

1. Download the `.wgt` package file (when available)
2. Copy to a USB drive
3. On your Samsung TV:
   - Insert the USB drive
   - Open the TV's Apps menu
   - Navigate to "My Apps" or similar
   - Install from USB

### Option B: Build and Install (For Developers)

1. Install Tizen Studio from: https://developer.samsung.com/tizen

2. Enable Developer Mode on your TV:
   - Go to Apps
   - Press 1-2-3-4-5 on your remote
   - Enable Developer Mode
   - Enter your PC's IP address

3. Build and install:
   ```bash
   cd tizen-tv
   tizen build-web
   tizen package -t wgt
   tizen install -n GameOnTV.wgt -t YOUR_TV_IP
   ```

## Step 3: Connect and Stream

1. **On your TV:** Open the Game-on-TV app

2. **Discover PC:** The app will automatically scan for PCs running the controller app

3. **Select PC:** Use arrow keys to select your PC from the list and press ENTER/OK

4. **Start Streaming:** The connection will be established and streaming will begin

5. **On your PC:** Click "Start Streaming" in the PC Controller app

## Using the TV Remote

- **Arrow Keys:** Navigate menus
- **ENTER/OK:** Select/Confirm
- **RETURN:** Go back or disconnect
- **INFO:** Show/hide stream controls
- **All other keys:** Forwarded to PC as input

## Troubleshooting

### PC not showing in TV app

1. Check that both devices are on the same network
2. Verify PC Controller is running
3. Check firewall isn't blocking port 8080
4. Try manually entering PC's IP in TV app (if feature available)

### Poor streaming quality

1. Use wired Ethernet for both PC and TV if possible
2. Reduce resolution in PC Controller settings
3. Lower FPS setting (try 30 FPS first)
4. Close other network-intensive applications

### Connection drops

1. Check network stability
2. Move closer to router if using WiFi
3. Switch to 5GHz WiFi band if available
4. Consider using wired Ethernet

### High input lag

1. Use wired Ethernet connection
2. Reduce resolution/FPS
3. Close unnecessary applications on PC
4. Check for network congestion

## Tips for Best Experience

1. **Network:**
   - Use Ethernet cable for both devices (highly recommended)
   - If using WiFi, use 5GHz band
   - Ensure good signal strength

2. **Settings:**
   - Start with 1080p @ 60 FPS
   - Increase to 4K only if network supports it
   - Monitor latency in TV app controls panel

3. **Gaming:**
   - Works best for turn-based or casual games
   - Action games need excellent network conditions
   - Test with different game types

## Next Steps

- Read the full documentation in README.md
- Configure advanced settings in PC Controller
- Explore the controls panel on TV (press INFO button)

## Getting Help

If you encounter issues:
- Check the troubleshooting sections
- Review logs in PC Controller app
- Open an issue on GitHub
- See CONTRIBUTING.md for community support

---

Enjoy gaming on your TV! 🎮📺
