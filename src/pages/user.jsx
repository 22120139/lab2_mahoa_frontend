import React, { useState } from 'react';
import { encryptFile, decryptFile } from '../util/encryption';
import axios from '../util/axios.customize';

const UserPage = () => {
    const [file, setFile] = useState(null);
    const [encryptedFile, setEncryptedFile] = useState('');
    const [decryptedFile, setDecryptedFile] = useState('');
    const privateKey = 'your-private-key'; // Replace with a secure key management solution

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleEncrypt = () => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const arrayBuffer = e.target.result;
            const fileContent = new TextDecoder().decode(arrayBuffer);
            const encrypted = encryptFile(fileContent, privateKey);
            setEncryptedFile(encrypted);
            // Upload the encrypted file to the server
            axios.post('/v1/api/upload', { file: encrypted });
        };
        reader.readAsArrayBuffer(file);
    };

    const handleDecrypt = async () => {
        // Download the encrypted file from the server
        const response = await axios.get('/v1/api/download');
        const encrypted = response.data.file;
        const decrypted = decryptFile(encrypted, privateKey);
        setDecryptedFile(decrypted);
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleEncrypt}>Encrypt & Upload</button>
            <button onClick={handleDecrypt}>Decrypt & Read</button>
            <div>
                <h3>Encrypted File:</h3>
                <p>{encryptedFile}</p>
            </div>
            <div>
                <h3>Decrypted File:</h3>
                <p>{decryptedFile}</p>
            </div>
        </div>
    );
};

export default UserPage;