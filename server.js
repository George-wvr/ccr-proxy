const express = require('express');
const fetch = require('node-fetch');

const app = express();

app.get('/', (req, res) => {
  res.send('🎧 Chelmsford Radio Proxy is running!');
});

app.get('/nowplaying', async (req, res) => {
  try {
    const response = await fetch('https://cast3.asurahosting.com/proxy/chelmsfo/stats?sid=1&mode=json');
    const data = await response.json();
    const song = data.SONGTITLE || 'Unknown';
    res.json({ song });
  } catch (err) {
    console.error('Error fetching song info:', err);
    res.status(500).json({ error: 'Could not fetch song info' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
