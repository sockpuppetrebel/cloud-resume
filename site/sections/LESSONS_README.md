# What I Actually Learned — Interactive Changelog Section

This section of my site is inspired by a great post I saw on Reddit (shoutout to whoever made that clean visual of their cloud project learnings). I wanted to take the idea and build something similar — but interactive, scroll-reveal, and mobile-friendly — to document what I *really* learned while building my cloud resume, bot, and deployment flow.

## 🧱 How It's Built

- It's just straight HTML, CSS, and a small `<script>` using click handlers for the expand/collapse effect
- Each "lesson" is a div with a title, challenge, and what I learned
- It's responsive, works on mobile, and light enough to drop into any static site
- The timeline visual gives it a nice flow and makes it easy to scan

## 📍 Where to Find It

The learning timeline is embedded directly in `/site/index.html` in the "Learning Timeline Section" (look for `<section id="learning">`). The styles are in the same file within the `<style>` tag.

## ✍️ How to Update It

When I learn something new (or survive some stupid Azure bug), I'll:

1. Open `/site/index.html`
2. Find the learning timeline section (search for `id="learning"`)
3. Add a new learning item like this:
   ```html
   <div class="learning-item">
     <div class="learning-card" data-expanded="false">
       <div class="learning-header">
         <h3>New Topic I Learned</h3>
         <span class="expand-icon">+</span>
       </div>
       <div class="learning-content">
         <p><strong>The Challenge:</strong> What broke or confused me</p>
         <p><strong>The Solution:</strong> What I figured out</p>
         <p><strong>What I Learned:</strong> The actual lesson from this experience</p>
       </div>
     </div>
   </div>
   ```

## 🎨 Styling

The section uses:
- A gradient background for visual interest
- Cards that expand on click to show details
- A timeline connector line between items
- Smooth transitions for the expand/collapse effect
- Mobile-responsive design that stacks nicely

## 🔧 JavaScript

The interactivity is simple:
- Click handlers on each card
- Toggle `data-expanded` attribute
- CSS transitions handle the animation
- No dependencies or frameworks needed

## 💡 Ideas for Future Updates

- Add dates to each learning item
- Include code snippets in some lessons
- Add tags for different technologies (Azure, Git, etc.)
- Create a filter to show only certain types of lessons
- Add a "copy link" button to share specific lessons

## 📝 Example Lessons Currently Included

1. **DNS & SSL Setup** - Fighting with Azure DNS zones and SSL certificates
2. **Blob Storage Migration** - Moving from basic blob to proper static site hosting
3. **CDN Configuration** - Learning about edge caching the hard way
4. **GitHub Actions** - Setting up CI/CD without breaking production
5. **OpenAI Integration** - Building a chatbot that actually works
6. **Staging Environments** - Why you need a staging branch (learned this one painfully)

This section is my favorite part of the site because it's honest about the struggles and celebrates the small wins along the way.