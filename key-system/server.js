const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 10000;

const dbFile = 'keys.json';
let db = fs.existsSync(dbFile) ? JSON.parse(fs.readFileSync(dbFile)) : {};

function saveDB() {
  fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
}

function generateRandomKey(length = 20) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

app.use(express.static('public')); // <-- Add this line

app.get('/get-key', (req, res) => {
  const hwid = req.query.hwid;
  if (!hwid) return res.json({ status: "error", message: "No HWID provided" });

  if (!db[hwid]) {
    db[hwid] = {
      key: generateRandomKey(),
      createdAt: Date.now()
    };
    saveDB();
  }

  res.json({ status: "success", key: db[hwid].key });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
