# Deployment Guide - CRITICAL RULES

## Architecture Overview

We use **Azure Static Web Apps** for EVERYTHING. No separate Function Apps.

- **Production**: https://slater.cloud (Azure SWA: slater-cloud-swa)
- **Staging**: https://proud-smoke-*.azurestaticapps.net (Azure SWA: slater-cloud-staging)

## GOLDEN RULES - NEVER BREAK THESE

### 1. API Endpoints
- **ALWAYS use relative URLs**: `/api/chathandler`, `/api/uptime`
- **NEVER use**: `https://slaterbot.azurewebsites.net/*`
- The `/api/*` routes are automatically handled by Azure Static Web Apps

### 2. Environment Variables
- **GitHub Secrets**: Used during deployment
  - `OPENAI_API_KEY` - Add to GitHub Secrets for CI/CD
- **Azure Configuration**: Used at runtime
  - Go to each Static Web App → Configuration → Add `OPENAI_API_KEY`

### 3. Deployment Flow
```
1. Work on feature branch
2. Test locally: npm start or python -m http.server
3. Push to staging branch → Auto-deploys to staging
4. Test on staging URL
5. Merge to main → Auto-deploys to production
```

### 4. Adding New API Functions
1. Create folder: `/api/functionname/`
2. Add `index.js` with your function code
3. Add `function.json` with bindings
4. Use relative URL in frontend: `/api/functionname`

### 5. Debugging Checklist
- [ ] Check browser console for errors
- [ ] Verify API endpoint URLs are relative (`/api/*`)
- [ ] Check Azure Static Web App logs (not Function App logs)
- [ ] Verify environment variables in Azure Portal
- [ ] Test in incognito window to avoid cache

## Common Mistakes to Avoid

❌ DON'T:
- Point to slaterbot.azurewebsites.net
- Create separate Azure Function Apps
- Use absolute URLs for API calls
- Forget to set env vars in BOTH GitHub and Azure

✅ DO:
- Use relative API URLs
- Test on staging first
- Keep staging and production configs in sync
- Document any new environment variables

## Quick Commands

```bash
# Switch to staging and test
git checkout staging
git merge main  # or your feature branch
git push origin staging
# Wait 3 minutes, test at staging URL

# Deploy to production
git checkout main
git merge staging
git push origin main
# Wait 3 minutes, test at production URL
```

## Troubleshooting

### "CORS Error"
- You're probably using the wrong API URL
- Check for `slaterbot.azurewebsites.net` and replace with `/api/*`

### "401 Unauthorized" or "API Key Error"
1. Check GitHub Secrets has `OPENAI_API_KEY`
2. Check Azure Static Web App Configuration has `OPENAI_API_KEY`
3. Both staging and production need the key set separately

### "500 Internal Server Error"
- Check the browser's Network tab for response details
- Look for the actual error message in the response body
- Common issues: missing env vars, code errors in API functions

## Resource Locations

- **GitHub Repo**: https://github.com/sockpuppetrebel/cloud-resume
- **Production SWA**: Azure Portal → slater-cloud-swa
- **Staging SWA**: Azure Portal → slater-cloud-staging
- **DO NOT USE**: slaterbot Function App (delete this to avoid confusion)