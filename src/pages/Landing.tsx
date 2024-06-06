import React, {useEffect, useState, useRef} from 'react';
import { 
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Grid,
  Container
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';

// router
import { useNavigate } from 'react-router-dom';

// components
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

// Assets
import heroImage from '../assets/heroImage.svg';

export const Landing = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [height, setHeight] = useState<number>(0);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleResize = () => {
          if (elementRef.current) {
            const newHeight = elementRef.current.offsetHeight;
            
            if (newHeight !== height) {
              setHeight(newHeight);
            }
          }
        };
    
        // Initial height calculation
        handleResize();
    
        // Event listener for resize
        window.addEventListener('resize', handleResize);
    
        // Cleanup
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, [height]);
    
    
    return (
        <>
            <Box ref={elementRef} sx={{bgcolor: '#FFF', flexDirection: 'column', display: 'flex', justifyContent: 'center', alignItems: 'center',
            // height: '100vh'
            // height && height > 650 ? '100vh' : '800px'
            height: {
                sm: '100vh',
                xs: '900px'
            }  
            }}>
                <Header />
                <Container>
                    <Box>
                        <Grid container spacing={2} direction="row-reverse">
                            <Grid item md={6} xs={12} sx={{display: 'flex', justifyContent: 'center'}}>
                                <Box sx={{
                                    width: {
                                        md: '100%',
                                        xs: '600px'
                                    }
                                }}>
                                    <img src={heroImage} alt="hero" style={{width: '100%'}}/>
                                </Box>
                                {/* <img src={heroImage} alt="hero" style={{width: '100%'}}/> */}
                            </Grid>
                            <Grid item md={6} xs={12} sx={{display: 'flex', alignItems: 'center'}}>
                                <Box sx={{width: '100%', display: 'flex', flexDirection: 'column', gap: '15px',
                                justifyContent: {
                                    xs: 'center'
                                }
                                }}>
                                    <Typography variant='h4' fontWeight={700} sx={{
                                        textAlign: {
                                            md: 'start',
                                            xs: 'center'
                                        }
                                    }}>
                                        Your Pocket Companion for <span style={{color: theme.palette.primary.main}}>Financial Peace!</span>
                                    </Typography>
                                    <Typography variant='subtitle1' sx={{
                                        textAlign: {
                                            md: 'start',
                                            xs: 'center'
                                        }
                                    }}>
                                        Seamlessly Track Income, Budget Smartly, and Monitor Your Savings Progress!
                                    </Typography>
                                    <Box sx={{
                                        textAlign: {
                                            md: 'start',
                                            xs: 'center'
                                        }
                                    }}>
                                        <Button 
                                            variant="contained" 
                                            size='large' 
                                            sx={{
                                                textTransform: 'none', 
                                                p: '15px 50px'
                                            }} 
                                            onClick={() => navigate(`/signup`)}>
                                                Get Started
                                            </Button>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
                
            </Box>
            <Box sx={{ 
                // position: 'absolute'
                position: {
                    sm: 'absolute',
                    xs: 'relative'
                } 
                , bottom: 0, width: '100%', bgcolor: '#FFF'}}>
                <Footer/>
            </Box>
        </>
    )
}
