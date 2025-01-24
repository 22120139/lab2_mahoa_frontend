import axios from './axios.customize';

const API_URL = 'http://localhost:8080/v1/api/notes'; // Thay bằng URL của bạn

export const createNote = async (idUser, title, content) => {
    try {
        const response = await axios.post(API_URL, { idUser, title, content });
        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data.error : error.message);
    }
};

// Hàm lấy danh sách ghi chú
export const getNotes = async (idUser) => {
    try {
        const response = await axios.get(API_URL, {
            params: { idUser } // Truyền idUser qua query parameters
        });
        console.log("Response data:", response); // Kiểm tra dữ liệu trả về từ API
        return response; // Trả về dữ liệu
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