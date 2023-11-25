import * as process from 'process';

import path from 'path';
import fs from 'fs';

const rootDir: string = process.env.VOLUME_PATH || path.join(__dirname, '../..');
const storagePath: string = path.join(rootDir, 'storage.json');

class JSONStorage {
  private store: Record<string, number> = {};

  constructor() {
    this.load();
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
      }, {} as Record<string, string>);

    return revertedStore[chatId];
  }

  private load() {
    fs.mkdirSync(rootDir, { recursive: true });
    if (fs.existsSync(storagePath)) {
      this.store = JSON.parse(fs.readFileSync(storagePath, 'utf-8'));
    }
  }

  private save() {
    fs.writeFileSync(storagePath, JSON.stringify(this.store));
  }
}

export const storage = new JSONStorage();
