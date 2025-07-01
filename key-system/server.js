const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;
const KEYS_FILE = './keys.json';

let keysDB = fs.existsSync(KEYS_FILE) ? JSON.parse(fs.readFileSync(KEYS_FILE)) : {};

function saveKeys() {
  fs.writeFileSync(KEYS_FILE, JSON.stringify(keysDB, null, 2));
}

function generateKey(length = 20) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

app.use(express.static('public'));

app.get('/get-key', (req, res) => {
  const hwid = req.query.hwid;
  if (!hwid) return res.status(400).json({ status: 'error', message: 'No HWID provided.' });

  const now = Date.now();

  if (keysDB[hwid] && now - keysDB[hwid].timestamp < 24 * 60 * 60 * 1000) {
    return res.json({ status: 'success', key: keysDB[hwid].key });
  }

  const newKey = generateKey();
  keysDB[hwid] = { key: newKey, timestamp: now };
  saveKeys();
  res.json({ status: 'success', key: newKey });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
