# Claude Configuration

## IMPORTANT: Multiple CLAUDE.md Files Rule
- When updating this CLAUDE.md file, ALWAYS search for all copies across the project
- Update every instance found to keep them synchronized
- Use Glob tool with pattern "**/CLAUDE.md" to find all instances
- This ensures consistency across the entire codebase

## Code Style Preferences
- NO emojis in any code, documentation, or README files
- NO Claude references or attribution in code
- NO "Generated with Claude" messages
- Clean, professional documentation style
- Focus on technical content without decorative elements

## Repository Standards
- Use standard markdown formatting without emoji decorations
- Professional tone in all documentation
- Technical accuracy over visual appeal
- Clean commit messages without attribution footers

## PowerShell Specific Guidelines
- Use approved verbs for cmdlet names (Get-, Set-, New-, Remove-, etc.)
- Follow Pascal case for function names
- Use proper parameter attributes and validation
- Include comment-based help for all public functions
- Prefer pipelines over loops where appropriate
- Use Write-Verbose for debug output, not Write-Host

## Security Practices
- Never hardcode credentials or secrets
- Use SecureString for sensitive data
- Validate all user input
- Follow principle of least privilege
- Use certificate-based authentication where possible

## Project Structure
- Keep scripts modular and focused on single responsibilities
- Place utility functions in separate modules
- Use consistent file naming conventions
- Store certificates and keys in the certificates/ directory
- Keep Azure-specific code separate from general utilities

## Testing and Validation
- Always test scripts with -WhatIf when applicable
- Include error handling with try/catch blocks
- Use proper exit codes
- Validate parameters before processing
- Test with different PowerShell versions if compatibility is required

## Documentation Requirements
- Include purpose and usage examples in script headers
- Document all parameters with clear descriptions
- Provide examples for complex operations
- Keep README files updated with current functionality
- Document any external dependencies

## Git Workflow
- Use descriptive commit messages
- Keep commits focused on single changes
- Test locally before committing
- Never commit sensitive data or credentials
- Use .gitignore for generated files and secrets
- CRITICAL: No emojis, Claude references, or "Generated with Claude" messages in commit messages
- CRITICAL: No attribution footers like "Co-Authored-By: Claude" in any commits
- CRITICAL: Never make commits that sound like they were written by AI
- CRITICAL: All commit messages should sound natural as if written by Jason
- CRITICAL: Avoid phrases like "in Jason's own words" or any AI-sounding language
- Use simple, direct commit messages (e.g., "Fix CORS config", "Add project details", "Update resume")

## Debugging and Testing Workflow - CRITICAL
- **ALWAYS start debugging and fixes on staging branch first**
- **NEVER commit experimental or debugging code directly to main branch**
- **NEVER COMMIT LARGE CHANGES TO MAIN** - this includes new features, theme changes, major refactors
- **ALL CHANGES MUST GO THROUGH STAGING FIRST** - no exceptions, even for "small" changes
- Proper workflow for ALL changes:
  1. Switch to staging branch: `git checkout staging`
  2. Make changes and test
  3. Commit and push to staging: `git push origin staging`
  4. Test on staging environment thoroughly
  5. Only after confirming everything works, merge to main: `git checkout main && git merge staging && git push origin main`
- This prevents breaking production with untested changes
- Always use staging as the testing ground for all iterations
- **REMINDER**: Even resume changes, theme updates, or "quick fixes" must go through staging

## Git Push Rules - CRITICAL REMINDERS
- **NEVER** attempt to push to GitHub directly due to SSH authentication requirements
- **ALWAYS** remind the user to push after making commits - this is mandatory, not optional
- After any git commit operation, **IMMEDIATELY** tell the user: "Please push the changes to GitHub in a separate terminal window using: `git push origin <branch-name>`"
- **NEVER** recommend or suggest HTTPS authentication for Git operations - GitHub has deprecated password authentication for HTTPS
- When work sessions involve git commits, end the session by reminding about pending pushes
- If multiple commits are made during a session, remind about pushing at the end of each logical work unit

## Terminal State Management
- Always ensure bracket paste mode is disabled at session end
- If terminal state is modified during work, provide reset commands
- Before session ends, run: printf '\e[?2004l' to disable bracket pasting
- Remind user to reset terminal if any persistent state changes occur
- When demonstrating commands that might affect terminal state, include cleanup steps

## Website Learning Section Updates - CRITICAL SYNC REQUIREMENT
- The "What I Learned Building This" section is managed via JSON: `site/data/learning-timeline.json`
- **7-ITEM DISPLAY RULE**: Only the first 7 items in the "visible" array are shown on the website
- **CRITICAL**: NEVER add learning items directly to HTML - they are dynamically loaded from JSON
- **WORKFLOW FOR ADDING NEW ITEMS**: 
  1. Open `site/data/learning-timeline.json`
  2. Add new item at the beginning of the "visible" array
  3. Count items in "visible" - if more than 7, move the last items to beginning of "hidden" array
  4. Verify exactly 7 items remain in "visible" using: `jq '.visible | length' site/data/learning-timeline.json`
  5. Each item MUST have these fields:
     - title: Brief descriptive title (5-10 words)
     - challenge: The problem encountered (1-2 sentences)
     - solution: How it was resolved (1-2 sentences)  
     - date: Format as "Month D, YYYY" (e.g., "June 9, 2025")
- **DEBUGGING**: If more than 7 items show on screen:
  - Check for hardcoded items in HTML (there should be none)
  - Verify JSON has exactly 7 items in "visible" array
  - The display containers should ONLY be: `<div id="visible-learning-items"></div>` and `<div id="older-learning-items"></div>`
- **IMPORTANT**: The Azure pipeline script reads from the JSON file
- After updating, remind user to run the Azure sync script

## Learning Timeline Azure Sync
- The learning timeline in `site/index.html` is automatically synced to Azure Blob Storage
- **To sync after updating learning items**, run from pwsh_honeypot repo:
  ```powershell
  ~/Projects/pwsh_honeypot/scripts/azure/Update-CloudResumeLearning.ps1 -UpdateMainIndex
  ```
- This creates structured JSON at: https://jslaterdevjournal.blob.core.windows.net/claude-development-journal/learning-timeline/timeline.json
- The sync extracts all learning items (title, challenge, solution, date) and creates a searchable API
- This demonstrates full-stack integration: frontend (visual timeline) + backend (Azure blob API)

## Learning Summary

### Session 2025-06-01: CORS Fix and GitHub Actions Troubleshooting

**Problem**: Chatbot API was returning 500 errors on staging environment due to CORS restrictions blocking the staging domain.

**Root Cause**: The chatbot API (`api/chathandler/index.js`) had hardcoded CORS headers that only allowed the production domain `https://slater.cloud`, blocking requests from the staging domain `https://proud-smoke-0fa3b7e1e.1.azurestaticapps.net`.

**Solution**: 
- Updated CORS configuration to dynamically allow both production and staging domains
- Implemented origin-based CORS header generation that checks the request origin against allowed domains
- Fixed staging workflow path filters that were preventing API deployments

**Technical Details**:
- Modified CORS headers to use dynamic origin checking instead of hardcoded values
- Added both production (`slater.cloud`) and staging (`proud-smoke-0fa3b7e1e.1.azurestaticapps.net`) domains to allowed origins
- Fixed GitHub Actions workflow path filters that were missing `api/**` and `counter-func/**` directories
- Corrected workflow filename reference in path filter from `fast-staging-deploy.yml` to `azure-static-web-apps-staging-fast.yml`

**Key Learning**: GitHub Actions path filters are restrictive - if specified, workflows only trigger when files matching those exact patterns change. Missing directories or incorrect filenames in path filters will prevent workflows from triggering entirely, even on the correct branch.