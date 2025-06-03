# Multi-stage build for cloud resume frontend
FROM nginx:alpine as production

# Copy static files
COPY site/ /usr/share/nginx/html/

# Copy custom nginx config for SPA routing
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf

# Add custom index for Docker development
COPY docker/frontend/index.html /usr/share/nginx/html/docker-status.html

# Set proper permissions
RUN chmod -R 755 /usr/share/nginx/html

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Expose port
EXPOSE 80

# Add development user
RUN addgroup -g 1001 -S appuser && \
    adduser -S appuser -G appuser

# Labels for identification
LABEL maintainer="Jason Slater <jasslater11@gmail.com>"
LABEL description="Cloud Resume Frontend - Dockerized"
LABEL version="1.0"

CMD ["nginx", "-g", "daemon off;"]