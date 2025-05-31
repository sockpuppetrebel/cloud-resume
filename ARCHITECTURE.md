# Cloud Resume Architecture

## Overview
This document outlines the architecture and deployment pipeline for my cloud resume project hosted at slater.cloud.

## Infrastructure Components

### Storage Accounts
- **Production**: `jtsresumehosting` - Hosts the production website files
- **Staging**: `jtsresumehostingstg` - Hosts the staging environment for testing

### CDN Configuration
- **Endpoint**: `slatercloud.azureedge.net`
- **Custom Domain**: slater.cloud (root and www)
- **SSL/TLS**: 
  - Root domain uses Cloudflare SSL with proxy enabled
  - WWW subdomain uses Azure CDN managed certificates

### Azure Functions
- **Function App**: `slaterbot`
- **Purpose**: Powers the GPT chatbot functionality
- **Endpoint**: `slaterbot.azurewebsites.net`

## Deployment Pipeline

### Production (main branch)
1. Push code to `main` branch
2. GitHub Actions workflow triggers automatically
3. Static site files deployed to `jtsresumehosting` storage account
4. Azure Function code deployed to `slaterbot` function app
5. CDN cache automatically purged
6. Changes visible at https://slater.cloud

### Staging (staging branch)
1. Push code to `staging` branch
2. GitHub Actions workflow deploys to `jtsresumehostingstg`
3. Changes immediately visible at https://jtsresumehostingstg.z22.web.core.windows.net/
4. No CDN caching = instant updates for testing

## Development Workflow

### Feature Development
1. Create feature branch from `staging`
2. Develop and test locally
3. Push to feature branch and create PR to `staging`
4. Merge to `staging` for testing in staging environment
5. Once validated, merge `staging` to `main` for production deployment

### Branch Strategy
- `main` - Production branch, auto-deploys to slater.cloud
- `staging` - Testing branch, auto-deploys to staging URL
- `feature/*` - Feature branches for development

## GitHub Actions Workflows

### Production Deployment (.github/workflows/deploy.yml)
- Triggered on push to `main`
- Deploys static site to Azure Storage
- Deploys Azure Function
- Purges CDN cache for immediate updates

### Staging Deployment (.github/workflows/deploy-staging.yml)
- Triggered on push to `staging`
- Deploys static site to staging storage account
- No CDN involved for instant updates

## DNS and Domain Architecture

### Domain Registration
- **Registrar**: Cloudflare (or your registrar if different)
- **Nameservers**: Cloudflare DNS

### DNS Configuration (Cloudflare)

| Domain | Type | Target | Proxy Status | Purpose |
|--------|------|--------|--------------|----------|
| slater.cloud | CNAME | slatercloud.azureedge.net | Proxied | Root domain with Cloudflare SSL |
| www.slater.cloud | CNAME | slatercloud.azureedge.net | DNS Only | Direct to Azure CDN |

### Request Flow Diagram

#### Root Domain (slater.cloud)
```
User → https://slater.cloud
  ↓
Cloudflare DNS (CNAME lookup)
  ↓
Cloudflare Proxy (SSL termination)
  ↓
Azure CDN (slatercloud.azureedge.net)
  ↓
Azure Storage ($web container in jtsresumehosting)
  ↓
index.html served to user
```

#### WWW Subdomain (www.slater.cloud)
```
User → https://www.slater.cloud
  ↓
Cloudflare DNS (CNAME lookup)
  ↓
Direct to Azure CDN (slatercloud.azureedge.net)
  ↓
Azure Storage ($web container in jtsresumehosting)
  ↓
index.html served to user
```

### Cloudflare Settings
- **SSL/TLS Encryption Mode**: Full
- **Always Use HTTPS**: Enabled
- **Automatic HTTPS Rewrites**: Enabled
- **HSTS**: Enabled

### URL Routing Rules
1. **HTTP to HTTPS Redirect**: All HTTP traffic automatically redirected to HTTPS
2. **Root to CDN**: slater.cloud → Cloudflare Proxy → Azure CDN
3. **WWW to CDN**: www.slater.cloud → Direct to Azure CDN
4. **Static Assets**: All CSS, JS, and images served from Azure CDN with cache headers

### SSL Certificate Management
- **Root Domain (slater.cloud)**: Cloudflare Universal SSL Certificate
- **WWW Subdomain**: Azure CDN Managed Certificate (DigiCert)
- **Backend Connection**: Cloudflare to Azure CDN uses "Full" SSL mode

## Environment URLs

- **Production**: https://slater.cloud
- **Staging**: https://jtsresumehostingstg.z22.web.core.windows.net/
- **CDN Endpoint**: https://slatercloud.azureedge.net
- **Function API**: https://slaterbot.azurewebsites.net/api/chathandler

## Notes
- CDN caching can cause delays in production updates; cache purge is automated
- Staging environment bypasses CDN for immediate feedback
- All sensitive configuration stored in GitHub Secrets
- Azure authentication uses service principal with OIDC