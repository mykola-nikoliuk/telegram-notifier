import * as crypto from 'crypto';
import { v4 } from 'uuid';

const { AES_KEY_BASE64, AES_IV_BASE64 } = process.env;

const algorithm = "aes-256-cbc";
const initVector = Buffer.from(AES_IV_BASE64, 'base64');
const securityKey = Buffer.from(AES_KEY_BASE64, 'base64');

export function encrypt(message: string) {
  const cipher = crypto.createCipheriv(algorithm, securityKey, initVector);

  let encryptedData = cipher.update(message, "utf-8", "hex");

  encryptedData += cipher.final("hex");
  return encryptedData;
}

export function decrypt(encryptedMessage: string) {
  const decipher = crypto.createDecipheriv(algorithm, securityKey, initVector);
  let decryptedData = decipher.update(encryptedMessage, "hex", "utf-8");
  decryptedData += decipher.final("utf8");
  return decryptedData;
}

export function generateEncryptedToken() {
  const token = v4();
  const encryptedToken = encrypt(token);
  return {
    token,
    encryptedToken
  };
}