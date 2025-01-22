import CryptoJS from 'crypto-js';

// Function to encrypt a note
export const encryptNote = (note, privateKey) => {
    return CryptoJS.AES.encrypt(note, privateKey).toString();
};

// Function to decrypt a note
export const decryptNote = (encryptedNote, privateKey) => {
    const bytes = CryptoJS.AES.decrypt(encryptedNote, privateKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};