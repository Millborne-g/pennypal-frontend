import { ReactNode } from "react";
import Box from "@mui/material/Box";

export const SpacedContainer = (props: {
    children: ReactNode;
    padding?: string | number;
}) => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: { sm: "center", xs: "flex-start" },
                p: props.padding ? props.padding : 0,
                flexDirection: {
                    sm: "row",
                    xs: "column",
                },
            }}
        >
            {props.children}
        </Box>
    );
};
