const TelegramBot = require('node-telegram-bot-api');

class BotStandalone {

  private _bot: typeof TelegramBot;
  private _me: any;

  constructor() {
    this._bot = null;
    this._me = null;
  }

  set bot(bot: typeof TelegramBot) {
    if (bot instanceof TelegramBot) {
      this._bot = bot;
    } else {
      console.error("Bot => bot must be instance of TelegramBot")
    }
  }

  sendKeyboard(id: number, text: string, buttons: [], options = {}) {
    const opts = {
      reply_markup: {
        resize_keyboard: true,
        keyboard: buttons,
      },
      ...options
    };
    return this.sendMessage(id, text, opts);
  }

  sendPhoto(...params: Parameters<(typeof TelegramBot)['sendPhoto']>) {
    return this._bot.sendPhoto(...params);
  }

  sendVideo(...params: Parameters<(typeof TelegramBot)['sendVideo']>) {
    return this._bot.sendVideo(...params);
  }

  sendDocument(...params: Parameters<(typeof TelegramBot)['sendDocument']>) {
    return this._bot.sendDocument(...params);
  }

  sendMediaGroup(...params: Parameters<(typeof TelegramBot)['sendMediaGroup']>) {
    return this._bot.sendMediaGroup(...params);
  }

  sendAnimation(...params: Parameters<(typeof TelegramBot)['sendMediaGroup']>) {
    return this._bot._formatSendData('animation', ...params);
  }

  sendMessage(id: number, text: string, options = {}) {
    if (this._bot) {
      const opts = {
        ...options
      };

      return this._bot.sendMessage(id, text, opts);
    } else {
      console.error('Bot => you should initiate bot first');
    }
  }

  deleteMessage(...params: Parameters<(typeof TelegramBot)['deleteMessage']>) {
    return this._bot.deleteMessage(...params);
  }

  getMe() {
    if (!this._me) {
      this._me = this._bot.getMe();
    }
    return this._me;
  }

  getFileLink(...params: Parameters<(typeof TelegramBot)['getFileLink']>) {
    return this._bot.getFileLink(...params);
  }
}

export const botStandalone = new BotStandalone();
