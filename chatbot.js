window.addEventListener('DOMContentLoaded', () => {
  const sendBtn = document.getElementById('send');
  const promptInput = document.getElementById('prompt');
  const replyPre = document.getElementById('reply');

  sendBtn.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) {
      replyPre.innerText = 'Please enter a message.';
      return;
    }
    replyPre.innerText = 'Loading...';

    try {
      const url ='https://slaterbot-staging.azurewebsites.net/api/chathandler?code=GQFelT9d27Wt-p6cn8oqSrCxYMg6_A6Q480v-BcRGfWWAzFuOTEigw==';
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt })
      });

      if (!response.ok) {
        replyPre.innerText = `Error: ${response.status} ${response.statusText}`;
        return;
      }

      const payload = await response.json();
      const text =
        payload.reply ||
        (payload.choices && payload.choices[0] && payload.choices[0].message && payload.choices[0].message.content) ||
        JSON.stringify(payload, null, 2);
      replyPre.innerText = text;
    } catch (err) {
      console.error(err);
      replyPre.innerText = 'Request failed. Check console for details.';
    }
  });
});

