import { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useChat } from "../../context/chatContext";

const MessageInput = () => {
    const { sendMessage, sendFileMessage, loading } = useChat();
    const [text, setText] = useState("");

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (text.trim() === "") return;
        setText("");
        await sendMessage(text);
    };

    return (
        <Box
            component="form"
            onSubmit={handleSendMessage}
            display="flex"
            alignItems="center"
            p={1.5}
            borderTop="1px solid #ccc"
        >
            {/* Text input */}
            <TextField
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                fullWidth
                size="small"
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        handleSendMessage(e);
                    }
                }}
                sx={{ mr: 1 }}
            />

            {/* File upload */}
            <input
                type="file"
                accept="image/*,.pdf"
                style={{ display: "none" }}
                id="file-upload"
                disabled={loading}
                onChange={(e) => {
                    if (e.target.files[0]) {
                        sendFileMessage(e.target.files[0]);
                        e.target.value = "";
                    }
                }}
            />
            <label htmlFor="file-upload">
                <Button component="span" sx={{ minWidth: "40px", mr: 1 }} disabled={loading}>
                    <AttachFileIcon />
                </Button>
            </label>

            {/* Send button */}
            <Button
                type="submit"
                variant="contained"
                color="primary"
                endIcon={<SendIcon />}
                sx={{ minWidth: "90px" }}
                disabled={loading} // ✅ disable while sending
            >
                {loading ? "Sending..." : "Send"}
            </Button>
        </Box>

    );
}

export default MessageInput