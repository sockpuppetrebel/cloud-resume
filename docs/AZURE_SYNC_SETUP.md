# Azure Learning Timeline Sync Setup

This document explains how to set up automatic syncing of the learning timeline to Azure Blob Storage.

## Prerequisites

1. Azure Storage Account (already set up: `jslaterdevjournal`)
2. GitHub repository secrets configured
3. PowerShell scripts in pwsh_honeypot repo

## Setting Up GitHub Secrets

You need to add `AZURE_CREDENTIALS` secret to your cloud-resume repository:

1. Create an Azure Service Principal:
```bash
az ad sp create-for-rbac --name "github-learning-sync" \
  --role "Storage Blob Data Contributor" \
  --scopes /subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.Storage/storageAccounts/jslaterdevjournal \
  --sdk-auth
```

2. Copy the JSON output (it looks like this):
```json
{
  "clientId": "xxx",
  "clientSecret": "xxx",
  "subscriptionId": "xxx",
  "tenantId": "xxx"
}
```

3. In GitHub:
   - Go to Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `AZURE_CREDENTIALS`
   - Value: Paste the JSON from step 2

## How It Works

1. **Automatic Trigger**: When you push changes to `site/index.html` with "learning" in the commit message
2. **Manual Trigger**: Use "Run workflow" button in GitHub Actions tab
3. **Process**:
   - Checks out both repositories
   - Extracts learning items from HTML
   - Converts to structured JSON
   - Uploads to Azure Blob Storage
   - Updates the main index.json

## Local Testing

Run manually from pwsh_honeypot directory:
```powershell
./scripts/azure/Update-CloudResumeLearning.ps1 -UpdateMainIndex
```

## Viewing Results

- **Timeline JSON**: https://jslaterdevjournal.blob.core.windows.net/claude-development-journal/learning-timeline/timeline.json
- **Main Index**: https://jslaterdevjournal.blob.core.windows.net/claude-development-journal/index.json

## Commit Message Examples

These will trigger auto-sync:
- "Add new learning item about Docker"
- "Update learning timeline with Azure lesson"
- "Fix typo in learning section"

These won't trigger sync:
- "Update resume"
- "Fix CSS styling"
- "Update README"

## Troubleshooting

1. Check GitHub Actions tab for workflow runs
2. Download sync-log artifact for debugging
3. Verify Azure credentials are valid
4. Ensure both repositories are accessible