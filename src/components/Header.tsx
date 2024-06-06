import React from "react";

// Mui
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import ListItemIcon from "@mui/material/ListItemIcon";
import Button from "@mui/material/Button";
import Logout from "@mui/icons-material/Logout";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

// MUI icons
import MenuIcon from "@mui/icons-material/Menu";

// sidebarSlice
import { openSidebar } from "../redux/reducers/sidebarSlice";

// userSlice
import { logoutUser } from "../redux/reducers/userSlice";

// Assets
import logoWithText from "../assets/logoWithText.svg";
import logo from "../assets/logo.svg";

// redux
import { useDispatch, useSelector } from "react-redux";

// Router
import { useNavigate } from "react-router-dom";

export const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userDetails = useSelector((state: any) => state.user.user);
    const userLogin = useSelector((state: any) => state.user.login);
    const sidebarState = useSelector((state: any) => state.sidebar);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            <Box sx={{ flexGrow: 0 }}>
                <AppBar
                    position="fixed"
                    elevation={!userLogin ? 2 : 0}
                    sx={{
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                        bgcolor: "#FFFFFF",
                    }}
                >
                    <Toolbar>
                        {!userLogin ? (
                            <>
                                <Container
                                    maxWidth="lg"
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        p: 0,
                                    }}
                                >
                                    <Box
                                        onClick={() => navigate("/")}
                                        sx={{ cursor: "pointer" }}
                                    >
                                        <img src={logoWithText} alt="" />
                                    </Box>
                                    <Box sx={{ flexGrow: 1 }} />
                                    <Stack
                                        spacing={1}
                                        direction="row"
                                        sx={{
                                            display: {
                                                sm: "block",
                                                xs: "none",
                                            },
                                        }}
                                    >
                                        <Button
                                            variant="text"
                                            sx={{
                                                textTransform: "none",
                                                color: "#000",
                                            }}
                                            onClick={() => navigate("/login")}
                                        >
                                            Log in
                                        </Button>
                                        <Button
                                            variant="contained"
                                            sx={{ textTransform: "none" }}
                                            onClick={() => navigate("/signup")}
                                        >
                                            Sign up
                                        </Button>
                                    </Stack>
                                    <IconButton
                                        id="fade-button"
                                        aria-controls={
                                            open ? "fade-menu" : undefined
                                        }
                                        aria-haspopup="true"
                                        aria-expanded={
                                            open ? "true" : undefined
                                        }
                                        onClick={handleClick}
                                        sx={{
                                            display: {
                                                sm: "none",
                                                xs: "block",
                                            },
                                        }}
                                    >
                                        <MenuIcon />
                                    </IconButton>
                                    <Menu
                                        id="fade-menu"
                                        MenuListProps={{
                                            "aria-labelledby": "fade-button",
                                        }}
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                        // TransitionComponent={Fade}
                                    >
                                        <MenuItem
                                            onClick={() => navigate("/login")}
                                        >
                                            Log in
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => navigate("/signup")}
                                        >
                                            Sign up
                                        </MenuItem>
                                    </Menu>
                                </Container>
                            </>
                        ) : (
                            <>
                                <IconButton
                                    aria-label="open drawer"
                                    onClick={() => {
                                        dispatch(
                                            openSidebar(!sidebarState.open)
                                        );
                                    }}
                                    edge="start"
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    flexGrow={1}
                                    gap={1}
                                >
                                    <img
                                        src={logoWithText}
                                        alt=""
                                        onClick={() => navigate("/dashboard")}
                                        style={{ cursor: "pointer" }}
                                    />
                                </Stack>
                                <Button
                                    sx={{
                                        textTransform: "none",
                                        color: "#000000",
                                    }}
                                    onClick={handleClick}
                                    startIcon={
                                        <Avatar
                                            sx={{ width: 30, height: 30 }}
                                            alt={userDetails.name}
                                            src={userDetails.userImage}
                                        />
                                    }
                                >
                                        <Typography sx={{
                                            display: {
                                                sm: "block",
                                                xs: "none"
                                            }
                                        }}>
                                            {userDetails.fullName}
                                        </Typography>
                                </Button>
                                <Menu
                                    anchorEl={anchorEl}
                                    id="account-menu"
                                    open={open}
                                    onClose={handleClose}
                                    onClick={handleClose}
                                    PaperProps={{
                                        elevation: 0,
                                        sx: {
                                            overflow: "visible",
                                            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                                            mt: 1.5,
                                            "& .MuiAvatar-root": {
                                                width: 32,
                                                height: 32,
                                                ml: -0.5,
                                                mr: 1,
                                            },
                                            "&::before": {
                                                content: '""',
                                                display: "block",
                                                position: "absolute",
                                                top: 0,
                                                right: 14,
                                                width: 10,
                                                height: 10,
                                                bgcolor: "background.paper",
                                                transform:
                                                    "translateY(-50%) rotate(45deg)",
                                                zIndex: 0,
                                            },
                                        },
                                    }}
                                    transformOrigin={{
                                        horizontal: "right",
                                        vertical: "top",
                                    }}
                                    anchorOrigin={{
                                        horizontal: "right",
                                        vertical: "bottom",
                                    }}
                                >
                                    <MenuItem
                                        onClick={() => {
                                            dispatch(logoutUser());
                                            navigate("/login");
                                        }}
                                    >
                                        <ListItemIcon>
                                            <Logout fontSize="small" />
                                        </ListItemIcon>
                                        Logout
                                    </MenuItem>
                                </Menu>
                            </>
                        )}
                    </Toolbar>
                </AppBar>
            </Box>
        </>
    );
};
