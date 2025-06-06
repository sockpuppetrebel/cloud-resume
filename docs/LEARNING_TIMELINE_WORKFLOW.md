# Learning Timeline Workflow

## Adding New Learning Items (Maintaining 7-Item Limit)

### Step 1: Add New Item at Top
1. Open `site/index.html`
2. Find: `<!-- Most recent learning items (June X, 2025) -->`
3. Add new learning item directly after the comment:

```html
<div class="learning-item" data-expanded="false">
  <div class="learning-dot"></div>
  <div class="learning-card">
    <div class="learning-header">
      <h3>Your Learning Title</h3>
      <span class="learning-expand">+</span>
    </div>
    <div class="learning-content">
      <p class="learning-challenge"><strong>Challenge:</strong> What was the problem</p>
      <p class="learning-solution"><strong>Solution:</strong> How you solved it</p>
      <div class="learning-timestamp">Added: Month Day, 2025</div>
    </div>
  </div>
</div>
```

### Step 2: Move Bottom Visible Item to Hidden Section
1. Count visible items (should be 8 after adding new one)
2. Cut the 8th visible item (the one just before `<!-- Collapsible older items section -->`)
3. Paste it as the FIRST item inside `<div id="older-learning-items">`

### Step 3: Commit with Proper Message
```bash
git add site/index.html
git commit -m "Add learning: [brief description]"
git push origin staging  # for testing
git push origin main     # for production
```

## Automation-Ready Format

When adding items, use this exact structure for future automation:

- **Title**: Descriptive but concise
- **Challenge**: What problem you faced
- **Solution**: How you solved it  
- **Date**: Always format as "Month Day, Year"

## Current Visible Items (Should Always Be 7)

1. PowerShell Azure Integration with CI/CD Pipeline Automation (June 5, 2025)
2. Full-Stack Thinking: Frontend UI to Backend API Architecture (June 5, 2025)
3. Complex Git Merge Conflict Resolution with Archive Integration (June 4, 2025)
4. Live API Integration with Error Handling & CORS (June 4, 2025)
5. AI Development Journal Archive System - Complete Implementation (June 4, 2025)
6. Status Widget CSP & Positioning Debugging Marathon (June 3, 2025)
7. Creating Dynamic, Interactive Learning Timeline (June 2, 2025)

## Hidden Items (Accessible via "Show Older" Button)

All items from June 2, 2025 and earlier are in the collapsible section.

## Best Practices

- **Keep titles under 60 characters** for mobile responsiveness
- **Focus on technical learnings** not just task completion
- **Include specific technologies** in titles when relevant
- **Update the date comment** when adding items from a new date
- **Test the expand/collapse** functionality after changes