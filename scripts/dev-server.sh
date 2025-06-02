#!/bin/bash

# Fast Local Development Server
# Instant feedback for theme changes

echo "======================================="
echo "Starting Fast Development Server"
echo "======================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Kill any existing servers
pkill -f "python.*http.server" 2>/dev/null
pkill -f "python.*SimpleHTTPServer" 2>/dev/null

# Start server in background
cd site
echo -e "${YELLOW}Starting local server...${NC}"

# Try Python 3 first, then Python 2
if command -v python3 >/dev/null 2>&1; then
    python3 -m http.server 8888 >/dev/null 2>&1 &
    SERVER_PID=$!
    PYTHON_CMD="python3 -m http.server 8888"
elif command -v python >/dev/null 2>&1; then
    python -m SimpleHTTPServer 8888 >/dev/null 2>&1 &
    SERVER_PID=$!
    PYTHON_CMD="python -m SimpleHTTPServer 8888"
else
    echo "Python not found. Install Python to use local server."
    exit 1
fi

# Wait a moment for server to start
sleep 2

# Check if server started successfully
if kill -0 $SERVER_PID 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Local server running at:"
    echo -e "  ${GREEN}http://localhost:8888${NC}"
    echo ""
    
    # Get local IP for mobile testing
    if command -v ifconfig >/dev/null 2>&1; then
        LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
    elif command -v ip >/dev/null 2>&1; then
        LOCAL_IP=$(ip route get 1 | awk '{print $NF;exit}')
    fi
    
    if [ -n "$LOCAL_IP" ]; then
        echo -e "${YELLOW}Mobile/Network Access:${NC}"
        echo -e "  http://$LOCAL_IP:8888"
        echo ""
    fi
    
    echo -e "${YELLOW}Development Tips:${NC}"
    echo "• Edit files and refresh browser for instant updates"
    echo "• Use Chrome DevTools (F12) for mobile testing"
    echo "• Press Ctrl+C to stop server"
    echo ""
    echo "======================================="
    
    # Function to handle cleanup
    cleanup() {
        echo ""
        echo "Stopping development server..."
        kill $SERVER_PID 2>/dev/null
        exit 0
    }
    
    # Set trap for cleanup on script exit
    trap cleanup INT TERM
    
    # Keep script running and show live logs
    echo "Watching for requests (Ctrl+C to stop):"
    wait $SERVER_PID
    
else
    echo "Failed to start server"
    exit 1
fi