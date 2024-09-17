import React from "react";

import { Box, CssBaseline, Divider, Grid, Stack, Typography } from "@mui/material";

import PageContainer from "../components/containers/PageContainer";
import { SpacedContainer } from "../components/containers/SpacedContainer";

export const Plan = () => {
    return (
        <Box sx={{ height: "100vh" }}>
            <CssBaseline />
            <PageContainer height={"85%"}>
                <SpacedContainer>
                    <Typography fontSize={30} fontWeight={700} gutterBottom>
                        Plan Budget
                    </Typography>
                </SpacedContainer>
                <Divider />
                <Stack
                    alignItems={"center"}
                    justifyContent={"center"}
                    height={1}
                >
                    <Typography textAlign={"center"}>
                        Plan your budget to refine your spending and boost your
                        savings.
                    </Typography>
                </Stack>
            </PageContainer>
        </Box>
    );
};
