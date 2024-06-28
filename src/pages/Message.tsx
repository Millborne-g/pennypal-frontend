import{ useState, useEffect, useRef } from "react";

// MUI imports
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Grid, IconButton, Stack } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

// redux
import { useSelector } from "react-redux";

// hooks
import { useMessage } from "../redux/hooks/use-message";
import { useUser } from "../redux/hooks/use-user";

// dotenv 

// socket
import io from "socket.io-client";
const { VITE_BACKEND_URL } = import.meta.env;
const socket = io(VITE_BACKEND_URL);

// components
import { SpacedContainer } from "../components/containers/SpacedContainer";
import PageContainer from "../components/containers/PageContainer";

interface userData {
    _id: number | string;
    email: string;
    password: number;
    fullName: string;
    firstName: string;
    lastName: string;
    userImage: string;
}

interface messageData {
    _id: number | string;
    content: string;
    senderEmail: string;
    recipientEmail: string;
    date: Date;
}

export const Message = () => {
    const [messages, setMessages] = useState<messageData[]>([]);
    const [users, setUsers] = useState<userData[]>([]);
    const [inputRecipient, setInputRecipient] = useState("");
    const [recipient, setRecipient] = useState<userData | null>(null);
    const [sendMessage, setSendMessage] = useState("");
    const userDetails = useSelector((state: any) => state.user.user);

    const boxRef = useRef<HTMLDivElement>(null);

    const {
        usersMessages,
        addMessage,
        refetchMessages,
    } = useMessage({
        senderEmail: userDetails.email,
        recipientEmail: recipient?.email,
    });

    const { allUsers } = useUser();
    const handleSubmitMessage = async (event: any) => {
        event.preventDefault();

        const newData = {
            content: sendMessage,
            senderEmail: userDetails.email,
            recipientEmail: recipient?.email,
        };

        if (recipient && sendMessage) {
            await addMessage(newData);
            socket.emit("sendMessage", {
                name: userDetails.fullName,
                message: sendMessage,
            });
            refetchMessages();
            setSendMessage("");
        }
    };

    const scrollToBottom = () => {
        if (boxRef.current) {
            const box = boxRef.current;
            box.scrollTop = box.scrollHeight;
        }
    };

    // Function to format date
    const formatDate = (dateString: Date) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString(); // Format the date as needed
        const formattedTime = date.toLocaleTimeString(); // Format the time as needed
        return `${formattedDate} ${formattedTime}`;
    };

    useEffect(() => {
        socket.on("receiveMessage", () => {
            refetchMessages();
        });
    }, [socket]);

    useEffect(() => {
        if (allUsers) {
            let exceptUser = allUsers.filter(
                (item) => item._id !== userDetails._id
            );
            setUsers(exceptUser);
        }
    }, [allUsers]);

    useEffect(() => {
        if (usersMessages) {
            setMessages(usersMessages);
        }
    }, [usersMessages]);

    useEffect(() => {
        if (messages) {
            scrollToBottom();
        }
    }, [messages]);

    return (
        <>
            <Box sx={{ height: "100vh" }}>
                <CssBaseline />
                <PageContainer>
                    <SpacedContainer>
                        <Typography fontSize={30} fontWeight={700} gutterBottom>
                            Message
                        </Typography>
                    </SpacedContainer>
                    <Divider />
                    <br />
                    <Grid
                        container
                        sx={{
                            bgcolor: "#FFF",
                            // display: "flex",
                            height: "90%",
                            borderRadius: "10px",
                        }}
                    >
                        <Grid
                            item
                            xs={12}
                            sm={4}
                            sx={{
                                height: 1,
                                display: {
                                    sm: "block",
                                    xs: !recipient ? "block" : "none",
                                },
                            }}
                        >
                            <Stack direction="row" sx={{ height: 1, width: 1 }}>
                                <Stack
                                    gap={2}
                                    sx={{
                                        p: 3,
                                        width: 1,
                                        height: 1,
                                    }}
                                >
                                    <Box sx={{ width: 1 }}>
                                        <Autocomplete
                                            disablePortal
                                            options={
                                                inputRecipient ? users : []
                                            }
                                            getOptionLabel={(option) =>
                                                option.fullName
                                            }
                                            fullWidth
                                            onInputChange={(
                                                _,
                                                newInputValue
                                            ) => {
                                                setInputRecipient(
                                                    newInputValue
                                                );
                                            }}
                                            inputValue={inputRecipient}
                                            onChange={(
                                                _,
                                                newValue: userData | null
                                            ) => {
                                                if (newValue) {
                                                    setRecipient(newValue);
                                                } else {
                                                    setRecipient(null);
                                                }
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <SearchIcon />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    placeholder="Search"
                                                />
                                            )}
                                            popupIcon={null}
                                            clearIcon={null}
                                            noOptionsText={
                                                inputRecipient
                                                    ? "No user found."
                                                    : ""
                                            }
                                        />
                                    </Box>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            py: 1,
                                            gap: 1,
                                            // overflowY: "auto",
                                            height: "90%",
                                            width: 1,
                                        }}
                                    >
                                        {users.map((user, index) => (
                                            <Stack
                                                key={index}
                                                direction="row"
                                                alignItems="center"
                                                gap={1}
                                                p={1}
                                                borderRadius={2}
                                                sx={{
                                                    "&:hover": {
                                                        bgcolor: "#F5F5F5",
                                                        cursor: "pointer",
                                                    },
                                                    width: 1,
                                                }}
                                                bgcolor={
                                                    user._id === recipient?._id
                                                        ? "#F5F5F5"
                                                        : ""
                                                }
                                                onClick={() => {
                                                    setRecipient(user);
                                                }}
                                            >
                                                <Stack>
                                                    <Avatar
                                                        alt={user.fullName}
                                                        src={user.userImage}
                                                        // sx={{
                                                        //     width: 56,
                                                        //     height: 56,
                                                        // }}
                                                    />
                                                </Stack>
                                                <Stack
                                                    direction="column"
                                                    sx={{ width: "80%" }}
                                                >
                                                    <Typography
                                                        variant="subtitle1"
                                                        width="100%"
                                                        noWrap
                                                    >
                                                        {user.fullName}
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        width="100%"
                                                        noWrap
                                                        color="#9e9e9e"
                                                    >
                                                        {user.email}
                                                    </Typography>
                                                </Stack>
                                                {/* <Box>
                                                    <FiberManualRecordIcon fontSize="small" color="success"/>
                                                </Box> */}
                                            </Stack>
                                        ))}
                                    </Box>
                                </Stack>
                                <Divider
                                    orientation="vertical"
                                    flexItem
                                    sx={{
                                        display: {
                                            xs: "none",
                                            sm: "block",
                                        },
                                    }}
                                />
                            </Stack>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={8}
                            sx={{
                                height: 1,
                                display: {
                                    sm: "block",
                                    xs: recipient ? "block" : "none",
                                },
                            }}
                        >
                            <Box sx={{ height: 1, width: 1 }}>
                                {recipient ? (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            height: 1,
                                            width: 1,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                p: 3,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "10px",
                                                }}
                                            >
                                                <Box>
                                                    <IconButton
                                                        aria-label="back"
                                                        size="small"
                                                        sx={{
                                                            display: {
                                                                xs: "block",
                                                                sm: "none",
                                                            },
                                                        }}
                                                        onClick={() =>
                                                            setRecipient(null)
                                                        }
                                                    >
                                                        <ArrowBackIosNewIcon />
                                                    </IconButton>
                                                </Box>
                                                <Box>
                                                    <Avatar
                                                        alt={
                                                            recipient?.fullName
                                                        }
                                                        src={
                                                            recipient?.userImage
                                                        }
                                                    />
                                                </Box>
                                                <Typography variant="subtitle1">
                                                    {recipient?.fullName}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Divider />
                                        <Box
                                            ref={boxRef}
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                flexGrow: 1,
                                                p: 2,
                                                overflowY: "auto",
                                                "&::-webkit-scrollbar": {
                                                    width: "8px",
                                                },
                                                "&::-webkit-scrollbar-thumb": {
                                                    backgroundColor: "#888",
                                                    borderRadius: "4px",
                                                },
                                                "&::-webkit-scrollbar-thumb:hover":
                                                    {
                                                        backgroundColor: "#555",
                                                    },
                                                "&::-webkit-scrollbar-track": {
                                                    backgroundColor: "#f1f1f1",
                                                },
                                            }}
                                        >
                                            <Box>
                                                {messages.map(
                                                    (message, index) => (
                                                        <Box
                                                            key={index}
                                                            sx={{
                                                                display: "flex",
                                                                flexDirection:
                                                                    "column",
                                                                mb: 1,
                                                                alignItems:
                                                                    message.senderEmail !==
                                                                    userDetails.email
                                                                        ? "flex-start"
                                                                        : "flex-end",
                                                            }}
                                                        >
                                                            <Box
                                                                sx={{
                                                                    // display: "inline-block",
                                                                    bgcolor:
                                                                        message.senderEmail !==
                                                                        userDetails.email
                                                                            ? "#e0e0e0"
                                                                            : "primary.light",
                                                                    borderRadius: 5,
                                                                    p: 3,
                                                                    maxWidth:
                                                                        "60%",
                                                                    color:
                                                                        message.senderEmail !==
                                                                        userDetails.email
                                                                            ? "none"
                                                                            : "#FFFFFF",
                                                                }}
                                                            >
                                                                <Typography>
                                                                    {
                                                                        message.content
                                                                    }
                                                                </Typography>
                                                            </Box>
                                                            <Box>
                                                                <Typography variant="caption">
                                                                    {formatDate(
                                                                        message.date
                                                                    )}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    )
                                                )}
                                            </Box>
                                        </Box>
                                        <Divider />
                                        <form
                                            onSubmit={(e: any) =>
                                                handleSubmitMessage(e)
                                            }
                                        >
                                            <Box
                                                sx={{
                                                    p: "5px 10px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "15px",
                                                    py: 2,
                                                }}
                                            >
                                                <TextField
                                                    value={sendMessage}
                                                    fullWidth
                                                    label="Message"
                                                    variant="filled"
                                                    onChange={(e) =>
                                                        setSendMessage(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <Button
                                                    variant="contained"
                                                    size="large"
                                                    sx={{
                                                        height: "60px",
                                                        width: "100px",
                                                    }}
                                                    onClick={
                                                        handleSubmitMessage
                                                    }
                                                >
                                                    <SendIcon />
                                                </Button>
                                            </Box>
                                        </form>
                                    </Box>
                                ) : (
                                    <Stack
                                        height={1}
                                        justifyContent="center"
                                        alignItems="center"
                                        gap={2}
                                    >
                                        <SentimentVeryDissatisfiedIcon
                                            sx={{
                                                fontSize: 100,
                                                color: "primary",
                                            }}
                                        />
                                        Select a user
                                    </Stack>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </PageContainer>
            </Box>
        </>
    );
};
