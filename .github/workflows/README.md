# GitHub Actions Workflows

## Active Workflows

### 1. Production Deployment (`azure-static-web-apps.yml`)
- **Triggers**: Push to `main` branch, PRs to `main`
- **Deploys**: Both frontend (`/site`) and API (`/api`) to production
- **URL**: https://slater.cloud

### 2. Staging Deployment (`azure-static-web-apps-staging-fast.yml`)
- **Triggers**: Push to `staging` branch, manual workflow dispatch
- **Deploys**: Both frontend (`/site`) and API (`/api`) to staging
- **URL**: https://proud-smoke-0fa3b7e1e.1.azurestaticapps.net
- **Note**: Fast deployment without extensive tests for quick iteration

### 3. Mobile Testing (`mobile-testing.yml`)
- **Triggers**: PRs to main/staging, manual workflow dispatch
- **Purpose**: Mobile compatibility testing with Lighthouse

### 4. Test Deployment (`test-deployment.yml`)
- **Triggers**: After main deployment, manual workflow dispatch
- **Purpose**: Post-deployment validation and performance testing

## Required Secrets

- `AZURE_STATIC_WEB_APPS_API_TOKEN`: Production deployment token
- `AZURE_STATIC_WEB_APPS_API_TOKEN_PROUD_SMOKE_0FA3B7E1E`: Staging deployment token

## Deployment Flow

1. Work on feature branch
2. Push to `staging` → Triggers staging deployment
3. Test on staging URL
4. Create PR to `main` → Triggers tests
5. Merge to `main` → Triggers production deployment

## Important Notes

- Both staging and production now deploy API functions
- Staging uses the same deployment mechanism as production
- Path filters ensure only relevant changes trigger deployments