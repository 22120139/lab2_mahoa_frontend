import CryptoJS from 'crypto-js';

// Function to encrypt a file
export const encryptFile = (fileContent, privateKey) => {
    return CryptoJS.AES.encrypt(fileContent, privateKey).toString();
};

// Function to decrypt a file
export const decryptFile = (encryptedFile, privateKey) => {
    const bytes = CryptoJS.AES.decrypt(encryptedFile, privateKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};