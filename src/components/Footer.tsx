import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Link } from '@mui/material';

export const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <Box sx={{ width: '100%', padding: '10px 0'}}>
            <Container sx={{display: 'flex', justifyContent: 'center'}}>
                <Typography variant='caption' textAlign='center' sx={{color: '#929292'}}>
                    © {currentYear} PennyPal | <Link href='https://millborneportfolio.vercel.app/' sx={{textDecoration: 'none', color: '#929292',
                    '&: hover': {
                        color: 'primary.main'
                    }
                    }} target="_blank">Millborne Galamiton.</Link> All rights reserved.
                </Typography>
                
            </Container>
        </Box>
  )
}
