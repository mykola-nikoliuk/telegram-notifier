const TelegramBot = require('node-telegram-bot-api');

class BotStandalone {

  private _bot: any;
  private _me: any;

  constructor() {
    this._bot = null;
    this._me = null;
  }

  set bot(bot) {
    if (bot instanceof TelegramBot) {
      this._bot = bot;
    } else {
      console.error("Bot => bot must be instance of TelegramBot")
    }
  }

  sendKeyboard(id, text, buttons, options = {}) {
    const opts = {
      reply_markup: {
        resize_keyboard: true,
        keyboard: buttons,
      },
      ...options
    };
    return this.sendMessage(id, text, opts);
  }

  sendPhoto(...params) {
    return this._bot.sendPhoto(...params);
  }

  sendVideo(...params) {
    return this._bot.sendVideo(...params);
  }

  sendDocument(...params) {
    return this._bot.sendDocument(...params);
  }

  sendMediaGroup(...params) {
    return this._bot.sendMediaGroup(...params);
  }

  sendAnimation(...params) {
    return this._bot._formatSendData('animation', ...params);
  }

  sendMessage(id, text, options = {}) {
    if (this._bot) {
      const opts = {
        ...options
      };

      return this._bot.sendMessage(id, text, opts);
    } else {
      console.error('Bot => you should initiate bot first');
    }
  }

  deleteMessage(...params) {
    return this._bot.deleteMessage(...params);
  }

  getMe() {
    if (!this._me) {
      this._me = this._bot.getMe();
    }
    return this._me;
  }

  getFileLink(...params) {
    return this._bot.getFileLink(...params);
  }
}

export const botStandalone = new BotStandalone();
