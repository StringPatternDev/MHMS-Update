import { Box, Typography, Avatar, Paper, TextField, Button } from "@mui/material";
import { styled } from "@mui/system";
import { useChat } from "../../context/chatContext";
import { auth } from "../../firebase";

const MessageContainer = styled(Box)(({ sender }) => ({
  display: "flex",
  justifyContent: sender === "self" ? "flex-end" : "flex-start",
  alignItems: "flex-end",
  gap: "10px",
}));

const MessageBubble = styled(Paper)(({ theme, sender }) => ({
  maxWidth: "60%",
  padding: "10px 15px",
  borderRadius: "15px",
  backgroundColor:
    sender === "self"
      ? theme?.palette?.primary?.light || "#e3f2fd"
      : theme?.palette?.grey || "#f5f5f5",
  color:
    sender === "self"
      ? theme?.palette?.primary?.contrastText || "#000"
      : theme?.palette?.text?.primary || "#000",
}));

function formatTime(timestamp) {
  if (!timestamp) return "";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  return hours + ":" + minutes + " " + ampm;
}

// const MessageItem = ({message}) => {
//     const { selectedUser } = useChat();
//     const currentUid = auth.currentUser?.uid;
//     const sender =
//         message.senderId === currentUid ? "self" : "other";

//   return (
//     <MessageContainer key={message.id} sender={sender}>
//         {sender === "other" && (
//         <Avatar
//             alt={selectedUser.name}
//             src={selectedUser.photoURL || ""}
//         />
//         )}
//         <MessageBubble sender={sender}>
//         <Typography variant="body1">{message.text}</Typography>
//         <Typography variant="caption" color="textSecondary">
//             {formatTime(message.createdAt)}
//         </Typography>
//         </MessageBubble>
//         {sender === "self" && (
//         <Avatar alt="You" src={auth.currentUser.photoURL || ""} />
//         )}
//     </MessageContainer>
//   )
// }

const MessageItem = ({ message }) => {
  const { selectedUser } = useChat();
  const currentUid = auth.currentUser?.uid;
  const sender = message.senderId === currentUid ? "self" : "other";

  return (
    <MessageContainer key={message.id} sender={sender}>
      {sender === "other" && (
        <Avatar alt={selectedUser.name} src={selectedUser.photoURL || ""} />
      )}

      <MessageBubble sender={sender}>
        {/* Text message */}
        {message.text && (
          <Typography variant="body1">{message.text}</Typography>
        )}

        {/* Image message */}
        {message.type === "image" && (
          <Box sx={{ maxWidth: 250 }}>
            <img
              src={message.fileUrl}
              alt="sent"
              style={{ width: "100%", borderRadius: 8 }}
            />
            {message.fileName && (
              <Typography variant="caption" color="textSecondary">
                {message.fileName}
              </Typography>
            )}
          </Box>
        )}

        {/* PDF message */}
        {message.type === "pdf" && (
          <Box>
            <a
              href={message.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              📄 {message.fileName || "PDF File"}
            </a>
          </Box>
        )}

        {/* Timestamp */}
        <Typography
          variant="caption"
          color="textSecondary"
          sx={{ display: "block", mt: 0.5 }}
        >
          {formatTime(message.createdAt)}
        </Typography>
      </MessageBubble>

      {sender === "self" && (
        <Avatar alt="You" src={auth.currentUser.photoURL || ""} />
      )}
    </MessageContainer>
  );
};


export default MessageItem