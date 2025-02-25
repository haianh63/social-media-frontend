import { useEffect, useState } from "react";
import { Box, Group, Input, ScrollArea, Title, Button } from "@mantine/core";
import CommentThread from "../components/CommentThread";
import { hasJWT } from "../../utils";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [commentInput, setCommentInput] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/comment/${postId}`);
        const data = await response.json();
        setComments(organizeComments(data.data));
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const handleReply = async (commentId, text) => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      // Send new reply to backend and get actual comment_id
      const response = await fetch(`${BASE_URL}/comment/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("user")).token
          }`,
        },
        body: JSON.stringify({ parent_comment_id: commentId, content: text }),
      });

      const data = await response.json();
      if (data.success) {
        const newReply = data.data[0];
        newReply["name"] = user.userId;
        newReply["avatar_src"] = user.avatar_src;
        newReply["replies"] = [];
        setComments((prevComments) => {
          if (commentId === null) {
            return [...prevComments, newReply];
          }
          const updateReplies = (comment) => {
            if (comment.comment_id == commentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), newReply],
              };
            }
            return { ...comment, replies: comment.replies.map(updateReplies) };
          };

          return prevComments.map(updateReplies);
        });
      }
    } catch (error) {
      console.error("Error posting reply:", error);
    }
  };

  const handleDelete = async (commentId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    setComments((prevComments) => {
      const deleteComment = (comments) => {
        const commentsFilter = comments.filter(
          (comment) => comment.comment_id !== commentId
        );

        if (commentsFilter.length !== comments.length) {
          return [...commentsFilter];
        }

        comments.map(
          (comment) => (comment.replies = deleteComment(comment.replies))
        );
        return [...comments];
      };

      return [...deleteComment(prevComments)];
    });

    await fetch(`${BASE_URL}/comment/${postId}/${user.userId}/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  };

  return (
    <Box>
      <Title order={2}>Comments</Title>
      <ScrollArea h={250}>
        {isLoading ? (
          <p>Loading comments...</p>
        ) : (
          comments.map((comment) => (
            <CommentThread
              key={comment.comment_id}
              comment={comment}
              onReply={handleReply}
              onDelete={handleDelete}
            />
          ))
        )}
      </ScrollArea>
      {hasJWT() && (
        <Group>
          <Input
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Comment anything"
          />
          <Button
            onClick={() => {
              if (commentInput.trim() !== "") {
                handleReply(null, commentInput);
                setCommentInput("");
              }
            }}
          >
            Comment
          </Button>
        </Group>
      )}
    </Box>
  );
};

const organizeComments = (comments) => {
  const commentMap = new Map();
  comments.forEach((comment) => {
    commentMap.set(comment.comment_id, { ...comment, replies: [] });
  });
  const rootComments = [];
  comments.forEach((comment) => {
    if (comment.parent_comment_id === null) {
      rootComments.push(commentMap.get(comment.comment_id));
    } else {
      const parent = commentMap.get(comment.parent_comment_id);
      if (parent) {
        parent.replies.push(commentMap.get(comment.comment_id));
      }
    }
  });

  return rootComments;
};

export default CommentList;
