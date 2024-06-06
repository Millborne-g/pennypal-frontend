import React, { useEffect, useState } from "react";

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
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";

// Google Auth
import { useGoogleLogin } from "@react-oauth/google";

// hooks
import { useUser } from "../redux/hooks/use-user";

//redux
import { useSelector, useDispatch } from "react-redux";

// Router
import { useNavigate } from "react-router-dom";

// User
import { setUser, logoutUser } from "../redux/reducers/userSlice";

// Components
import { CenteredContainer } from "../components/containers/CenteredContainer";
import { CenteredPageContainer } from "../components/containers/CenteredPageContainer";
import { FormHelperText } from "@mui/material";

// Assets
import logoWithText from "../assets/logoWithText.svg";

// error message
interface ErrorMessage {
    data?: {
        code?: Number;
    };
}

// useform
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
    firstName: yup.string().required("First name must be filled!"),
    lastName: yup.string().required("Last name must be filled!"),
    email: yup.string().required("Email must be filled!"),
    password: yup.string().required("Password must be filled!"),
    confirmPassword: yup.string().required("Confirm password must be filled!"),
});

type formType = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export const Signup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [userDetails, setUserDetails] = useState({});
    const [enteredEmail, setEnteredEmail] = useState("");
    const [signUpWithGoogle, setSignUpWithGoogle] = useState(false);
    const [emailAlreadyExist, setEmailAlreadyExist] = useState(false);
    const {
        registerUser,
        registerUserSuccessMutation,
        registerUserErrorMessage,
        SnackbarComponent: registerSnackbar,
    } = useUser({ email: enteredEmail });
    const loginState = useSelector((state: any) => state.user.login);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // useform
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<formType>({
        resolver: yupResolver(schema),
    });

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
    };

    const handleClickShowConfirmPassword = () =>
        setShowConfirmPassword((show) => !show);

    const handleMouseDownConfirmPassword = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
    };

    const sendUserDetails = async (details: object) => {
        await registerUser(details);
    };

    const signUp = (data: formType) => {
        setSignUpWithGoogle(false);
        if (confirmPassword !== password) {
            setConfirmPasswordError(true);
        } else {
            let newData = {
                email: data.email,
                password: data.password,
                fullName: data.firstName + " " + data.lastName,
                firstName: data.firstName,
                lastName: data.lastName,
                userImage: "",
            };
            registerUser(newData);
            setUserDetails(newData);
        }
    };

    // const signup = () => {
    //     let newData = {
    //         email: data.email,
    //         password: '',
    //         fullName: data.name,
    //         firstName: data.given_name,
    //         lastName: data.family_name,
    //         userImage: data.picture,
    //     }
    //     register(newData);
    // }

    const continueWithGoogle = () => {
        setSignUpWithGoogle(true);
        getGoogleInfo();
    };

    const getGoogleInfo = useGoogleLogin({
        onSuccess: (codeResponse) => {
            const apiUrl = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${codeResponse.access_token}`;
            fetch(apiUrl)
                .then((response) => response.json())
                .then((data) => {
                    let newData = {
                        email: data.email,
                        password: "",
                        fullName: data.name,
                        firstName: data.given_name,
                        lastName: data.family_name,
                        userImage: data.picture,
                    };
                    setEnteredEmail(data.email);
                    setUserDetails(newData);
                    sendUserDetails(newData);
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        },
        // flow: 'auth-code',
    });

    //   useEffect(() => {
    //     console.log(emailDetails);

    //     if(emailDetails){
    //         let newData = {
    //             email: (emailDetails as { email: string }).email,
    //             password: '',
    //             fullName: (emailDetails as { name: string }).name,
    //             firstName: (emailDetails as { given_name: string }).given_name,
    //             lastName: (emailDetails as { family_name: string }).family_name,
    //             userImage: (emailDetails as { picture: string }).picture,
    //         }
    //         register(newData);
    //         // setEmailDetails({});
    //     }

    //   },[emailDetails])

    // Cred already exist
    useEffect(() => {
        if (registerUserErrorMessage) {
            const { data } = registerUserErrorMessage as ErrorMessage;
            const code = data?.code; // Non-null assertion
            console.log(code);

            if (code === 11000) {
                // message = "Email already exist!";
                // dispatch(setUser(userDetails));
                if (signUpWithGoogle) {
                    dispatch(setUser(userDetails));
                } else {
                    setEmailAlreadyExist(true);
                }
            }
        }
    }, [registerUserErrorMessage]);

    // dispatch(logoutUser())

    // register new user
    useEffect(() => {
        if (registerUserSuccessMutation) {
            dispatch(setUser(userDetails));
        }
    }, [registerUserSuccessMutation]);

    useEffect(() => {
        if (loginState) {
            navigate("/dashboard");
        }
    }, [loginState]);

    return (
        <>
            <CenteredPageContainer>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "20px",
                        p: 1,
                        width: {
                            sm: "480px",
                            xs: "90%",
                        },
                    }}
                >
                    <Box
                        onClick={() => navigate("/")}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                        }}
                    >
                        <img
                            src={logoWithText}
                            alt=""
                            style={{ height: "60px" }}
                        />
                    </Box>
                    <Typography
                        variant="h5"
                        fontWeight={500}
                        textAlign="center"
                    >
                        Create an account for free
                    </Typography>
                    <form
                        onSubmit={handleSubmit(signUp)}
                        style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px",
                        }}
                    >
                        <Box sx={{ flexGrow: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item sm={6} xs={12}>
                                    <TextField
                                        {...register("firstName")}
                                        error={!!errors.firstName}
                                        helperText={errors.firstName?.message}
                                        label="First Name"
                                        variant="outlined"
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item sm={6} xs={12}>
                                    <TextField
                                        {...register("lastName")}
                                        error={!!errors.lastName}
                                        helperText={errors.lastName?.message}
                                        label="Last Name"
                                        variant="outlined"
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                        <TextField
                            {...register("email")}
                            error={
                                emailAlreadyExist
                                    ? emailAlreadyExist
                                    : !!errors.email
                            }
                            helperText={
                                emailAlreadyExist
                                    ? "Update email."
                                    : errors.email?.message
                            }
                            label="Email"
                            variant="outlined"
                            onChange={() => setEmailAlreadyExist(false)}
                        />
                        <FormControl variant="outlined">
                            <InputLabel error={!!errors.password}>
                                Password
                            </InputLabel>
                            <OutlinedInput
                                value={password}
                                {...register("password")}
                                error={!!errors.password}
                                type={showPassword ? "text" : "password"}
                                onChange={(e) => setPassword(e.target.value)}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
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
                        </FormControl>
                        <FormControl variant="outlined">
                            <InputLabel
                                error={
                                    confirmPasswordError
                                        ? confirmPasswordError
                                        : !!errors.confirmPassword
                                }
                            >
                                Confirm Password
                            </InputLabel>
                            <OutlinedInput
                                value={confirmPassword}
                                {...register("confirmPassword")}
                                error={
                                    confirmPasswordError
                                        ? confirmPasswordError
                                        : !!errors.confirmPassword
                                }
                                type={showConfirmPassword ? "text" : "password"}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    setConfirmPasswordError(false);
                                }}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={
                                                handleClickShowConfirmPassword
                                            }
                                            onMouseDown={
                                                handleMouseDownConfirmPassword
                                            }
                                            edge="end"
                                        >
                                            {showConfirmPassword ? (
                                                <VisibilityOff />
                                            ) : (
                                                <Visibility />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Confirm Password"
                            />
                            {errors.confirmPassword && (
                                <FormHelperText error>
                                    {errors.confirmPassword.message}
                                </FormHelperText>
                            )}
                            {confirmPasswordError && (
                                <FormHelperText error>
                                    Password don't match!
                                </FormHelperText>
                            )}
                        </FormControl>
                        <Button variant="contained" type="submit" size="large">
                            Sign Up
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
                    <CenteredContainer>
                        <Typography fontSize={13} color={"#BEBEBF"}>
                            Already Have An Account ?
                        </Typography>
                        <Button
                            sx={{ textTransform: "none" }}
                            onClick={() => navigate("/login")}
                        >
                            Log in
                        </Button>
                    </CenteredContainer>
                </Box>
            </CenteredPageContainer>
            {registerSnackbar}
        </>
    );
};
