#!/bin/bash

# Build script for Tizen TV App

echo "🎮 Game-on-TV Tizen Build Script"
echo "================================="
echo ""

# Check if Tizen CLI is available
if ! command -v tizen &> /dev/null; then
    echo "❌ Error: Tizen CLI not found"
    echo "Please install Tizen Studio from:"
    echo "https://developer.samsung.com/tizen"
    exit 1
fi

echo "✓ Tizen CLI found"
echo ""

# Navigate to tizen-tv directory
cd "$(dirname "$0")/tizen-tv"

echo "📁 Building web application..."
tizen build-web

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✓ Build successful"
echo ""

echo "📦 Packaging application..."
tizen package -t wgt -- .buildResult

if [ $? -ne 0 ]; then
    echo "❌ Packaging failed"
    exit 1
fi

echo "✓ Package created successfully"
echo ""

# Find the .wgt file
WGT_FILE=$(find .buildResult -name "*.wgt" | head -1)

if [ -z "$WGT_FILE" ]; then
    echo "❌ Could not find .wgt file"
    exit 1
fi

echo "✅ Build complete!"
echo ""
echo "Package location: $WGT_FILE"
echo ""
echo "Next steps:"
echo "1. Copy the .wgt file to a USB drive"
echo "2. Install on your Samsung TV, or"
echo "3. Use: tizen install -n $(basename "$WGT_FILE") -t YOUR_TV_IP"
echo ""
