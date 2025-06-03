# Cloud Resume Docker Development
# Author: Jason Slater

.PHONY: help build up down logs clean restart status shell

# Default target
help:
	@echo "🐳 Cloud Resume Docker Commands"
	@echo ""
	@echo "Development:"
	@echo "  make setup    - Initial setup and start services"
	@echo "  make up       - Start all services"
	@echo "  make down     - Stop all services"
	@echo "  make restart  - Restart all services"
	@echo "  make build    - Build Docker images"
	@echo ""
	@echo "Monitoring:"
	@echo "  make logs     - View all logs"
	@echo "  make status   - Show container status"
	@echo "  make health   - Check service health"
	@echo ""
	@echo "Maintenance:"
	@echo "  make clean    - Remove containers and images"
	@echo "  make shell    - Open shell in frontend container"
	@echo ""

# Initial setup
setup:
	@docker/scripts/dev-setup.sh

# Build images
build:
	@echo "🔨 Building Docker images..."
	@docker-compose build

# Start services
up:
	@echo "🚀 Starting services..."
	@docker-compose up -d

# Stop services
down:
	@echo "🛑 Stopping services..."
	@docker-compose down

# Restart services
restart:
	@echo "🔄 Restarting services..."
	@docker-compose restart

# View logs
logs:
	@echo "📋 Viewing logs..."
	@docker-compose logs -f

# Show container status
status:
	@echo "📊 Container Status:"
	@docker-compose ps

# Health check
health:
	@echo "🏥 Checking service health..."
	@echo "Frontend: $(shell curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health)"
	@echo "API: $(shell curl -s -o /dev/null -w "%{http_code}" http://localhost:7071/api/health)"

# Clean up
clean:
	@echo "🧹 Cleaning up..."
	@docker-compose down -v
	@docker system prune -f

# Open shell in frontend container
shell:
	@echo "🐚 Opening shell in frontend container..."
	@docker exec -it cloud-resume-frontend /bin/sh