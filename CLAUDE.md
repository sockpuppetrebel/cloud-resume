# Claude Configuration

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