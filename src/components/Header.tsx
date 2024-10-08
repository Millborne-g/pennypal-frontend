import React, { useState } from "react";

import Cookies from "js-cookie";

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
import { Divider } from "@mui/material";

// MUI icons
import MenuIcon from "@mui/icons-material/Menu";

// sidebarSlice
import { openSidebar } from "../redux/reducers/sidebarSlice";

// userSlice
import { logoutUser } from "../redux/reducers/userSlice";

// Assets
import logoWithText from "../assets/logoWithText.svg";

// redux
import { useDispatch, useSelector } from "react-redux";

// Router
import { useNavigate } from "react-router-dom";

// components
import { MessagePopup } from "./popups/MessagePopup";

export const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userDetails = useSelector((state: any) => state.user.user);
    const userLogin = useSelector((state: any) => state.user.login);
    const sidebarState = useSelector((state: any) => state.sidebar);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [openMessageModal, setOpenMessageModal] = useState(false);
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
                                        display: {
                                            sm: "flex",
                                            xs: "none",
                                        },
                                    }}
                                    onClick={handleClick}
                                    startIcon={
                                        <Avatar
                                            sx={{ width: 30, height: 30 }}
                                            alt={userDetails.fullName}
                                            src={userDetails.userImage}
                                        />
                                    }
                                >
                                    <Typography sx={{}}>
                                        {userDetails.fullName}
                                    </Typography>
                                </Button>
                                <IconButton
                                    onClick={handleClick}
                                    sx={{
                                        display: {
                                            sm: "none",
                                            xs: "block",
                                        },
                                    }}
                                >
                                    <Avatar
                                        alt={userDetails.fullName}
                                        src={userDetails.userImage}
                                    />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    id="account-menu"
                                    open={open}
                                    onClose={handleClose}
                                    onClick={handleClose}
                                    PaperProps={{
                                        elevation: 0,
                                        sx: {
                                            maxWidth: 500,
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
                                    <Box sx={{ px: 2, pb: 1, pt: 0.5 }}>
                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                        >
                                            <Avatar
                                                alt={userDetails.fullName}
                                                src={userDetails.userImage}
                                            />
                                            <Stack>
                                                <Typography width={1} noWrap>
                                                    {userDetails.fullName}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    width={1}
                                                    noWrap
                                                    color="#9e9e9e"
                                                >
                                                    {userDetails.email}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </Box>

                                    <Divider sx={{ width: 1 }} />
                                    <MenuItem
                                        onClick={() => {
                                            setOpenMessageModal(true);
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
            {openMessageModal && (
                <MessagePopup
                    content="
                        Are you sure you want to logout?"
                    closeAction={() => setOpenMessageModal(false)}
                    leftBtnAction={() => {
                        dispatch(logoutUser());
                        Cookies.remove("userToken");
                        navigate("/login");
                    }}
                />
            )}
        </>
    );
};
