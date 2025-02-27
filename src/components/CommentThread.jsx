import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Group,
  Text,
  Textarea,
  Stack,
} from "@mantine/core";
import {
  MessageCircle,
  Send,
  ChevronDown,
  ChevronUp,
  Trash,
} from "lucide-react";
import { hasJWT } from "../../utils";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const CommentThread = ({ comment, onReply, onDelete }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);

  return (
    <Box ml={comment.parent_comment_id ? 20 : 0} py={10}>
      {/* Comment */}
      <Group align="flex-start">
        <Avatar src={comment.avatar_src} radius="xl" />
        <Stack spacing={4} style={{ flex: 1 }}>
          <Group spacing="xs">
            <Text weight={600}>{comment.name}</Text>
            <Text size="xs" c="dimmed">
              {new Date(comment.created_at).toLocaleString()}
            </Text>
          </Group>
          <Text>{comment.content}</Text>

          {/* Reply Button */}
          <Group spacing="xs">
            {hasJWT() && (
              <Button
                size="xs"
                variant="subtle"
                leftSection={<MessageCircle size={14} />}
                onClick={() => setReplying(!replying)}
              >
                Reply
              </Button>
            )}
            {comment.replies && comment.replies.length > 0 && (
              <Button
                size="xs"
                variant="subtle"
                leftSection={
                  showReplies ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )
                }
                onClick={() => setShowReplies(!showReplies)}
              >
                {showReplies
                  ? "Hide Replies"
                  : `View Replies (${comment.replies.length})`}
              </Button>
            )}

            {hasJWT() &&
              JSON.parse(localStorage.getItem("user")).userId ===
                comment.user_id && (
                <Button
                  size="xs"
                  variant="subtle"
                  leftSection={<Trash size={14} />}
                  onClick={() => onDelete(comment.comment_id)}
                >
                  Delete
                </Button>
              )}
          </Group>

          {/* Reply Input */}
          {replying && (
            <Box mt={5}>
              <Textarea
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <Group mt={5}>
                <Button
                  size="xs"
                  onClick={() => {
                    onReply(comment.comment_id, replyText);
                    setReplyText("");
                    setReplying(false);
                  }}
                >
                  <Send size={14} /> Send
                </Button>
                <Button
                  size="xs"
                  variant="subtle"
                  onClick={() => setReplying(false)}
                >
                  Cancel
                </Button>
              </Group>
            </Box>
          )}
        </Stack>
      </Group>

      {/* Nested Replies */}
      {showReplies && comment.replies && (
        <Stack mt={10}>
          {comment.replies.map((reply) => (
            <CommentThread
              key={reply.comment_id}
              comment={reply}
              onReply={onReply}
              onDelete={onDelete}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default CommentThread;
