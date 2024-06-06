import { ReactNode } from "react";
// MUI imports
import Box from '@mui/material/Box';

export const BorderedContainer = (props: { children: ReactNode}) => {
  return (
    <Box sx={{bgcolor: "#FFF", p: "20px", borderRadius: "10px", border: "1px solid #DFDFDF", transition: "0.2s ease-in-out", cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 4}}>
        {props.children}
    </Box>
  )
}
