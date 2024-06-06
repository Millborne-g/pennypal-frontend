import { useState, useEffect } from 'react'
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

// MUI imports 
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';

// Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { Expenses } from './pages/Expenses';
import { Income } from './pages/Income';
import { Message } from './pages/Message';

// components
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CssBaseline } from '@mui/material';

// redux
import { useSelector } from 'react-redux';

function App() {

  const loginState = useSelector((state: any) => state.user.login);
  const currentURL = window.location.pathname;

  const lightTheme = createTheme({
    palette: {
      mode: 'light',
    },
    typography: {
      fontFamily: ['Poppins', 'sans-serif'].join(','),
    },
    // Change color when user high lights the text
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            '& ::selection': {
              color: 'black',
              background: '#EEF2F6',
            },
            backgroundColor:'#EEF2F6',
          },
        },
      },
    }
  });

  useEffect(() => {
    if(currentURL === '/' && loginState){
      window.open('/dashboard', '_self');
    } else {
      window.open('', '_self');
    }
  },[currentURL])

  // const theme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <>
        <BrowserRouter>
          {(loginState) && 
              <>
                <Header/>
                <Sidebar/>
              </>
            }
          <Routes>
            <Route index element={loginState? <Navigate to="/dashboard" />: <Landing />}/> 
            <Route path="/login" element={loginState? <Navigate to="/dashboard" />: <Login />}/> 
            <Route path="/signup" element={loginState? <Navigate to="/dashboard" />:  <Signup />}/> 
            <Route path="/dashboard" element={loginState? <Dashboard />: <Navigate to="/login" />}/> 
            <Route path="/expenses" element={loginState? <Expenses />: <Navigate to="/login" />}/> 
            <Route path="/income" element={loginState? <Income />: <Navigate to="/login" />}/> 
            <Route path="/message" element={loginState? <Message />: <Navigate to="/login" />}/> 
          </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
