import React, { ReactNode, useEffect, useState } from "react";

// MUI
import { useTheme } from "@mui/material/styles";

// Redux
import { useSelector } from "react-redux";
import { Box, Toolbar } from "@mui/material";

const drawerWidth = 240;

const PageContainer = (props: {children: ReactNode}) => {
    const sidebarState = useSelector((state: any) => state.sidebar);

    const open = sidebarState.open;
    const windowWidth = window.innerWidth;

    const theme = useTheme();

    // Dashboard Content style
    const dashboardStyle = {
        flexGrow: 1,
        p: 3,
        // width: '100%',
        // marginLeft: (windowWidth > 1100)? open? 0: `-${drawerWidth}px`: 0,
        marginLeft: windowWidth > 1100 ? (open ? `${drawerWidth}px` : 0) : 0,
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        height: 1,
    };

    return (
        <>
            <Toolbar />
            <Box sx={dashboardStyle}>{props.children}</Box>
        </>
    );
};

export default PageContainer