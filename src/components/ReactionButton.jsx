import { Popover, Button, Group, ActionIcon } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ThumbsUp, Heart, Smile, Frown } from "lucide-react";
import { hasJWT } from "../../utils";
import { useState } from "react";

const BASE_URL = import.meta.env.VITE_BASE_URL;
export default function ReactionButton({ postId, reacts }) {
  const iconList = [
    { icon: <ThumbsUp size={16} />, text: "Like" },
    { icon: <Heart size={16} />, text: "Love" },
    { icon: <Smile size={16} />, text: "Haha" },
    { icon: <Frown size={16} />, text: "Sad" },
  ];

  const checkReaction = () => {
    if (!hasJWT()) return null;

    const userId = JSON.parse(localStorage.getItem("user")).userId;
    for (let i = 0; i < reacts.length; ++i) {
      if (reacts[i].user_id == userId) {
        return reacts[i].reaction_id;
      }
    }
    return null;
  };

  const reaction = checkReaction();
  const [hasReaction, setHasReaction] = useState(reaction);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ postId, reactionId }) => {
      setHasReaction(reactionId);
      const token = JSON.parse(localStorage.getItem("user")).token;
      const response = await fetch(`${BASE_URL}/post/react`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postId, reactionId }),
      });

      const data = await response.json();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post_react", postId] });
    },
  });

  const handleReact = (reactionId) => {
    if (hasJWT()) {
      mutation.mutate({ postId, reactionId });
    }
  };
  return (
    <Popover>
      <Popover.Target>
        <Button
          variant={hasReaction === null ? "default" : "filled"}
          leftSection={
            !hasReaction ? <ThumbsUp size={16} /> : iconList[hasReaction].icon
          }
        >
          {!hasReaction ? "Like" : iconList[hasReaction].text}
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Group>
          {iconList.map((item, idx) => (
            <Button
              key={item.text}
              variant={hasReaction === idx ? "filled" : "default"}
              onClick={() => {
                handleReact(idx);
              }}
            >
              {item.icon}
            </Button>
          ))}
        </Group>
      </Popover.Dropdown>
    </Popover>
  );
}
