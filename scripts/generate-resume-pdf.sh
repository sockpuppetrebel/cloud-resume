#!/bin/bash

# Script to generate PDF from resume.html
# Requires: Chrome/Chromium or wkhtmltopdf

echo "Generating resume PDF..."

# Check if we're in the right directory
if [ ! -f "site/resume.html" ]; then
    echo "Error: site/resume.html not found. Run this from the project root."
    exit 1
fi

# Option 1: Using Chrome/Chromium (if available)
if command -v google-chrome &> /dev/null; then
    echo "Using Chrome to generate PDF..."
    google-chrome --headless --disable-gpu --print-to-pdf=site/jason-slater-resume.pdf site/resume.html
elif command -v chromium &> /dev/null; then
    echo "Using Chromium to generate PDF..."
    chromium --headless --disable-gpu --print-to-pdf=site/jason-slater-resume.pdf site/resume.html
else
    echo "Chrome/Chromium not found."
    echo "To generate PDF, you can:"
    echo "1. Open site/resume.html in your browser"
    echo "2. Press Ctrl+P (or Cmd+P on Mac)"
    echo "3. Save as PDF to site/jason-slater-resume.pdf"
fi

echo "Done! PDF should be at site/jason-slater-resume.pdf"