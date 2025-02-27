import {
  Modal,
  Textarea,
  Group,
  Button,
  Avatar,
  Select,
  ActionIcon,
  LoadingOverlay,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Image, Send } from "lucide-react";
import { useState } from "react";
import ImageDropzone from "./ImageDropzone";
import { useMutation, useQueryClient } from "@tanstack/react-query";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function CreatePostModal({
  userId,
  onClose,
  avatar_src,
  ...props
}) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [opened, { open, close }] = useDisclosure(false);
  const [visible, { toggle }] = useDisclosure(false);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ content, image }) => {
      const user = JSON.parse(localStorage.getItem("user"));
      const formData = new FormData();
      formData.append("content", content);
      formData.append("image", image);

      toggle();
      return fetch(`${BASE_URL}/post/${user?.userId}/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
        body: formData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", userId] });
      setContent("");
      setImage(null);
      setImageFile(null);
      toggle();
      onClose();
    },
  });

  const handleDrop = (files) => {
    const file = files[0];
    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
    setImageFile(file);

    close();
  };

  const handleSubmit = () => {
    if (!content && !imageFile) {
      return;
    }
    mutation.mutate({ content, image: imageFile });
  };

  return (
    <Modal
      onClose={() => {
        setContent("");
        setImage(null);
        setImageFile(null);
        onClose();
      }}
      {...props}
    >
      <LoadingOverlay
        visible={visible}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <Group align="center" spacing="sm">
        <Avatar radius="xl" src={avatar_src} alt="user" />
        <div>
          <div style={{ fontWeight: "bold" }}>Ngo Hai Anh</div>
        </div>
      </Group>

      <Textarea
        placeholder="Bạn đang nghĩ gì?"
        autosize
        minRows={3}
        value={content}
        onChange={(event) => setContent(event.currentTarget.value)}
        my="md"
      />

      {image && <img src={image} alt="Image" className="w-full object-cover" />}

      <Group mt="md" spacing="xs" onClick={open}>
        <ActionIcon variant="subtle">
          <Image size={24} />
        </ActionIcon>
      </Group>

      <Button
        fullWidth
        mt="md"
        disabled={!content.trim() && !imageFile}
        leftSection={<Send size={16} />}
        onClick={handleSubmit}
      >
        Đăng
      </Button>
      <Modal opened={opened} onClose={close}>
        <ImageDropzone onDrop={handleDrop} />
      </Modal>
    </Modal>
  );
}
