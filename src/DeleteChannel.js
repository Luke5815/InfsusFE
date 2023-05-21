import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


export default function DeleteChannel(props) {
    const {id} = props
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false)
    };

    const onDelete = (e) => {
        fetch("http://localhost:8000/channel/" + id, {
            method: "DELETE",
        }).then(r => handleClose())
    };

    return (
        <div>
            <IconButton variant="contained" onClick={handleOpen}><DeleteIcon/></IconButton>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                        <p>Are you sure you want to delete the channel with id {id}</p>
                        <Button color="secondary" variant="contained" sx={{mr: 3}} onClick={onDelete}>Delete</Button>
                        <Button color="primary" variant="outlined" onClick={handleClose}>Cancel</Button>
                </Box>
            </Modal>
        </div>
    );
}