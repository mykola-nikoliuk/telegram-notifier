const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '../..');
const storagePath = path.join(rootDir, 'storage.json');

class JSONStorage {
  private store: Record<string, number> = {};

  constructor() {
    this.load();
    console.log(this.store);
  }

  addItem(token: string, chatId: number) {
    this.store[token] = chatId;
    this.save();
  }

  getChatId(token: string) {
    return this.store[token] || null;
  }

  getToken(chatId: number) {
    // todo: very not optimized
    const revertedStore = Object.keys(this.store)
      .reduce((acc, key) => {
        acc[this.store[key]] = key;
        return acc;
      }, {});

    return revertedStore[chatId];
  }

  private load() {
    if (fs.existsSync(storagePath)) {
      this.store = JSON.parse(fs.readFileSync(storagePath, 'utf-8'));
    }
  }

  private save() {
    fs.writeFileSync(storagePath, JSON.stringify(this.store));
  }
}

export const storage = new JSONStorage();