import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

// MUI
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PaidIcon from "@mui/icons-material/Paid";
import WalletIcon from "@mui/icons-material/Wallet";
import MessageIcon from "@mui/icons-material/Message";
// import RuleIcon from "@mui/icons-material/Rule";
import { useTheme } from "@mui/material/styles";

// redux
import { useDispatch, useSelector } from "react-redux";

//slice
import { openSidebar } from "../redux/reducers/sidebarSlice";

// menu
const menu = [
    {
        path: "/dashboard",
        name: "Dashboard",
        icon: <DashboardIcon />,
    },
    {
        path: "/expenses",
        name: "Expenses",
        icon: <PaidIcon />,
    },
    {
        path: "/income",
        name: "Income",
        icon: <WalletIcon />,
    },
    // {
    //     path: "/plan",
    //     name: "Plan Budget",
    //     icon: <RuleIcon />,
    // },
    {
        path: "/message",
        name: "Message",
        icon: <MessageIcon />,
    },
];

const drawerWidth = 240;
export const Sidebar = () => {
    const dispatch = useDispatch();
    const sidebarState = useSelector((state: any) => state.sidebar);
    const [open, setOpen] = useState(sidebarState.open);
    const [currentUrl, setCurrentUrl] = useState("");
    const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

    const theme = useTheme();

    const location = useLocation();

    useEffect(() => {
        setCurrentUrl(location.pathname);
    }, [location]);

    const clickMenu = () => {
        dispatch(openSidebar(!sidebarState.open));
    };

    useEffect(() => {
        setOpen(sidebarState.open);
    }, [sidebarState.open]);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        // Attach the event listener
        window.addEventListener("resize", handleResize);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []); // Empty dependency array means this effect runs once after the initial render

    return (
        <>
            <Drawer
                variant={windowWidth > 1100 ? "persistent" : "temporary"}
                anchor="left"
                open={open}
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: "border-box",
                        borderWidth: 0,
                    },
                }}
                onClose={clickMenu}
            >
                <Toolbar />
                <Box sx={{ overflow: "auto" }}>
                    <List
                        subheader={
                            <ListSubheader sx={{ fontWeight: 550 }}>
                                Menu
                            </ListSubheader>
                        }
                    >
                        {menu.map((item) => (
                            <ListItem key={item.name}>
                                <NavLink
                                    to={item.path}
                                    style={{
                                        width: "100%",
                                        textDecoration: "none",
                                        color: "inherit",
                                    }}
                                >
                                    <ListItemButton
                                        selected={currentUrl === item.path}
                                        onClick={() => {
                                            if (windowWidth < 1100) {
                                                dispatch(openSidebar(false));
                                            }
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                color:
                                                    currentUrl === item.path
                                                        ? theme.palette.primary
                                                              .light
                                                        : "",
                                            }}
                                        >
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText
                                            sx={{
                                                color:
                                                    currentUrl === item.path
                                                        ? theme.palette.primary
                                                              .light
                                                        : "",
                                            }}
                                        >
                                            {item.name}
                                        </ListItemText>
                                    </ListItemButton>
                                </NavLink>
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                </Box>
            </Drawer>
        </>
    );
};
