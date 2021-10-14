require('dotenv').config();
const https = require('https');
const cors = require('cors');
const express = require('express');
const fs = require('fs');
const path = require('path');

const { CERT_PATH, KEY_PATH } = process.env;
const rootDir = path.join(__dirname, '..');

const app = express();
const httpsPort = 4444;

app.use(cors({
  origin: '*',
  credentials: true,
}));

app.get('/', (req, res) => {
  res.end('it\'s alive!');
})

https.createServer({
  key: fs.readFileSync(path.join(rootDir, KEY_PATH)),
  cert: fs.readFileSync(path.join(rootDir, CERT_PATH)),
}, app).listen(httpsPort);
