import { useEffect, useState } from "react";

// Cookie & JWT
import { setCookieWithToken, decodeJWT } from "../App";

// MUI
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import { Container, FormHelperText } from "@mui/material";

// Google Auth
import { useGoogleLogin } from "@react-oauth/google";

// User
import { setUser } from "../redux/reducers/userSlice";

// Redux
import { useSelector, useDispatch } from "react-redux";

// Router
import { useNavigate } from "react-router-dom";

// hooks
import { useUser } from "../redux/hooks/use-user";

// Components
import { CenteredPageContainer } from "../components/containers/CenteredPageContainer";
import { CenteredContainer } from "../components/containers/CenteredContainer";
import { ErrorSnackbar } from "../components/ErrorSnackbar";
import { Loading } from "../components/Loading";

// Assets
import logoWithText from "../assets/logoWithText.svg";

// useform
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
    email: yup.string().required("Email must be filled!"),
    password: yup.string().required("Password must be filled!"),
});

type formType = {
    email: string;
    password: string;
};

export const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loginWithGoogle, setLoginWithGoogle] = useState(false);

    const { loginUser, loadingMutation } = useUser();

    const [foundUser, setFoundUser] = useState(false);
    const [userDoesntExist, setUserDoesntExist] = useState<boolean | null>(
        null
    );

    const loginState = useSelector((state: any) => state.user.login);
    const userDetails = useSelector((state: any) => state.user.user);
    const [showPassword, setShowPassword] = useState(false);

    // useform
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        clearErrors,
    } = useForm<formType>({
        resolver: yupResolver(schema),
    });

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
    };

    const login = async (data: formType) => {
        setEmail(data.email);
        setPassword(data.password);
        setLoginWithGoogle(false);
    };

    const continueWithGoogle = () => {
        setFoundUser(false);
        getGoogleInfo();
        reset();
        clearErrors();
        setEmail("");
        setPassword("");
    };

    const getGoogleInfo = useGoogleLogin({
        onSuccess: (codeResponse) => {
            const apiUrl = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${codeResponse.access_token}`;
            fetch(apiUrl)
                .then((response) => response.json())
                .then((data) => {
                    setEmail(data.email);
                    setPassword("googlesignin");
                    setLoginWithGoogle(true);
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        },
    });

    useEffect(() => {
        const checkUserCred = async () => {
            if (email && password) {
                try {
                    setUserDoesntExist(null);
                    let resultloginUser = await loginUser({
                        email: email,
                        password: password,
                    }).unwrap();
                    if (resultloginUser.userToken) {
                        setCookieWithToken(resultloginUser.userToken);
                        dispatch(
                            setUser(decodeJWT(resultloginUser.userToken).user)
                        );
                    } else if (!resultloginUser.correctPassword) {
                        setFoundUser(!resultloginUser.correctPassword);
                    }
                } catch (err) {
                    setUserDoesntExist(true);
                }
            }
        };
        checkUserCred();
    }, [email, password]);

    useEffect(() => {
        if (loginState && userDetails !== undefined) {
            navigate("/dashboard");
        }
    }, [loginState, userDetails]);

    return (
        <>
            <CenteredPageContainer>
                <Container sx={{ position: "absolute", top: 0 }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "flex-start",
                            pt: 3,
                        }}
                    >
                        <Box
                            onClick={() => navigate("/")}
                            sx={{ cursor: "pointer" }}
                        >
                            <img
                                src={logoWithText}
                                alt=""
                                style={{ height: "60px" }}
                            />
                        </Box>
                    </Box>
                </Container>

                <Box
                    sx={{
                        bgcolor: "#FFF",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        p: "40px",
                        borderRadius: "8px",
                        gap: "20px",
                        boxShadow: "0px 4px 20px 0px rgba(0, 0, 0, 0.25)",
                        width: {
                            sm: "auto",
                            xs: "85%",
                        },
                    }}
                >
                    <Typography
                        variant="h5"
                        fontWeight={600}
                        sx={{ textAlign: "center" }}
                    >
                        Welcome to PennyPal
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px",
                            width: {
                                sm: "390px",
                                xs: "100%",
                            },
                        }}
                    >
                        <form
                            onSubmit={handleSubmit(login)}
                            style={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                                gap: "20px",
                            }}
                        >
                            <TextField
                                {...register("email")}
                                error={
                                    !!errors.email ||
                                    (!loginWithGoogle && userDoesntExist) ||
                                    false
                                }
                                helperText={
                                    errors.email?.message ||
                                    (!loginWithGoogle &&
                                        userDoesntExist &&
                                        "User doesn't exist!")
                                }
                                label="Email"
                                variant="outlined"
                            />
                            <FormControl variant="outlined">
                                <InputLabel
                                    error={!!errors.password || foundUser}
                                >
                                    Password
                                </InputLabel>
                                <OutlinedInput
                                    {...register("password")}
                                    error={!!errors.password || foundUser}
                                    type={showPassword ? "text" : "password"}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={
                                                    handleClickShowPassword
                                                }
                                                onMouseDown={
                                                    handleMouseDownPassword
                                                }
                                                edge="end"
                                            >
                                                {showPassword ? (
                                                    <VisibilityOff />
                                                ) : (
                                                    <Visibility />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Password"
                                />
                                {errors.password && (
                                    <FormHelperText error>
                                        {errors.password.message}
                                    </FormHelperText>
                                )}
                                {foundUser && (
                                    <FormHelperText error>
                                        Incorrect password!
                                    </FormHelperText>
                                )}
                            </FormControl>
                            <Button
                                variant="contained"
                                type="submit"
                                size="large"
                            >
                                Login
                            </Button>
                        </form>
                        <Button
                            variant="outlined"
                            size="large"
                            fullWidth
                            startIcon={<GoogleIcon />}
                            onClick={() => continueWithGoogle()}
                        >
                            Continue with Google
                        </Button>
                    </Box>
                    <CenteredContainer>
                        <Typography fontSize={13} color={"#BEBEBF"}>
                            Don't have an account ?
                        </Typography>
                        <Button
                            sx={{ textTransform: "none" }}
                            onClick={() => navigate("/signup")}
                        >
                            Sign Up
                        </Button>
                    </CenteredContainer>
                </Box>
            </CenteredPageContainer>
            <ErrorSnackbar
                openErrorSnackBar={foundUser || userDoesntExist || false}
                text={
                    (foundUser && "Incorrect password!") ||
                    (userDoesntExist && "User doesn't exist!") ||
                    ""
                }
            />

            {loadingMutation && <Loading />}
        </>
    );
};
