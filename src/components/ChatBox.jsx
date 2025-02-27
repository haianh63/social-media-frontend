import { useQuery } from "@tanstack/react-query";
import {
  Text,
  ScrollArea,
  Paper,
  Group,
  Avatar,
  Box,
  Tooltip,
  Input,
  ActionIcon,
} from "@mantine/core";

import { Paperclip, Mic, Send } from "lucide-react";
import { useState, useEffect } from "react";
const BASE_URL = import.meta.env.VITE_BASE_URL;
export default function ChatBox({
  sender_id,
  receiver_id,
  socket = { socket },
}) {
  const [message, setMessage] = useState("");
  const [msgList, setMsgList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const token = JSON.parse(localStorage.getItem("user"))?.token;
        const response = await fetch(`${BASE_URL}/chat/${receiver_id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setMsgList(() => [...data.data]);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
    socket.on("receive-message", (message) => {
      setMsgList((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, [receiver_id, socket]);

  const handleSendMessage = ({
    sender_id,
    receiver_id,
    content,
    name,
    avatar_src,
  }) => {
    if (!receiver_id.toString().trim() || !content.toString().trim()) return;
    socket.emit("sendMessage", {
      sender_id: sender_id.toString(),
      receiver_id: receiver_id.toString(),
      content: content.toString(),
      name: name.toString(),
      avatar_src: avatar_src.toString(),
    });
  };

  if (isLoading) {
    return <>Loading....</>;
  }

  return (
    <>
      <Text weight={600} size="lg" mb="xs">
        Chat
      </Text>
      <ScrollArea style={{ flex: 1 }}>
        {msgList.map((chat, idx) => {
          return (
            <Paper key={idx} shadow="xs" p="sm" mb="sm" radius="md">
              <Group
                justify={chat.sender_id === sender_id ? "flex-end" : undefined}
              >
                <Avatar radius="xl" src={chat.avatar_src} />
                <Box>
                  <Text weight={500}>{chat.name}</Text>
                  <Text size="sm">{chat.content}</Text>
                </Box>
              </Group>
            </Paper>
          );
        })}

        {/* More messages can be added here */}
      </ScrollArea>
      <Group mt="md" spacing="xs">
        <Input
          placeholder="Your message"
          flex={1}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Tooltip label="Send">
          <ActionIcon
            color="blue"
            onClick={() => {
              const sendObj = {
                sender_id,
                receiver_id,
                name: JSON.parse(localStorage.getItem("user")).name,
                avatar_src: JSON.parse(localStorage.getItem("user")).avatar_src,
                content: message,
              };
              handleSendMessage(sendObj);
              setMsgList((prev) => [...prev, sendObj]);
              setMessage("");
            }}
          >
            <Send size={18} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </>
  );
}
