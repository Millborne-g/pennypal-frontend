import { ReactNode } from "react";
import Box from "@mui/material/Box";

export const CenteredPageContainer = (props : {children: ReactNode}) => {
  return (
    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', 
      height: {
        sm: '100vh',
        xs: '800px'
      } 
      }}>
        {props.children}
    </Box>
  )
}
