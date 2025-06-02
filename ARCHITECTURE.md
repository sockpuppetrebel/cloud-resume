# Cloud Resume Architecture

## Current Setup

### Production Environment
- **URL**: https://slater.cloud
- **Hosting**: Azure Static Web Apps
- **Frontend**: /site directory
- **API**: /api directory (managed by Azure SWA)
- **Deployment**: Automatic via GitHub Actions on push to main

### Staging Environment  
- **URL**: https://proud-smoke-0fa3b7e1e.6.azurestaticapps.net
- **Hosting**: Azure Static Web Apps (same instance as production)
- **Frontend**: /site directory
- **API**: Shares production API endpoints
- **Deployment**: Automatic via GitHub Actions on push to staging

### Unused Resources
- **Azure Function App**: slaterbot.azurewebsites.net (not actively deployed)

## Problems with Current Architecture

1. **No API isolation** - Staging and production share the same API
2. **No testing gates** - Code can be pushed directly to production
3. **Confusing resource setup** - Standalone Function App exists but isn't used
4. **Limited staging capabilities** - Can't test API changes in isolation

## Recommended Architecture

### Development Workflow
1. **Local Development** → Test locally with dev server
2. **Feature Branch** → Create PR to staging
3. **Staging** → Deploy and test both frontend + API
4. **Production** → Merge staging to main after testing

### Environment Separation
```
Production (main branch)
├── Frontend: https://slater.cloud
├── API: https://slater.cloud/api/*
└── Resources: Production Azure Static Web App

Staging (staging branch)  
├── Frontend: https://[staging-url].azurestaticapps.net
├── API: https://[staging-url].azurestaticapps.net/api/*
└── Resources: Separate Azure Static Web App instance
```

### Deployment Pipeline
1. Push to staging → Deploy to staging environment
2. Run automated tests on staging
3. Manual approval or PR review
4. Merge to main → Deploy to production

## Implementation Steps

1. **Create separate Azure Static Web App for staging**
   - This ensures complete isolation
   - Allows testing API changes safely

2. **Update GitHub workflows**
   - Staging workflow deploys to staging SWA
   - Production workflow includes test validation

3. **Add environment variables**
   - Separate API keys for staging/production
   - Environment-specific configurations

4. **Implement testing gates**
   - API endpoint tests
   - Frontend functionality tests
   - Performance benchmarks

## Benefits

- **Safe testing** - API changes tested in isolation
- **Faster iteration** - Deploy to staging without affecting production
- **Better reliability** - Tests catch issues before production
- **Clear separation** - No confusion about which resources are used