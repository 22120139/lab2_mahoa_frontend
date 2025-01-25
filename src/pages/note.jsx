import React, { useState, useEffect } from 'react';
import { Button, Container, Typography, Alert, List, ListItem, ListItemText, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton, Box } from '@mui/material';
import { encryptFile, decryptFile } from '../util/encryption';
import { createNote, getNotes, deleteNote, updateNote } from '../util/noteApi';
import axios from '../util/axios.customize';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit'; 
import ShareNoteModal from '../components/shareNoteModal';
import ShareIcon from '@mui/icons-material/Share'; 
import { v4 as uuidv4 } from 'uuid';

const NotePage = () => {
    const [idUser, setIdUser] = useState(null);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openShareDialog, setOpenShareDialog] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [editNoteId, setEditNoteId] = useState(null);  // Dùng cho việc chỉnh sửa
    const [shareNoteId, setShareNoteId] = useState(null); // Dùng cho việc chia sẻ
    const [file, setFile] = useState(null);
    const [encryptedFile, setEncryptedFile] = useState('');
    const [decryptedFile, setDecryptedFile] = useState('');
    const [openUploadDialog, setOpenUploadDialog] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [openDecryptDialog, setOpenDecryptDialog] = useState(false);
    const [fileToDecrypt, setFileToDecrypt] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [fileToDelete, setFileToDelete] = useState(null);
    const [privateKey, setPrivateKey] = useState('');

    useEffect(() => {
        const storedIdUser = localStorage.getItem('id_user');
        if (storedIdUser) {
            setIdUser(storedIdUser);
            fetchNotes(storedIdUser);
            fetchPrivateKey(storedIdUser);
        } else {
            setError("User not found. Please login.");
        }
    }, []);

    const fetchPrivateKey = async (userId) => {
        try {
            const response = await axios.get(`/api/user/private-key/${userId}`);
            setPrivateKey(response.data.privateKey);
        } catch (error) {
            setError("Error fetching private key.");
        }
    };

    const fetchNotes = async (storedIdUser) => {
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

    const handleCreateNote = async (e) => {
        e.preventDefault();
        if (!idUser) {
            setError("User ID is required");
            return;
        }
        try {
            const data = await createNote(idUser, title, content);
            setSuccessMessage('Note created successfully!');
            setTitle('');
            setContent('');
            fetchNotes(idUser);
            setOpenDialog(false);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDeleteNote = async (id) => {
        try {
            await deleteNote(id); 
            setSuccessMessage('Note deleted successfully!');
            setNotes(prevNotes => prevNotes.filter(note => note._id !== id)); 
        } catch (error) {
            setError('Error deleting note.');
        }
    };

    const handleEditNote = (note) => {
        setEditNoteId(note._id);
        setTitle(note.title);
        setContent(note.content);
        setOpenEditDialog(true);
    };

    const handleUpdateNote = async () => {
        try {
            const data = await updateNote(editNoteId, title, content);
            setSuccessMessage('Note updated successfully!');
            setNotes(prevNotes => prevNotes.map(note => note._id === editNoteId ? data : note)); 
            setOpenEditDialog(false);
        } catch (error) {
            setError('Error updating note.');
        }
    };

    const handleOpenShareModal = (noteId) => {
        setShareNoteId(noteId);  // Cập nhật noteId cho việc chia sẻ
        setOpenShareDialog(true);  // Mở modal chia sẻ
    };

    const handleShareSuccess = () => {
        // Khi chia sẻ thành công, cập nhật lại danh sách ghi chú và thông báo
        fetchNotes(idUser);  // Tải lại ghi chú ngay khi chia sẻ thành công
        setSuccessMessage('Note shared successfully!');
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        const reader = new FileReader();
        reader.onload = (e) => {
            const arrayBuffer = e.target.result;
            const fileContent = new TextDecoder().decode(arrayBuffer);
            const encrypted = encryptFile(fileContent, privateKey);
            setEncryptedFile(encrypted);
            setOpenUploadDialog(true);
        };
        reader.readAsArrayBuffer(selectedFile);
    };

    const handleUploadFile = async () => {
        try {
            const fileId = uuidv4();
            const formData = new FormData();
            formData.append('file', new Blob([encryptedFile], { type: file.type }), file.name);
            await axios.post('/v1/api/upload', formData);
            setUploadedFiles([...uploadedFiles, { id: fileId, name: file.name }]);
            setSuccessMessage('File uploaded successfully!');
            setOpenUploadDialog(false);
        } catch (error) {
            setError('Error uploading file.');
        }
    };

    const handleDecryptFile = async (file) => {
        try {
            const decrypted = decryptFile(encryptedFile, privateKey);
            const blob = new Blob([decrypted], { type: file.type });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = file.name;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            setSuccessMessage('File decrypted and downloaded successfully!');
        } catch (error) {
            setError('Error decrypting file.');
        }
    };

    const handleShareFile = (file) => {
        const url = `${window.location.origin}/share/${file.id}?key=${privateKey}&timeout=3600`;
        navigator.clipboard.writeText(url);
        setSuccessMessage('File share URL copied to clipboard!');
    };

    const handleDeleteFile = async () => {
        try {
            await axios.delete(`/v1/api/delete/${fileToDelete.id}`);
            setUploadedFiles(uploadedFiles.filter(f => f.id !== fileToDelete.id));
            setSuccessMessage('File deleted successfully!');
            setOpenDeleteDialog(false);
        } catch (error) {
            setError('Error deleting file.');
        }
    };

    return (
        <Container maxWidth="md" style={{ marginTop: '60px' }}> {/* Đã thêm marginTop ở đây */}
            {error && <Alert severity="error" style={{ marginBottom: '10px' }}>{error}</Alert>}
            {successMessage && <Alert severity="success" style={{ marginBottom: '10px' }}>{successMessage}</Alert>}

            <Typography variant="h4" align="center" gutterBottom>My Notes</Typography>

            <IconButton
                color="primary"
                onClick={() => setOpenDialog(true)}
                style={{ position: 'fixed', bottom: '20px', right: '20px', backgroundColor: '#007bff' }}
            >
                <AddIcon />
            </IconButton>

            {loading ? (
                <Typography align="center">Loading notes...</Typography>
            ) : (
                <Box>
                    {notes.length === 0 ? (
                        <Typography align="center">No notes available.</Typography>
                    ) : (
                        <List>
                            {notes.map((note) => (
                                <ListItem key={note._id} style={{ borderBottom: '1px solid #ddd', padding: '10px 0' }}>
                                    <ListItemText
                                        primary={<Typography variant="h6">{note.title}</Typography>}
                                        secondary={<Typography>{note.content}</Typography>}
                                    />
                                    <IconButton
                                        color="secondary"
                                        onClick={() => handleDeleteNote(note._id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleEditNote(note)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        color="default"
                                        onClick={() => handleOpenShareModal(note._id)} // Mở modal chia sẻ ghi chú
                                    >
                                        <ShareIcon />
                                    </IconButton>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Box>
            )}

            {/* Modal Chia Sẻ Note */}
            {openShareDialog && (
                <ShareNoteModal
                    noteId={shareNoteId}  // Truyền shareNoteId cho modal chia sẻ
                    onClose={() => setOpenShareDialog(false)}
                    onSuccess={handleShareSuccess}  // Cập nhật UI ngay khi chia sẻ thành công
                />
            )}

            {/* Dialog để tạo mới ghi chú */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>Create a New Note</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Title"
                        variant="outlined"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Content"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        margin="normal"
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleCreateNote} color="primary">
                        Create Note
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog để chỉnh sửa ghi chú */}
            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>Edit Note</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Title"
                        variant="outlined"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Content"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        margin="normal"
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleUpdateNote} color="primary">
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            <div>
                <input type="file" accept=".txt,.docx,.pdf" onChange={handleFileChange} />
            </div>

            <Dialog open={openUploadDialog} onClose={() => setOpenUploadDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>Upload File</DialogTitle>
                <DialogContent>
                    <Typography>Do you want to upload the file "{file?.name}"?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenUploadDialog(false)} color="secondary">
                        No
                    </Button>
                    <Button onClick={handleUploadFile} color="primary">
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDecryptDialog} onClose={() => setOpenDecryptDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>Decrypt File</DialogTitle>
                <DialogContent>
                    <Typography>Do you want to decrypt the file "{fileToDecrypt?.name}"?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDecryptDialog(false)} color="secondary">
                        No
                    </Button>
                    <Button onClick={() => handleDecryptFile(fileToDecrypt)} color="primary">
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>Delete File</DialogTitle>
                <DialogContent>
                    <Typography>Do you want to delete the file "{fileToDelete?.name}"?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)} color="secondary">
                        No
                    </Button>
                    <Button onClick={handleDeleteFile} color="primary">
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            <Typography variant="h5" align="center" gutterBottom>Uploaded Files</Typography>
            <List>
                {uploadedFiles.map((file, index) => (
                    <ListItem key={index}>
                        <ListItemText
                            primary={file.name}
                            secondary={<Typography variant="caption">ID: {file.id}</Typography>}
                        />
                        <Button onClick={() => { setFileToDecrypt(file); setOpenDecryptDialog(true); }} color="primary">Decrypt</Button>
                        <Button onClick={() => handleShareFile(file)} color="primary">Share</Button>
                        <Button onClick={() => { setFileToDelete(file); setOpenDeleteDialog(true); }} color="secondary">Delete</Button>
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default NotePage;
