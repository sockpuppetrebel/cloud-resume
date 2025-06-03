// chatbot.js - Updated June 1 2025
window.addEventListener('DOMContentLoaded', () => {
  const historyEl = document.getElementById('history');
  const promptEl  = document.getElementById('mini-prompt');
  const sendBtn   = document.getElementById('mini-send');

  function appendMessage(who, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ' + who;
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'bubble';
    // Replace \n with <br> for proper line breaks
    bubbleDiv.innerHTML = text.replace(/\n/g, '<br>');
    
    messageDiv.appendChild(bubbleDiv);
    historyEl.append(messageDiv);
    historyEl.scrollTop = historyEl.scrollHeight;
  }

  // Witty greetings and fun facts
  const greetings = [
    "👋 Hey there! I'm Jason's Resume AI — part cloud architect, part coffee enthusiast.",
    "🤖 Welcome! I know everything about Jason's skills (and his favorite Azure services).",
    "⚡ Hi! I'm faster than Jason's deployment pipelines... and that's saying something.",
    "🎯 Greetings! I'm here to talk shop about Jason's cloud expertise.",
    "💼 Hello! Ready to dive into Jason's professional superpowers?",
    "🚀 Welcome aboard! I'm Jason's AI assistant, powered by curiosity and caffeine."
  ];

  const funFacts = [
    "Did you know octopuses have three hearts? Jason only needs one for reliable uptime.",
    "Fun fact: Bananas are berries, but strawberries aren't. Cloud architecture makes more sense.",
    "The Eiffel Tower grows 6 inches in summer. Jason's skills grow daily.",
    "Sharks existed before trees. Jason's been in tech since... well, not that long.",
    "There are more possible chess games than atoms in the observable universe. Good thing we use automation.",
    "A group of flamingos is called a 'flamboyance.' A group of sysadmins is called 'caffeinated.'",
    "Honey never spoils. Neither do well-documented infrastructure setups.",
    "The human brain has 86 billion neurons. Jason uses most of his for troubleshooting."
  ];

  // Display random greeting on load
  function showGreeting() {
    console.log('Showing greeting...');
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];
    const message = `${randomGreeting}\n\n${randomFact}\n\nAsk me anything about Jason's experience!`;
    console.log('Greeting message:', message);
    appendMessage('bot', message);
  }

  const API_URL = '/api/chathandler';

  async function sendMessage() {
    const msg = promptEl.value.trim();
    if (!msg) return;
    appendMessage('user', msg);
    promptEl.value = '';
    appendMessage('bot', '⏳ thinking...');
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      });
      if (!res.ok) {
        appendMessage('bot', `Error: ${res.status} ${res.statusText}`);
        return;
      }
      const data = await res.json();
      historyEl.lastChild.remove();
      appendMessage('bot', data.reply || 'No response');
    } catch (err) {
      historyEl.lastChild.remove();
      appendMessage('bot', '⚠️ Error');
      console.error(err);
    }
  }

  // Send message on button click
  sendBtn.addEventListener('click', sendMessage);

  // Send message on Enter key press
  promptEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  });

  // Show greeting when page loads
  showGreeting();
  
  // Keep the function warm by pinging it every 5 minutes
  function keepWarm() {
    fetch('/api/keepwarm')
      .then(() => console.log('Function kept warm'))
      .catch(() => console.log('Keep-warm failed'));
  }
  
  // Initial warm-up call
  keepWarm();
  
  // Keep warm every 5 minutes
  setInterval(keepWarm, 5 * 60 * 1000);

  // Enhanced Widget State Management
  const chatContainer = document.getElementById('chatContainer');
  const chatHeader = document.getElementById('chatHeader');
  const chatCloseBtn = document.getElementById('chatCloseBtn');
  const chatBody = document.getElementById('chatBody');
  const chatReopenBtn = document.getElementById('chatReopenBtn');
  const gptMini = chatContainer.querySelector('.gpt-mini');

  let isDragging = false;
  let dragOffset = { x: 0, y: 0 };

  // Enhanced state management - two states: open, closed
  const chatState = {
    position: JSON.parse(localStorage.getItem('chatPosition') || 'null'),
    isClosed: localStorage.getItem('chatClosed') === 'true'
  };

  // Function to validate and apply position
  function applyPosition(savedPos) {
    if (savedPos) {
      // Get current viewport dimensions
      const maxX = window.innerWidth - chatContainer.offsetWidth;
      const maxY = window.innerHeight - chatContainer.offsetHeight;
      
      // Validate position is within viewport
      const validX = Math.max(0, Math.min(savedPos.x, maxX));
      const validY = Math.max(0, Math.min(savedPos.y, maxY));
      
      // Only apply if position is reasonable
      if (validX >= 0 && validY >= 0) {
        chatContainer.style.left = validX + 'px';
        chatContainer.style.top = validY + 'px';
        chatContainer.style.right = 'auto';
        chatContainer.style.bottom = 'auto';
        return true;
      }
    }
    return false;
  }

  // Disable transitions during initialization to prevent twitching
  chatContainer.style.transition = 'none';
  
  // Load saved position with validation
  if (!applyPosition(chatState.position)) {
    // Reset to default position if saved position is invalid
    chatContainer.style.bottom = '20px';
    chatContainer.style.right = '20px';
    chatContainer.style.left = 'auto';
    chatContainer.style.top = 'auto';
  }
  
  // Re-enable transitions after position is set
  setTimeout(() => {
    chatContainer.style.transition = '';
  }, 100);

  // Load saved states on startup
  if (chatState.isClosed) {
    chatContainer.classList.add('closed');
    chatContainer.style.display = 'none';
    chatReopenBtn.style.display = 'flex';
  } else {
    chatReopenBtn.style.display = 'none';
  }


  // Close functionality
  chatCloseBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    
    // Add subtle flash effect for confirmation
    chatContainer.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.4)';
    setTimeout(() => {
      chatContainer.style.boxShadow = '';
    }, 200);
    
    // Close with smooth animation
    setTimeout(() => {
      chatContainer.classList.add('closed');
      setTimeout(() => {
        chatContainer.style.display = 'none';
        chatReopenBtn.style.display = 'flex';
        chatState.isClosed = true;
        localStorage.setItem('chatClosed', 'true');
      }, 400);
    }, 200);
  });

  // Reopen functionality
  chatReopenBtn.addEventListener('click', function() {
    chatReopenBtn.style.display = 'none';
    chatContainer.style.display = 'block';
    chatContainer.classList.remove('closed');
    chatState.isClosed = false;
    localStorage.setItem('chatClosed', 'false');
  });

  // Drag functionality - only on desktop
  if (window.innerWidth > 768) {
    chatHeader.addEventListener('mousedown', function(e) {
      // Only start drag if not clicking on control buttons
      if (e.target === chatCloseBtn || e.target.closest('.close-btn')) {
        return;
      }
      
      isDragging = true;
      const rect = chatContainer.getBoundingClientRect();
      dragOffset.x = e.clientX - rect.left;
      dragOffset.y = e.clientY - rect.top;
      
      chatHeader.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
      
      e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
      if (!isDragging) return;
      
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Keep widget within viewport bounds
      const maxX = window.innerWidth - chatContainer.offsetWidth;
      const maxY = window.innerHeight - chatContainer.offsetHeight;
      
      const boundedX = Math.max(0, Math.min(newX, maxX));
      const boundedY = Math.max(0, Math.min(newY, maxY));
      
      chatContainer.style.left = boundedX + 'px';
      chatContainer.style.top = boundedY + 'px';
      chatContainer.style.right = 'auto';
      chatContainer.style.bottom = 'auto';
    });

    document.addEventListener('mouseup', function() {
      if (isDragging) {
        isDragging = false;
        chatHeader.style.cursor = 'move';
        document.body.style.userSelect = '';
        
        // Save position to localStorage
        const rect = chatContainer.getBoundingClientRect();
        chatState.position = { x: rect.left, y: rect.top };
        localStorage.setItem('chatPosition', JSON.stringify(chatState.position));
      }
    });
  }
});

