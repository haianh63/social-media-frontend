import {
  Avatar,
  Box,
  Button,
  Group,
  Stack,
  Text,
  Image,
  Menu,
} from "@mantine/core";
import { ThumbsUp, MessageCircle, Share, Ellipsis } from "lucide-react";
import { hasJWT } from "../../utils";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import ReactionButton from "./ReactionButton";
import { useDisclosure } from "@mantine/hooks";
import Comment from "./Comment";
const BASE_URL = import.meta.env.VITE_BASE_URL;
export default function Post({
  avatar,
  content,
  image,
  created_at,
  postId,
  userId,
}) {
  const date = new Date(created_at);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ userId, postId }) => {
      const user = JSON.parse(localStorage.getItem("user"));
      console.log(`${BASE_URL}/post/${userId}/delete/${postId}`);
      return fetch(`${BASE_URL}/post/${userId}/delete/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", userId] });
    },
  });

  const handleDelete = () => {
    mutation.mutate({ userId, postId });
  };

  const { status, data, error } = useQuery({
    queryKey: ["post_react", postId],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/post/react/${postId}`);
      const data = await response.json();
      return data.data;
    },
  });
  const [opened, { open, close }] = useDisclosure();
  return (
    <Box bg="white" p="md" radius="md" shadow="sm" mb="lg">
      <Group justify="space-between" align="flex-start">
        <Group align="center" mb="sm">
          <Avatar src={avatar} radius="xl" />
          <Stack spacing={0}>
            <Text size="sm" weight={500}>
              John Doe
            </Text>
            <Text size="xs" c="gray.6">
              {date.toDateString()}
            </Text>
          </Stack>
        </Group>
        {hasJWT() &&
        JSON.parse(localStorage.getItem("user")).userId == userId ? (
          <Menu>
            <Menu.Target>
              <Ellipsis className="cursor-pointer" />
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item onClick={handleDelete}>Delete</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ) : (
          <></>
        )}
      </Group>

      {content && <Text mb="sm">{content}</Text>}

      {image && <Image src={image} alt="Image" radius="md" mb="sm" />}

      <Group position="apart" spacing="xs" grow>
        {status === "success" && data && (
          <ReactionButton postId={postId} reacts={data} />
        )}

        <Button
          leftSection={<MessageCircle size={16} />}
          variant="subtle"
          color="gray"
          onClick={open}
        >
          Comment
        </Button>
        <Button leftSection={<Share size={16} />} variant="subtle" color="gray">
          Share
        </Button>
      </Group>
      <Comment opened={opened} onClose={close} postId={postId} />
    </Box>
  );
}
