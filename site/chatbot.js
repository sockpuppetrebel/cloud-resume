// chatbot.js
window.addEventListener('DOMContentLoaded', () => {
  const historyEl = document.getElementById('history');
  const promptEl  = document.getElementById('mini-prompt');
  const sendBtn   = document.getElementById('mini-send');

  function appendMessage(who, text) {
    const div = document.createElement('div');
    div.className = 'message ' + who;
    div.innerText = text;
    historyEl.append(div);
    historyEl.scrollTop = historyEl.scrollHeight;
  }

  const API_URL =
    'https://slaterbot-staging.azurewebsites.net/api/chathandler?code=ptm5_TZyfWXUNz6fxwLGz1dTARFD0a2YuoN-izImiGDEAzFuFicq8Q==';

  sendBtn.addEventListener('click', async () => {
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
  });
});

