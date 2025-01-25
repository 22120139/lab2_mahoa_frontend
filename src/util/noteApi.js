import axios from './axios.customize';
import CryptoJS from 'crypto-js';

const API_URL = 'http://localhost:8080/v1/api/notes'; // Thay bằng URL của bạn

// export const createNote = async (idUser, title, content) => {
//     try {
//         const response = await axios.post(API_URL, { idUser, title, content });
//         return response.data;
//     } catch (error) {
//         throw new Error(error.response ? error.response.data.error : error.message);
//     }
// };

// // Hàm lấy danh sách ghi chú
// export const getNotes = async (idUser) => {
//     try {
//         const response = await axios.get(API_URL, {
//             params: { idUser } // Truyền idUser qua query parameters
//         });
//         console.log("Response data:", response); // Kiểm tra dữ liệu trả về từ API
//         return response; // Trả về dữ liệu
//     } catch (error) {
//         console.error("Error fetching notes:", error);
//         throw new Error(error.response ? error.response.data.error : error.message);
//     }
// };

// Khóa AES từ môi trường (cần đảm bảo bạn đã định nghĩa trong .env)
const key = "your-secret-key";

// Hàm mã hóa
const encryptData = (data) => {
    return CryptoJS.AES.encrypt(data, key).toString();
};

// Hàm tạo ghi chú (có mã hóa)
export const createNote = async (idUser, title, content) => {
    try {
        // Mã hóa tiêu đề và nội dung
        const encryptedTitle = encryptData(title);
        const encryptedContent = encryptData(content);

        // Gửi dữ liệu đã mã hóa lên server
        const response = await axios.post(API_URL, {
            idUser,
            title: encryptedTitle,
            content: encryptedContent,
        });

        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data.error : error.message);
    }
};

// Hàm giải mã
const decryptData = (data) => {
    try {
        const bytes = CryptoJS.AES.decrypt(data, key);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch {
        return data; // Nếu giải mã thất bại, trả về dữ liệu gốc
    }
};

// Hàm lấy danh sách ghi chú (có giải mã)
export const getNotes = async (idUser) => {
    try {
        const response = await axios.get(API_URL, {
            params: { idUser }, // Truyền idUser qua query parameters
        });

        // Giải mã dữ liệu trước khi trả về
        const decryptedNotes = response.map(note => ({
            ...note,
            title: decryptData(note.title),
            content: decryptData(note.content),
        }));

        console.log("Decrypted Notes:", decryptedNotes); // Log ghi chú đã giải mã
        return decryptedNotes;
    } catch (error) {
        console.error("Error fetching notes:", error);
        throw new Error(error.response ? error.response.data.error : error.message);
    }
};

export const deleteNote = async (id) => {
    try {
        const response = await axios.delete(API_URL, { data: { id } }); // Gửi id trong body
        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data.error : error.message);
    }
};

// API cập nhật ghi chú
export const updateNote = async (id, title, content) => {
    try {
        const response = await axios.put(`${API_URL}`, { id, title, content });
        return response;  // Trả về dữ liệu ghi chú đã được cập nhật
    } catch (error) {
        throw new Error(error.response ? error.response.data.error : error.message);
    }
};

export const shareNote = async (noteId, userIds) => {
    try {
        const response = await axios.post(`${API_URL}/share`, { noteId, userIds });
        return response; // Trả về dữ liệu ghi chú sau khi chia sẻ
    } catch (error) {
        throw new Error(error.response ? error.response.data.error : error.message);
    }
};