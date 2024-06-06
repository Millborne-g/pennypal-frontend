import { ReactNode } from "react";
import Box from "@mui/material/Box";

export const CenteredContainer = (props: { children: ReactNode}) => {
  return (
    <Box sx={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px'}}>
        {props.children}
    </Box>
  )
}
