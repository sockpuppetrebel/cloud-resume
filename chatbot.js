// chatbot.js
window.addEventListener('DOMContentLoaded', () => {
  const sendBtn    = document.getElementById('send');
  const promptInput= document.getElementById('prompt');
  const replyPre   = document.getElementById('reply');

  sendBtn.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) {
      replyPre.innerText = 'Please enter a message.';
      return;
    }
    replyPre.innerText = 'Loading…';

    try {
      const url = 'const url =
  'https://slaterbot.azurewebsites.net/api/chathandler?code=GQFelT9d27Wt-p6cn8oqSrCxYMg6_A6Q480v-BcRGfWWAzFuOTEigw==';
';
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt })
      });
      if (!res.ok) {
        replyPre.innerText = `Error: ${res.status} ${res.statusText}`;
        return;
      }
      const payload = await res.json();
      replyPre.innerText =
        payload.choices?.[0]?.message?.content ||
        payload.reply ||
        JSON.stringify(payload, null, 2);
    } catch (err) {
      console.error(err);
      replyPre.innerText = 'Request failed. Check console.';
    }
  });
});

