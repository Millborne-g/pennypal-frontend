// mui
import { Box, Button, CssBaseline, Divider, Stack, Typography } from "@mui/material";

// components
import PageContainer from "../components/containers/PageContainer";
import { SpacedContainer } from "../components/containers/SpacedContainer";

// Assets
import planBudget from "../assets/planBudget.svg";

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
                    gap={2}
                >
                    <Stack
                        alignItems={"center"}
                        justifyContent={"center"}
                        gap={1}
                    >
                        <Box
                            minHeight={"100px"}
                            maxHeight={"300px"}
                            minWidth={"100px"}
                            maxWidth={"300px"}
                        >
                            <img
                                src={planBudget}
                                alt=""
                                width={"100%"}
                                height={"100%"}
                            />
                        </Box>
                        <Typography textAlign={"center"}>
                            Plan your budget to refine your spending and boost
                            your savings.
                        </Typography>
                    </Stack>
                    <Stack>
                        <Button variant="contained">Plan Now</Button>
                    </Stack>
                </Stack>
            </PageContainer>
        </Box>
    );
};
