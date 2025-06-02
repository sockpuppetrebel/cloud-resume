#!/bin/bash

# Instant Preview - Opens site immediately in browser
# Perfect for theme changes

cd "$(dirname "$0")/../site"

# Kill any existing server
pkill -f "python.*8889" 2>/dev/null

# Start server on different port to avoid conflicts
if command -v python3 >/dev/null 2>&1; then
    python3 -m http.server 8889 >/dev/null 2>&1 &
else
    python -m SimpleHTTPServer 8889 >/dev/null 2>&1 &
fi

SERVER_PID=$!
sleep 1

# Open in browser
if command -v open >/dev/null 2>&1; then
    open "http://localhost:8889"
elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "http://localhost:8889"
else
    echo "Open http://localhost:8889 in your browser"
fi

echo "🚀 Instant preview started at http://localhost:8889"
echo "📱 Mobile view: Right-click → Inspect → Device Toggle"
echo "🔄 Changes show instantly on refresh"
echo ""
echo "Press Ctrl+C to stop"

# Cleanup on exit
trap "kill $SERVER_PID 2>/dev/null; exit" INT TERM

wait $SERVER_PID