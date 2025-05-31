# GitHub Actions Deployment Setup Guide

## Required Secrets

Your GitHub repository needs the following secrets configured for the deployment workflow to work:

### Azure Service Principal Secrets
These are required for OIDC (OpenID Connect) authentication with Azure:

1. `AZUREAPPSERVICE_CLIENTID_04AC9A0E97AB43D990B2BB04CBA2EBA9`
   - The Client ID of your Azure Service Principal
   - Get this from your Azure AD App Registration

2. `AZUREAPPSERVICE_TENANTID_426505E5B8D047D49E23CD34400365EA`
   - Your Azure AD Tenant ID
   - Find this in Azure Portal > Azure Active Directory > Overview

3. `AZUREAPPSERVICE_SUBSCRIPTIONID_79BA3DE4A9FE47AB99A0E03642265D06`
   - Your Azure Subscription ID
   - Find this in Azure Portal > Subscriptions

## Setting Up Azure Service Principal

1. Create a service principal with contributor access:
```bash
az ad sp create-for-rbac --name "github-actions-cloud-resume" \
  --role contributor \
  --scopes /subscriptions/{subscription-id} \
  --sdk-auth
```

2. Configure federated credentials for GitHub Actions:
```bash
az ad app federated-credential create \
  --id {app-id} \
  --parameters @- <<EOF
{
  "name": "github-deploy-main",
  "issuer": "https://token.actions.githubusercontent.com",
  "subject": "repo:{your-github-username}/cloud-resume:ref:refs/heads/main",
  "description": "Deploy from main branch",
  "audiences": ["api://AzureADTokenExchange"]
}
EOF
```

## Workflow Features

The updated deployment workflow includes:

1. **Automatic deployment on push to main**
2. **Manual workflow dispatch option**
3. **Environment variables for easy configuration**
4. **Verification steps after each deployment**
5. **Error handling with helpful messages**
6. **Dependency caching for faster builds**
7. **Deployment summary with status checks**

## Troubleshooting

### Authentication Issues
- Verify all three secrets are correctly set in GitHub repository settings
- Check that federated credentials match your repository name and branch
- Ensure service principal has required permissions

### Storage Upload Failures
- Verify storage account name is correct
- Check that service principal has Storage Blob Data Contributor role
- Ensure $web container exists and is configured for static website hosting

### CDN Purge Issues
- CDN purge is non-blocking; failures won't stop deployment
- Verify CDN endpoint and profile names are correct
- Check service principal has CDN Contributor role

### Function Deployment Failures
- Ensure function app exists in Azure
- Verify Node.js version matches function app runtime
- Check that all dependencies are properly installed

## Testing the Workflow

1. Make a small change to your site
2. Commit and push to main branch
3. Go to GitHub Actions tab to monitor deployment
4. Check deployment summary for status

## Manual Deployment

To trigger deployment manually:
1. Go to Actions tab in GitHub
2. Select "Deploy Cloud Resume" workflow
3. Click "Run workflow" button
4. Select main branch and click "Run workflow"