import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Alert } from '@mui/material';
import axios from '../util/axios.customize';  // Import axios từ axios.customize.js
import { shareNote} from '../util/noteApi';

const ShareNoteModal = ({ noteId, onClose, onSuccess }) => {
    console.log("Received noteId:", noteId);  // Kiểm tra giá trị nhận được
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('v1/api/users')  // API lấy danh sách người dùng
            .then(response => {
                console.log(response);  // Kiểm tra dữ liệu trả về
                setUsers(response);  // Lưu dữ liệu vào state
            })
            .catch(error => {
                setMessage('Failed to load users');
                console.error('Error fetching users:', error);  // Log lỗi nếu có
            });
    }, [])

    // const handleShare = async () => {
    //     // Kiểm tra xem noteId có hợp lệ hay không
    //     if (!noteId) {
    //         setMessage('Note ID is missing');
    //         return;
    //     }
    
    //     // Tìm người dùng với email đã nhập
    //     const user = users.find(u => u.name === email);  // Tìm người dùng theo email
    //     if (user) {
    //         try {
    //             // Gửi dữ liệu chia sẻ ghi chú với noteId và userIds
    //             const data = { 
    //                 noteId,  // Đảm bảo noteId có giá trị
    //                 userIds: [user._id]  // Truyền ID người dùng vào mảng userIds
    //             };
    
    //             console.log("noteId:", noteId);  // Kiểm tra giá trị noteId
    //             console.log("user._id:", user._id);  // Kiểm tra ID người dùng
    
    //             // Gọi API shareNote để chia sẻ ghi chú
    //             const response = await axios.post('v1/api/notes/share', data);  // Gửi yêu cầu chia sẻ ghi chú
    //             console.log("Share response:", response);  // Kiểm tra phản hồi từ API
    
    //             // Cập nhật UI sau khi chia sẻ thành công
    //             setMessage('Note shared successfully!');
    //             onSuccess(); // Cập nhật giao diện nếu chia sẻ thành công
    //             onClose();   // Đóng modal sau khi chia sẻ thành công
    //         } catch (error) {
    //             setMessage('Failed to share note');
    //             console.error('Error sharing note:', error);
    //         }
    //     } else {
    //         setMessage('User not found');
    //     }
    // };

    const storedIdUser = localStorage.getItem('id_user');

    
    const fetchNotesForShare = async (storedIdUser) => {
            try {
                setLoading(true);
                const data = await getNotes(storedIdUser);
                if (Array.isArray(data)) {
                    setNotes(data);
                } else {
                    setNotes([]);
                    setError("Failed to load notes. Data is not in expected format.");
                }
            } catch (error) {
                setError("Error fetching notes.");
            } finally {
                setLoading(false);
            }
    };
    

    const handleShare = async () => {
        // Kiểm tra xem noteId có hợp lệ hay không
        if (!noteId) {
            setMessage('Note ID is missing');
            return;
        }
    
        // Tìm người dùng với email đã nhập
        const user = users.find(u => u.name === email);  // Tìm người dùng theo email
        if (user) {
            try {
                // Gửi dữ liệu chia sẻ ghi chú với noteId và userIds
                const data = { 
                    noteId,  // Đảm bảo noteId có giá trị
                    userIds: [user._id]  // Truyền ID người dùng vào mảng userIds
                };
    
                console.log("noteId:", noteId);  // Kiểm tra giá trị noteId
                console.log("user._id:", user._id);  // Kiểm tra ID người dùng
    
                // Gọi API shareNote để chia sẻ ghi chú
                const response = await axios.post('v1/api/notes/share', data);  // Gửi yêu cầu chia sẻ ghi chú
                console.log("Share response:", response);  // Kiểm tra phản hồi từ API
    
                // Cập nhật UI sau khi chia sẻ thành công
                setMessage('Note shared successfully!');
    
                // Sau khi chia sẻ thành công, gọi lại fetchNotes để cập nhật danh sách ghi chú
                onSuccess(); // Cập nhật giao diện nếu chia sẻ thành công
                onClose();   // Đóng modal sau khi chia sẻ thành công
    
            } catch (error) {
                setMessage('Failed to share note');
                console.error('Error sharing note:', error);
            }
        } else {
            setMessage('User not found');
        }
    };
    

    return (
        <Dialog open={true} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Share Note</DialogTitle>
            <DialogContent>
                <TextField
                    label="Enter User Email"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                    required
                />
                {message && <Alert severity="error" style={{ marginTop: '10px' }}>{message}</Alert>}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Cancel</Button>
                <Button onClick={handleShare} color="primary">Share</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ShareNoteModal;
