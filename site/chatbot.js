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
});

