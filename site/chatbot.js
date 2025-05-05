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

  sendBtn.addEventListener('click', async () => {
    const msg = promptEl.value.trim();
    if (!msg) return;
    appendMessage('user', msg);
    promptEl.value = '';
    appendMessage('bot', '⏳ thinking...');
    try {
      const res = await fetch(
        'https://slaterbot-staging.azurewebsites.net/api/chathandler?code=GQFelT9d27Wt-p6cn8oqSrCxYMg6_A6Q480v-BcRGfWWAzFuOTEigw==',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: msg })
        }
      );
      const data = await res.json();
      historyEl.lastChild.remove(); // remove “thinking…”
      appendMessage('bot', data.reply || 'No response');
    } catch (err) {
      historyEl.lastChild.remove();
      appendMessage('bot', '⚠️ Error');
      console.error(err);
    }
  });
});

