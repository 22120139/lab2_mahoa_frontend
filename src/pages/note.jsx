import React, { useState, useEffect } from 'react';
import { Button, Container, Typography, Alert, List, ListItem, ListItemText, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton, Paper, Box } from '@mui/material';
import { createNote, getNotes } from '../util/noteApi';
import AddIcon from '@mui/icons-material/Add';


const NotePage = () => {
   const [idUser, setIdUser] = useState(null);
   const [notes, setNotes] = useState([]);
   const [loading, setLoading] = useState(false);
   const [openDialog, setOpenDialog] = useState(false);  // Trạng thái mở cửa sổ Dialog
   const [title, setTitle] = useState('');
   const [content, setContent] = useState('');
   const [error, setError] = useState(null);
   const [successMessage, setSuccessMessage] = useState(null);


   useEffect(() => {
       const storedIdUser = localStorage.getItem('id_user');
       if (storedIdUser) {
           setIdUser(storedIdUser);
           fetchNotes(storedIdUser);
       } else {
           setError("User not found. Please login.");
       }
   }, []);


   // Hàm lấy danh sách ghi chú từ backend
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
           setOpenDialog(false); // Đóng cửa sổ dialog sau khi tạo ghi chú thành công
       } catch (error) {
           setError(error.message);
       }
   };


   return (
       <Container maxWidth="md" style={{ marginTop: '20px' }}>
           {/* Cửa sổ thông báo lỗi và thành công */}
           {error && <Alert severity="error" style={{ marginBottom: '10px' }}>{error}</Alert>}
           {successMessage && <Alert severity="success" style={{ marginBottom: '10px' }}>{successMessage}</Alert>}


           <Typography variant="h4" align="center" gutterBottom>My Notes</Typography>


           {/* Nút thêm ghi chú nhỏ giống Gmail */}
           <IconButton
               color="primary"
               onClick={() => setOpenDialog(true)}
               style={{ position: 'fixed', bottom: '20px', right: '20px', backgroundColor: '#007bff' }}
           >
               <AddIcon />
           </IconButton>


           {/* Danh sách ghi chú */}
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
                               </ListItem>
                           ))}
                       </List>
                   )}
               </Box>
           )}


           {/* Cửa sổ bật lên để thêm ghi chú */}
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
       </Container>
   );
};


export default NotePage;