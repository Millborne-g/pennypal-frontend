import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export const Loading = () => {
    return (
        <>  <Box sx={{ position: 'fixed', top: 1, height: '100vh', width: '100%'}}>
                <Box sx={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', top: 1, backdropFilter: 'blur(5px)', overflow: "auto" }}>
                <CircularProgress size={'80px'} />
                </Box>
            </Box>
            
        </>
    );
}
