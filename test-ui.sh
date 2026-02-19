#!/bin/bash

# Simple test server for PC Controller UI
# This allows testing the UI in a browser without Electron

echo "🎮 Game-on-TV PC Controller - Test Server"
echo "=========================================="
echo ""

cd "$(dirname "$0")/pc-controller/src"

echo "Starting HTTP server on port 3000..."
echo "Open http://localhost:3000 in your browser"
echo ""
echo "Note: This is for UI testing only."
echo "For full functionality, use: npm start"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start simple HTTP server
if command -v python3 &> /dev/null; then
    python3 -m http.server 3000
elif command -v python &> /dev/null; then
    python -m SimpleHTTPServer 3000
else
    echo "❌ Error: Python not found"
    echo "Please install Python or use 'npm start' instead"
    exit 1
fi
