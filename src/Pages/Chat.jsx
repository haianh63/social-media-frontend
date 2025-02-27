import {
  Avatar,
  Box,
  Input,
  ScrollArea,
  Text,
  Tooltip,
  Group,
  ActionIcon,
  Paper,
  Badge,
} from "@mantine/core";
import avatar from "../assets/avatar.jpg";
import { Search, Send, Smile, Paperclip, Mic } from "lucide-react";
import { SocketContext } from "../Context/SocketContext";
import { useContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import ChatBox from "../components/ChatBox";
const BASE_URL = import.meta.env.VITE_BASE_URL;
export default function Chat() {
  const [user, setUser] = useState(null);
  const socket = useContext(SocketContext);
  const userId = JSON.parse(localStorage.getItem("user")).userId;
  const [message, setMessages] = useState([]);
  useEffect(() => {
    if (socket) {
      socket.emit("joinRoom", userId.toString());
    }
  }, [socket]);

  const {
    status,
    data: chatUsers,
    error,
  } = useQuery({
    queryKey: ["chat-user", userId],
    queryFn: async () => {
      const token = JSON.parse(localStorage.getItem("user")).token;
      const response = await fetch(`${BASE_URL}/chat`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      return data.data;
    },
  });
  return (
    <Box h="100vh" bg="gray.0" p="md" style={{ display: "flex" }} mt="lg">
      {/* Sidebar */}
      <Box w={300} bg="white" p="sm" style={{ borderRadius: "12px" }}>
        <ScrollArea h={500}>
          {chatUsers &&
            chatUsers.map((chatUser) => {
              let avatar_src;
              if (chatUser.avatar_src === null) {
                avatar_src = avatar;
              } else {
                avatar_src = chatUser.avatar_src;
              }
              return (
                <Group
                  key={chatUser.receiver_id}
                  position="apart"
                  mb="sm"
                  className="hover:bg-gray-200 p-2 rounded-xl cursor-pointer"
                  onClick={() => setUser(chatUser.user_id)}
                >
                  <Group>
                    <Avatar radius="xl" src={avatar_src} />
                  </Group>
                  <Text>{chatUser.name}</Text>
                </Group>
              );
            })}
        </ScrollArea>
      </Box>

      {/* Chat Window */}
      <Box
        flex={1}
        bg="white"
        p="md"
        ml="md"
        style={{
          borderRadius: "12px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {user && socket && (
          <ChatBox sender_id={userId} receiver_id={user} socket={socket} />
        )}
      </Box>
    </Box>
  );
}
