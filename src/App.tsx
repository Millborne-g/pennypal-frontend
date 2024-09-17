import { useEffect } from "react";
import Cookies from "js-cookie";
import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

// MUI imports
// import { createTheme } from '@mui/material/styles';

// Pages
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Dashboard } from "./pages/Dashboard";
import { Expenses } from "./pages/Expenses";
import { Income } from "./pages/Income";
import { Message } from "./pages/Message";
import { Plan } from "./pages/Plan";

// components
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";

// redux
import { useSelector, useDispatch } from "react-redux";

// slices
import { logoutUser } from "./redux/reducers/userSlice";

export const setCookieWithToken = (token: any) => {
    try {
        // Decode the JWT payload to extract the expiration time
        const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload (base64)

        // Calculate the current time and expiration time (in seconds)
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        const expiresInSeconds = decodedToken.exp - currentTime; // Time left in seconds until the token expires

        // If the token is already expired, do not set the cookie
        if (expiresInSeconds <= 0) {
            console.error("Token is already expired");
            return;
        }

        // Convert seconds to days for Cookies.set method
        const expiresInDays = expiresInSeconds / (60 * 60 * 24); // Convert seconds to days

        // Set the cookie with the same expiration as the JWT
        Cookies.set("userToken", token, { expires: expiresInDays });
    } catch (error) {
        console.error("Error setting cookie: ", error);
    }
};

export const decodeJWT = (token: string) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
    );

    return JSON.parse(jsonPayload);
};

function App() {
    const loginState = useSelector((state: any) => state.user.login);
    const currentURL = window.location.pathname;
    const isHasToken = Cookies.get("userToken") !== undefined ? true : false;

    const dispatch = useDispatch();
    // const lightTheme = createTheme({
    //   palette: {
    //     mode: 'light',
    //   },
    //   typography: {
    //     fontFamily: ['Poppins', 'sans-serif'].join(','),
    //   },
    //   // Change color when user high lights the text
    //   components: {
    //     MuiCssBaseline: {
    //       styleOverrides: {
    //         body: {
    //           '& ::selection': {
    //             color: 'black',
    //             background: '#EEF2F6',
    //           },
    //           backgroundColor:'#EEF2F6',
    //         },
    //       },
    //     },
    //   }
    // });

    useEffect(() => {
        if (!isHasToken) {
            // let userData = decodeJWT(token);
            dispatch(logoutUser());
        }
    }, [isHasToken]);

    useEffect(() => {
        if (currentURL === "/" && loginState) {
            window.open("/dashboard", "_self");
        } else {
            window.open("", "_self");
        }
    }, [currentURL]);

    // const theme = mode === 'light' ? lightTheme : darkTheme;

    return (
        <>
            <BrowserRouter>
                {loginState && (
                    <>
                        <Header />
                        <Sidebar />
                    </>
                )}
                <Routes>
                    <Route
                        index
                        element={
                            loginState ? (
                                <Navigate to="/dashboard" />
                            ) : (
                                <Landing />
                            )
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            loginState ? (
                                <Navigate to="/dashboard" />
                            ) : (
                                <Login />
                            )
                        }
                    />
                    <Route
                        path="/signup"
                        element={
                            loginState ? (
                                <Navigate to="/dashboard" />
                            ) : (
                                <Signup />
                            )
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            loginState ? (
                                <Dashboard />
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />
                    <Route
                        path="/expenses"
                        element={
                            loginState ? <Expenses /> : <Navigate to="/login" />
                        }
                    />
                    <Route
                        path="/income"
                        element={
                            loginState ? <Income /> : <Navigate to="/login" />
                        }
                    />
                    <Route
                        path="/message"
                        element={
                            loginState ? <Message /> : <Navigate to="/login" />
                        }
                    />

                    <Route
                        path="/plan"
                        element={
                            loginState ? <Plan /> : <Navigate to="/login" />
                        }
                    />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
