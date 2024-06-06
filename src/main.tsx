import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { configStore } from './redux/store.tsx';
import { Provider } from 'react-redux';

// MUI imports 
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

import { GoogleOAuthProvider } from '@react-oauth/google';

let lightTheme = createTheme({
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
            background: '#A9FFFF',
          },
          backgroundColor:'#EEF2F6',
        },
      },
    },
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={configStore}>
    <ThemeProvider theme={lightTheme}>
        <CssBaseline/>
        <React.StrictMode>
            <GoogleOAuthProvider clientId="1018198776894-daku3p4k9i841k5tosolh5bm1277th2i.apps.googleusercontent.com">
              <App />
            </GoogleOAuthProvider>
        </React.StrictMode>
      </ThemeProvider>
    </Provider>,
)
