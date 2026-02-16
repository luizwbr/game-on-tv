# Network Setup Guide

This guide helps you configure your network for optimal Game-on-TV performance.

## Network Requirements

### Minimum Requirements

- **Network Type**: WiFi 5 (802.11ac) or Ethernet
- **Bandwidth**: 20 Mbps available
- **Latency**: < 50ms between PC and TV
- **Connectivity**: Both devices on same local network (LAN)

### Recommended Setup

- **Network Type**: Gigabit Ethernet
- **Bandwidth**: 100 Mbps+ available
- **Latency**: < 20ms between PC and TV
- **Router**: Modern dual-band (2.4GHz + 5GHz) router

## Connection Types

### ⭐ Best: Ethernet (Recommended)

```
PC ──[Ethernet]──▶ Router ──[Ethernet]──▶ TV
```

**Advantages:**
- Lowest latency (1-5ms)
- Most stable connection
- Best for 4K streaming
- No interference

**Setup:**
1. Connect PC to router with Cat5e or Cat6 cable
2. Connect TV to router with Cat5e or Cat6 cable
3. Verify both show wired connection in network settings

### ✅ Good: 5GHz WiFi

```
PC ──[5GHz WiFi]──▶ Router ──[5GHz WiFi]──▶ TV
```

**Advantages:**
- No cables needed
- Good bandwidth
- Works for 1080p/2K streaming

**Setup:**
1. Connect both devices to 5GHz network
2. Ensure strong signal (3+ bars)
3. Position devices near router

**Tips:**
- Avoid obstacles between devices and router
- Keep distance < 30 feet if possible
- Minimize interference from other devices

### ⚠️ Acceptable: Mixed Connection

```
PC ──[Ethernet]──▶ Router ──[5GHz WiFi]──▶ TV
```

**Advantages:**
- PC has stable connection
- More flexible TV placement

**Setup:**
1. Connect PC via Ethernet
2. Connect TV via 5GHz WiFi
3. Ensure TV has strong WiFi signal

### ❌ Not Recommended: 2.4GHz WiFi

```
PC ──[2.4GHz WiFi]──▶ Router ──[2.4GHz WiFi]──▶ TV
```

**Issues:**
- High latency
- Limited bandwidth
- Many interference sources
- Poor for gaming

**Only use if:**
- No other option available
- Streaming at 1080p @ 30 FPS or lower
- Very strong signal strength

## Router Configuration

### Port Forwarding (Not Required)

Port forwarding is **NOT** needed since both devices are on the same LAN. However, you may need to configure your firewall.

### Firewall Configuration

**On PC:**
1. Allow incoming connections on port 8080
2. Allow outgoing WebSocket connections
3. Add Game-on-TV to firewall exceptions

**Windows Firewall:**
```powershell
netsh advfirewall firewall add rule name="Game-on-TV" dir=in action=allow protocol=TCP localport=8080
```

**macOS Firewall:**
System Preferences → Security & Privacy → Firewall → Firewall Options → Add "Electron" or "Game-on-TV"

**Linux (ufw):**
```bash
sudo ufw allow 8080/tcp
```

### Quality of Service (QoS)

Configure QoS on your router to prioritize Game-on-TV traffic:

1. Access router admin panel (usually http://192.168.1.1)
2. Find QoS or Traffic Priority settings
3. Prioritize:
   - Port 8080 (Game-on-TV)
   - PC's IP address
   - TV's IP address

### Static IP Addresses (Recommended)

Assign static IPs to prevent address changes:

**Option 1: Router DHCP Reservation**
1. Find PC and TV MAC addresses
2. In router, assign fixed IPs to those MACs
3. Example: PC = 192.168.1.100, TV = 192.168.1.101

**Option 2: Manual Static IP**

On PC (example):
- IP: 192.168.1.100
- Subnet: 255.255.255.0
- Gateway: 192.168.1.1
- DNS: 8.8.8.8, 8.8.4.4

On TV:
- Use TV's network settings to configure static IP
- Similar settings as PC but different IP (e.g., .101)

## Network Testing

### Test Connection Speed

**Between PC and Router:**
```bash
# Linux/Mac
ping -c 10 192.168.1.1

# Windows
ping -n 10 192.168.1.1
```

Look for: < 5ms average latency

**Between PC and TV:**
1. Find TV's IP address in TV network settings
2. Ping from PC:
```bash
ping [TV_IP_ADDRESS]
```

Look for: < 20ms average latency, 0% packet loss

### Test Bandwidth

**Using iperf3:**

On TV (if SSH access available) or another device:
```bash
iperf3 -s
```

On PC:
```bash
iperf3 -c [TV_IP_ADDRESS]
```

Look for: > 50 Mbps for 1080p, > 100 Mbps for 4K

### Network Diagnostic Commands

**Find PC's IP Address:**

Windows:
```cmd
ipconfig
```

Mac/Linux:
```bash
ifconfig
ip addr show
```

**Find TV's IP Address:**
- TV Settings → Network → Network Status
- Look for IP Address field

**Test DNS Resolution:**
```bash
nslookup google.com
```

**Check Open Ports:**

Windows:
```cmd
netstat -an | findstr 8080
```

Mac/Linux:
```bash
netstat -an | grep 8080
lsof -i :8080
```

## Troubleshooting Network Issues

### High Latency

**Symptoms:**
- Delayed input response
- Choppy video

**Solutions:**
1. Switch to Ethernet
2. Use 5GHz WiFi instead of 2.4GHz
3. Move devices closer to router
4. Reduce WiFi interference:
   - Move microwave away
   - Avoid other 2.4GHz devices
   - Change WiFi channel
5. Update router firmware

### Packet Loss

**Symptoms:**
- Video freezes
- Connection drops
- Stuttering

**Solutions:**
1. Check cables (if using Ethernet)
2. Improve WiFi signal strength
3. Restart router
4. Check for network congestion
5. Update network drivers

### Low Bandwidth

**Symptoms:**
- Poor video quality
- Constant buffering

**Solutions:**
1. Close bandwidth-heavy applications:
   - Downloads/uploads
   - Video streaming
   - Cloud backups
2. Disconnect other devices from network
3. Use Ethernet instead of WiFi
4. Upgrade internet plan (if needed)
5. Upgrade router

### Discovery Fails

**Symptoms:**
- TV can't find PC
- PC not showing in list

**Solutions:**
1. Verify both on same network:
   - Check SSID (WiFi name)
   - Check IP addresses are in same subnet
2. Check firewall settings
3. Restart router
4. Restart both apps
5. Try manual IP entry (if available)

## Network Optimization Tips

### 1. Dedicated Network (Advanced)

Create a separate network just for streaming:
- Use a second router
- Connect PC and TV to dedicated router
- No other devices on this network

### 2. Mesh Network (If Applicable)

If using mesh WiFi:
- Connect both devices to same mesh node
- Disable band steering
- Use wired backhaul between nodes

### 3. Router Placement

- Central location in home
- Elevated position
- Away from walls/metal objects
- Away from interference sources

### 4. Reduce Interference

**WiFi Interference Sources:**
- Microwaves
- Bluetooth devices
- Baby monitors
- Cordless phones
- Other WiFi networks

**Solutions:**
- Change WiFi channel (1, 6, or 11 for 2.4GHz)
- Use WiFi analyzer app to find clear channel
- Switch to 5GHz when possible

### 5. Update Everything

Keep updated:
- Router firmware
- PC network drivers
- TV firmware
- Game-on-TV software

## Example Network Configurations

### Home Setup (Single Router)

```
Internet ──▶ Router
              ├──[Ethernet]──▶ Gaming PC (192.168.1.100)
              ├──[5GHz WiFi]──▶ Samsung TV (192.168.1.101)
              └──[2.4GHz WiFi]──▶ Other devices
```

### Optimal Setup (Dedicated Network)

```
Internet ──▶ Main Router ──▶ Other devices
                │
                └──[Ethernet]──▶ Gaming Router
                                  ├──[Ethernet]──▶ Gaming PC
                                  └──[Ethernet]──▶ Samsung TV
```

### Apartment Setup (WiFi Only)

```
Internet ──▶ Router
              ├──[Ethernet]──▶ Gaming PC
              └──[5GHz WiFi]──▶ Samsung TV
                  (position TV close to router)
```

## Performance Expectations

| Setup | Latency | Max Resolution | Reliability |
|-------|---------|----------------|-------------|
| Both Ethernet | 1-5ms | 4K @ 60+ FPS | ⭐⭐⭐⭐⭐ |
| PC Ethernet, TV 5GHz | 10-20ms | 2K @ 60 FPS | ⭐⭐⭐⭐ |
| Both 5GHz WiFi | 15-30ms | 1080p @ 60 FPS | ⭐⭐⭐ |
| Mixed 5GHz/2.4GHz | 30-50ms | 1080p @ 30 FPS | ⭐⭐ |
| Both 2.4GHz WiFi | 50-100ms | 720p @ 30 FPS | ⭐ |

## Getting Help

If you're still experiencing network issues:
1. Check the FAQ.md
2. Run network diagnostics
3. Open a GitHub issue with:
   - Network setup description
   - Test results (ping, bandwidth)
   - Error messages
   - Router model

---

**Need more help?** See [QUICKSTART.md](QUICKSTART.md) and [FAQ.md](FAQ.md)
