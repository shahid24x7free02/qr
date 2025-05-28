const express = require('express');
const QRCode = require('qrcode');
const app = express();

app.get('/', (req, res) => {
  res.send('QR Code API: Use /generate?data=yourdata');
});

app.get('/generate', async (req, res) => {
  const text = req.query.data;
  if (!text) return res.status(400).send('Missing "data" query');

  try {
    const qr = await QRCode.toDataURL(text);
    const img = Buffer.from(qr.split(',')[1], 'base64');
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': img.length,
    });
    res.end(img);
  } catch (err) {
    res.status(500).send('QR generation failed');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));
