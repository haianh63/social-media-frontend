import { Avatar, Box, Group, Title } from "@mantine/core";
import { Link } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const UserCard = ({ name, avatar_src, user_id }) => {
  return (
    <Box
      className="w-[100%] bg-neutral-200 px-2 py-4 rounded-xl cursor-pointer my-0.5 flex hover:bg-neutral-300"
      component={Link}
      to={`/profile/${user_id}`}
    >
      <Group align="center">
        <Avatar src={`${BASE_URL}/${avatar_src}`} size={50} radius="xl" />
        <Box>
          <Title order={5}>{name}</Title>
        </Box>
      </Group>
    </Box>
  );
};

export default UserCard;
