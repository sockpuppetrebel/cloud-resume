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

## Git Push Rules
- **NEVER** attempt to push to GitHub directly due to SSH authentication requirements
- When commits are ready to be pushed, **ALWAYS** prompt the user to push manually in a separate terminal window where their SSH key is available
- **NEVER** recommend or suggest HTTPS authentication for Git operations - GitHub has deprecated password authentication for HTTPS
- Example push prompt: "Please push the changes to GitHub in a separate terminal window using: `git push origin <branch-name>`"

## Terminal State Management
- Always ensure bracket paste mode is disabled at session end
- If terminal state is modified during work, provide reset commands
- Before session ends, run: printf '\e[?2004l' to disable bracket pasting
- Remind user to reset terminal if any persistent state changes occur
- When demonstrating commands that might affect terminal state, include cleanup steps