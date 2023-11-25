import './utils/envs';
import TelegramBot from 'node-telegram-bot-api';
import { botStandalone } from './classes/botStandalone';
import { storage } from './services/storage';
import { decrypt, encrypt, generateEncryptedToken } from './services/tokens';
import express from 'express';
import cors from 'cors';
import * as https from 'https';

const { TELEGRAM_BOT_TOKEN, TELEGRAM_BOT_NAME, DOMAIN, PORT } = process.env;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });
botStandalone.bot = bot;

const app = express();

app.use(cors({
  origin: '*',
  credentials: true,
}));

app.get('/', (req, res) => {
  res.end('it\'s alive!');
});

app.post('/:token/sendMessage', (req, res) => {
  const chatId = storage.getChatId(encrypt(req.params.token));
  const { text = '' } = req.query;


  if (!chatId) return res.status(400).json({ status: 'failed', description: 'Token is not valid' });
  if (!text) return res.status(400).json({ status: 'failed', description: 'Text is empty' });

  console.log(chatId, text);

  const options = {
    host: 'api.telegram.org',
    port: 443,
    path: `/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${chatId}&text=${encodeURI(text as string)}`,
    method: 'GET',
  };

  const request = https.request(options, function (response) {
    response.setEncoding('utf8');

    response.on('data', function (chunk) {
      const body = JSON.parse(chunk);
      if (body.ok) {
        res.json({ status: 'ok' });
      } else {
        const { description, error_code } = body;
        res.status(error_code).json({ status: 'failed', description });
      }
    });
  });

  request.on('error', function (e) {
    console.log('problem with request: ' + e.message);
    res.status(500).json({ status: 'failed' });
  });

  request.end();
});

bot.on('text', (msg) => {
  const { chat: { id: chatId }, text = '' } = msg;

  switch (true) {
    case new RegExp(`^\/generate(${TELEGRAM_BOT_NAME})?$`, 'gi').test(text):
      const encryptedToken = storage.getToken(chatId);
      if (encryptedToken) {

        botStandalone.sendMessage(
          chatId,
          createTokenMessage('Your token for this chat:', decrypt(encryptedToken),
          ),
        );
      } else {
        const tokens = generateEncryptedToken();
        storage.addItem(tokens.encryptedToken, chatId);
        botStandalone.sendMessage(
          chatId,
          createTokenMessage('Sure! Please take your fresh new token for this chat:', tokens.token),
        );
      }
      break;
  }
});

function createTokenMessage(message: string, token: string) {
  return `${message}\n${token}\n\nexample:\nhttps://${DOMAIN}/${token}/sendMessage?text=hello`;
}

app.listen(PORT);
