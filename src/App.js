import {Box, Tab, Tabs, Typography} from '@mui/material';
import {useState} from 'react';
import ChannelTable from "./ChannelTable";

function App() {
    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (event, newTabIndex) => {
        setTabIndex(newTabIndex);
    };

    return (
        <Box>
            <Box>
                <ChannelTable/>
            </Box>
        </Box>
    );
}

export default App;