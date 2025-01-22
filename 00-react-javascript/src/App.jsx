import  axios  from  "./util/axios.customize";
import  {  useEffect, useState  }  from  "react";
import { encryptNote, decryptNote } from "./util/crypto";
import { saveAs } from "file-saver";

function App() {
  const [file, setFile] = useState(null);
  const [encryptedFile, setEncryptedFile] = useState(null);
  const key = "1234567890"; // key for encryption

  useEffect (()  =>  {
    const  fetchHelloWorld  =  async ()  =>  {
      const  res  =  await  axios . get ( `${import.meta.env.VITE_BACKEND_ULR}/v1/api/` );
      console . log ( " >>> check res: " ,  res )
    }

    fetchHelloWorld ()
  },  [])

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleEncrypt = () => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer = e.target.result;
      const fileContent = new TextDecoder().decode(arrayBuffer)
      const encrypted = encryptNote(fileContent, key);
      setEncryptedFile(encrypted);
      console.log("Encrypted file: ", encrypted);
    };
    reader.readAsArrayBuffer(file)
  };

  const handleDecrypt = () => {
    const decrypted = decryptNote(encryptedFile, key);
    const blob = new Blob([decrypted], { type: file.type });
    saveAs(blob, `decrypted_${file.name}`);
    console.log("Decrypted File: ", decrypted);
  };


  return (
    <>
      <h1>Encrypt and Decrypt Notes</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleEncrypt}>Encrypt File</button>
      <button onClick={handleDecrypt} disabled={!encryptedFile}>Decrypt File</button>
      <div>
        <h2>Encrypted File</h2>
        <p>{encryptedFile}</p>
      </div>
    </>
  );
}

export default App
