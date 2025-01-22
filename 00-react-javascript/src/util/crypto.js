import CryptoJS from 'crypto-js';

export const encryptNote = (note, key) => {
  return CryptoJS.AES.encrypt(note, key).toString();
};

export const decryptNote = (encryptedNote, key) => {
  const bytes = CryptoJS.AES.decrypt(encryptedNote, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};