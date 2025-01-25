import React, { useState, useEffect } from 'react';
import { Button, Container, Typography, Alert, List, ListItem, ListItemText, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton, Box } from '@mui/material';
import { createNote, getNotes, deleteNote, updateNote } from '../util/noteApi';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ShareNoteModal from '../components/shareNoteModal';
import ShareIcon from '@mui/icons-material/Share';

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
    const [editNoteId, setEditNoteId] = useState(null);
    const [shareNoteId, setShareNoteId] = useState(null);

    useEffect(() => {
        const storedIdUser = localStorage.getItem('id_user');
        if (storedIdUser) {
            setIdUser(storedIdUser);
            fetchNotes(storedIdUser);
        } else {
            setError("User not found. Please login.");
        }
    }, []);

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
            await createNote(idUser, title, content);
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
            fetchNotes(idUser); // Gọi lại fetchNotes sau khi xóa
        } catch (error) {
            setError('Error deleting note.');
        }
    };

    const handleEditNote = (note) => {
        if (!note || !note.title || !note.content) {
            setError("Invalid note selected for editing.");
            console.error("Invalid note:", note);
            return;
        }

        setEditNoteId(note._id);
        setTitle(note.title);
        setContent(note.content);
        setOpenEditDialog(true);
    };

    const handleUpdateNote = async () => {
        try {
            await updateNote(editNoteId, title, content);
            setSuccessMessage('Note updated successfully!');
            setOpenEditDialog(false);

            // Gọi lại fetchNotes sau khi cập nhật thành công
            if (idUser) {
                fetchNotes(idUser);
            }
        } catch (error) {
            setError('Error updating note.');
        }
    };

    const handleOpenShareModal = (noteId) => {
        setShareNoteId(noteId);
        setOpenShareDialog(true);
    };

    const handleShareSuccess = () => {
        fetchNotes(idUser);
        setSuccessMessage('Note shared successfully!');
    };

    return (
        <Container maxWidth="md" style={{ marginTop: '60px' }}>
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
                                        primary={
                                            <Typography variant="h6">
                                                {note.title}
                                            </Typography>
                                        }
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
                                        onClick={() => handleOpenShareModal(note._id)}
                                    >
                                        <ShareIcon />
                                    </IconButton>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Box>
            )}

            {openShareDialog && (
                <ShareNoteModal
                    noteId={shareNoteId}
                    onClose={() => setOpenShareDialog(false)}
                    onSuccess={handleShareSuccess}
                />
            )}

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
        </Container>
    );
};

export default NotePage;
