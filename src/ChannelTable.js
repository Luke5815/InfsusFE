import * as React from 'react';
import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {InputAdornment, Link, TextField} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ContentList from "./ContentList";
import CreateChannel from "./CreateChannel";
import UpdateChannel from "./UpdateChannel";
import DeleteChannel from "./DeleteChannel";
import CreateContent from "./CreateContent";

function createData(
    id,
    name,
    description,
    url,
    isPaid
) {
    return {
        id,
        name,
        description,
        url,
        isPaid,
    };
}


function Row(props) {
    const {row,rows} = props;
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{'& > *': {borderBottom: 'unset'}}}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.name}
                </TableCell>
                <TableCell align="right"><IconButton><UpdateChannel channel={row}/></IconButton></TableCell>
                <TableCell align="right"><IconButton><DeleteChannel id={row.id}/></IconButton></TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{margin: 1}}>
                            <Typography variant="h6" gutterBottom component="div">
                                Details
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Url</TableCell>
                                        <TableCell>isPaid</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow key={row}>
                                        <TableCell>{row.description}</TableCell>
                                        <TableCell><Link href={row.url}>{row.url}</Link></TableCell>
                                        <TableCell>{row.isPaid.toString()}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <Typography variant="h6" gutterBottom component="div">
                                Content
                            </Typography>
                            <ContentList id={row.id} channels={rows}/>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
);
}


export default function ChannelTable()
    {
        const [rows,setRows] = useState([]);
        const [filterRows, setFilterRows] = useState([]);
        const [search, setSearch] = useState("");

        useEffect(() => {
            fetch("http://localhost:8000/channels", {mode: "cors"}).then(
                (r) => {
                   const responseJson = r.json().then((json) => {
                    let updateRows = []
                    json.map((channel) => {
                       updateRows.push(createData(channel.id, channel.name, channel.description, channel.websiteUrl,channel.isPaid))
                    })
                    setRows(updateRows);
                    setFilterRows(updateRows)
                   })
                }
            )
        }, [])

        const onSearch = () => {
            if (search === ""){
                setFilterRows(rows)
            } else {
                const filteredRows = rows.filter((row) =>
                    row.name.toLowerCase().includes(search.toLowerCase())
                );
                setFilterRows(filteredRows);
            }
        }

        return (
            <TableContainer component={Paper}>
                <CreateChannel/>
                <CreateContent channels = {rows}/>
                <TextField
                    sx={{mt:3}}
                    value = {search}
                    onChange={(event) => setSearch(event.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick = {onSearch}><SearchIcon/></IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <Table aria-label="collapsib<le table">
                    <TableHead>
                        <TableRow>
                            <TableCell/>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Edit</TableCell>
                            <TableCell align="right">Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filterRows.map((row) => (
                            <Row key={row.name} row={row} rows={rows}/>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }