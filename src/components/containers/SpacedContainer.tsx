import { ReactNode } from "react";
import Box from "@mui/material/Box";

export const SpacedContainer = (props : {children: ReactNode}) => {
  return (
    <Box sx={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
        {props.children}
    </Box>
  )
}
