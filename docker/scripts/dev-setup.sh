#!/bin/bash

# Cloud Resume Docker Development Setup
# Author: Jason Slater

echo "🐳 Setting up Cloud Resume Docker development environment..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker Desktop.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker is running${NC}"

# Build and start services
echo -e "${BLUE}🔨 Building Docker images...${NC}"
docker-compose build

echo -e "${BLUE}🚀 Starting services...${NC}"
docker-compose up -d

# Wait for services to be ready
echo -e "${YELLOW}⏳ Waiting for services to start...${NC}"
sleep 10

# Check service health
echo -e "${BLUE}🏥 Checking service health...${NC}"

# Check frontend
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend service is healthy${NC}"
else
    echo -e "${RED}❌ Frontend service is not responding${NC}"
fi

# Check API
if curl -f http://localhost:7071/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ API service is healthy${NC}"
else
    echo -e "${YELLOW}⚠️  API service may still be starting...${NC}"
fi

echo -e "${GREEN}"
echo "🎉 Development environment is ready!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 API: http://localhost:7071"
echo "📊 Docker Status: http://localhost:3000/docker-status"
echo ""
echo "🛠️  Useful commands:"
echo "  docker-compose logs -f          # View all logs"
echo "  docker-compose restart frontend # Restart frontend"
echo "  docker-compose down             # Stop all services"
echo -e "${NC}"