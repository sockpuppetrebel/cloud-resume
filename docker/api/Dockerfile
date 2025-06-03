# Azure Functions compatible Node.js container
FROM mcr.microsoft.com/azure-functions/node:4-node18

# Set working directory
WORKDIR /home/site/wwwroot

# Copy package files first for better caching
COPY api/package*.json ./

# Install dependencies
RUN npm install

# Copy API source code
COPY api/ ./

# Install Azure Functions Core Tools for development
RUN npm install -g azure-functions-core-tools@4 --unsafe-perm true

# Create development user
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Set proper permissions
RUN chown -R appuser:appuser /home/site/wwwroot

# Health check endpoint
COPY docker/api/health.js ./health/

# Add environment variables for development
ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true \
    NODE_ENV=development

# Expose Azure Functions port
EXPOSE 7071

# Labels
LABEL maintainer="Jason Slater <jasslater11@gmail.com>"
LABEL description="Cloud Resume API - Azure Functions Development"
LABEL version="1.0"

# Switch to non-root user
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:7071/api/health || exit 1

# Start Azure Functions host
CMD ["func", "host", "start", "--port", "7071", "--cors", "*"]