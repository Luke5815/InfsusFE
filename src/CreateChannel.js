import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import {InputLabel, MenuItem, Select, TextField} from "@mui/material";

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

const defaultForm = {
    name: "",
    description: "",
    websiteUrl: "",
    isPaid: "True"
}

const defaultErrorMap = {
    name: [false,""],
    description: [false,""],
    websiteUrl: [false,""],
    isPaid: [false,""]
}


export default function CreateChannel() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setForm(defaultForm)
        setErrorMap(defaultErrorMap)
        setOpen(false)
    };

    const [form, setForm] = React.useState(defaultForm)
    const [errorMap, setErrorMap] = React.useState(defaultErrorMap)

    const onSubmit = (event) => {
        event.preventDefault()
        const request = {
            name: form.name,
            description: form.description,
            websiteUrl: form.websiteUrl,
            isPaid: form.isPaid === "True",
        }
        console.log(request)

        fetch("http://localhost:8000/channel", {
            method: "POST",
            body: JSON.stringify(request)
        }).then(async (response) => {
            if (response.status === 201) {
                handleClose();
            } else if (response.status === 422) {
                setErrorMap(defaultErrorMap)
                const responseJson = await response.json();
                const lines = responseJson.detail.split('\n');

                const updatedErrorMap = {...errorMap};

                for (const line of lines){
                    const key = line.split(':')[0].trim();
                    const value = line.split(':')[1].trim();
                    updatedErrorMap[key] = [true, value];
                }

                setErrorMap(updatedErrorMap);
            }
        })
    };

    return (
        <div>
            <Button sx={{mb:3}} variant="contained" onClick={handleOpen}>ADD NEW CHANNEL</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <form autoComplete="off" onSubmit={onSubmit}>
                    <TextField
                        label="Name"
                        value={form.name}
                        onChange={e => {setForm({...form, name: e.target.value})}}
                        required
                        error = {errorMap.name[0]}
                        helperText={errorMap.name[1]}
                        variant="outlined"
                        color="secondary"
                        type="text"
                        sx={{mb: 3}}
                        fullWidth
                    />
                    <TextField
                        label="Url"
                        value={form.websiteUrl}
                        onChange={e => {setForm({...form, websiteUrl: e.target.value})}}
                        variant="outlined"
                        color="secondary"
                        type="url"
                        error = {errorMap.websiteUrl[0]}
                        helperText={errorMap.websiteUrl[1]}

                        fullWidth
                        sx={{mb: 3}}
                    />
                    <TextField
                        label="Description"
                        value={form.description}
                        onChange={e => {setForm({...form, description: e.target.value})}}
                        required
                        error = {errorMap.description[0]}
                        helperText={errorMap.description[1]}
                        variant="outlined"
                        color="secondary"
                        type="text"
                        minRows={6}
                        fullWidth
                        multiline
                        sx={{mb: 3}}
                    />
                    <InputLabel id="demo-simple-select-autowidth-label">Paid</InputLabel>
                    <Select
                        sx={{mb: 3}}
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        value={form.isPaid}
                        onChange={e => {setForm({...form, isPaid: e.target.value})}}
                        label="Paid"
                        error = {errorMap.isPaid[0]}
                        helperText={errorMap.isPaid[1]}
                    >
                        <MenuItem value={"True"}>True</MenuItem>
                        <MenuItem value={"False"}>False</MenuItem>
                    </Select>
                    <br/>
                    <Button variant="contained" type="submit">SUBMIT</Button>
                    </form>
                </Box>
            </Modal>
        </div>
    );
}