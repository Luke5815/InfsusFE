import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import {InputLabel, MenuItem, Select, TextField} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import EditIcon from '@mui/icons-material/Edit';

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

const defaultErrorMap = {
    name: [false,""],
    description: [false,""],
    minimumAge: [false,""],
    channel: [false,""]
}

export default function UpdateContent(props) {
    const {content,channels} = props;

    console.log(channels)

    const defaultForm = {
        name: content.name,
        description: content.description,
        minimumAge: content.minimumAge,
        channel: content.channel
    }

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
            minimumAge: form.minimumAge,
            channel: form.channel,
        }
        console.log(request)

        fetch("http://localhost:8000/content/" + content.id, {
            method: "PUT",
            body: JSON.stringify(request)
        }).then(async (response) => {
            if (response.status === 200) {
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
            <IconButton variant="contained" onClick={handleOpen}><EditIcon/></IconButton>
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
                        <TextField
                            label="Name"
                            value={form.minimumAge}
                            onChange={e => {setForm({...form, minimumAge: e.target.value})}}
                            required
                            error = {errorMap.minimumAge[0]}
                            helperText={errorMap.minimumAge[1]}
                            variant="outlined"
                            color="secondary"
                            type="number"
                            sx={{mb: 3}}
                            fullWidth
                        />
                        <InputLabel id="id2">Channel</InputLabel>
                        <Select
                            sx={{mb: 3}}
                            labelId="id2"
                            id="id2"
                            value={form.channel}
                            onChange={e => {setForm({...form, channel: e.target.value})}}
                            label="Channel"
                            error = {errorMap.channel[0]}
                            helperText={errorMap.channel[1]}
                        >
                            {channels ? channels.map((channel) => {
                                console.log(channel);
                                console.log(content);
                                return channel.id === content.channel 
                                    ? <MenuItem selected value={channel.id}>{channel.name}</MenuItem> 
                                    : <MenuItem value={channel.id}>{channel.name}</MenuItem>;
                                
                                
                            }
                                ) : <></>}
                        </Select>
                        <br/>
                        <Button variant="contained" type="submit">SUBMIT</Button>
                    </form>
                </Box>
            </Modal>
        </div>
    );
}