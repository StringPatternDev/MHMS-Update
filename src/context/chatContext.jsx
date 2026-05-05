import { createContext, useContext, useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  doc,
  setDoc,
  addDoc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  getDocs,
  where,
} from "firebase/firestore";
import { useUser } from "./userContext";

const ChatContext = createContext();
export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const { isDoctor } = useUser();
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate chatId from userId + doctorId
  const generateChatId = (userId, doctorId) =>
    userId > doctorId ? `${doctorId}_${userId}` : `${userId}_${doctorId}`;

  // Select a user to chat with
  const selectUser = async (user) => {
    setLoading(true);
    setError(null);

    try {
      const currentUid = auth.currentUser.uid;
      let userId, doctorId;

      if (isDoctor) {
        doctorId = currentUid;
        userId = user.id;
      } else {
        userId = currentUid;
        doctorId = user.id;
      }

      const id = generateChatId(userId, doctorId);
      setSelectedUser(user);
      setChatId(id);

      // If chat does not exist → create it
      const chatRef = doc(db, "chats", id);
      const chatSnap = await getDoc(chatRef);
      if (!chatSnap.exists()) {
        await setDoc(chatRef, {
          userId,
          doctorId,
          createdAt: serverTimestamp(),
        });
      }
    } catch (err) {
      console.error("Error selecting user:", err);
      setError("Could not start chat");
    } finally {
      setLoading(false);
    }
  };

  // Real-time message listener
  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      },
      (err) => {
        console.error("Realtime listener error:", err);
        setError("Could not load messages");
      }
    );

    return unsubscribe;
  }, [chatId]);

  // Send a text message
  const sendMessage = async (text) => {
    if (!chatId || text.trim() === "") return;
    setLoading(true);
    setError(null);

    try {
      await addDoc(collection(db, "chats", chatId, "messages"), {
        type: "text",
        text,
        senderId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  // Send a file message (Cloudinary upload)
  const sendFileMessage = async (file) => {
    if (!selectedUser) return;
    setLoading(true);
    setError(null);

    try {
      // Convert file → base64
      const reader = new FileReader();
      const fileBase64 = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Upload to Cloudinary (via serverless function)
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: fileBase64 }),
      });

      if (!response.ok) throw new Error("Upload failed");

      const { url } = await response.json();

      // Detect type
      let fileType = "file";
      if (file.type.startsWith("image/")) fileType = "image";
      if (file.type === "application/pdf") fileType = "pdf";

      // Save to Firestore
      await addDoc(collection(db, "chats", chatId, "messages"), {
        type: fileType,
        fileUrl: url,
        fileName: file.name,
        senderId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Error sending file:", err);
      setError("Failed to send file");
    } finally {
      setLoading(false);
    }
  };

  // Get list of people current user has chatted with
  const getPreviousChats = async () => {
    setLoading(true);
    setError(null);

    try {
      const currentUid = auth.currentUser.uid;
      const chatsRef = collection(db, "chats");

      let q;
      if (isDoctor) {
        q = query(chatsRef, where("doctorId", "==", currentUid));
      } else {
        q = query(chatsRef, where("userId", "==", currentUid));
      }

      const snapshot = await getDocs(q);
      const ids = snapshot.docs.map((doc) => {
        const data = doc.data();
        return isDoctor ? data.userId : data.doctorId;
      });

      return ids; // array of userIds or doctorIds
    } catch (err) {
      console.error("Error fetching previous chats:", err);
      setError("Failed to load previous chats");
      return [];
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        selectedUser,
        messages,
        selectUser,
        sendMessage,
        sendFileMessage,
        getPreviousChats,
        loading,
        error,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
