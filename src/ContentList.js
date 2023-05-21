import {useEffect, useState} from "react";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateContent from "./UpdateContent";
import DeleteContent from "./DeleteContent";

export default function ContentList(props){
    const {id, channels} = props;

    function createData(
        id,
        name,
        description,
        minimumAge,
        channel
    ) {
        return {
            id,
            name,
            description,
            minimumAge,
            channel
        };
    }

    const [data, setData] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/channel/" + id).then(
            (response) => {
                const responseJson = response.json().then((json) => {
                    console.log(json.content)
                    const contentList = json.content;
                    let updateData = []

                    contentList.map((content) => {
                        console.log(content.name)
                        updateData.push({
                            id: content.id, 
                            name: content.name, 
                            description: content.description,
                            minimumAge: content.minimumAge,
                            channel: content.channel
                        })
                    })

                    setData(updateData);
                    console.log(updateData)
                })
            }
        )
    }, [])
    if(!data){
        return <></>
    } else {
        return (
            <div>
                {data ?
                    <Table size="small" aria-label="purchases">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Minimum Age</TableCell>
                                <TableCell>Edit</TableCell>
                                <TableCell>Delete</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((content) =>
                                <TableRow key={content}>
                                    <TableCell>{content.name}</TableCell>
                                    <TableCell>{content.description}</TableCell>
                                    <TableCell>{content.minimumAge}</TableCell>
                                    <TableCell><UpdateContent content={content} channels={channels}/></TableCell>
                                    <TableCell><DeleteContent id={content.id}/></TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table> : <></>}
            </div>
        )
    }

}