import { io } from "socket.io-client";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const hasJWT = () => {
  let flag = false;
  const user = JSON.parse(localStorage.getItem("user"));
  const now = new Date();

  if (user && now.getTime() < user.expiry) {
    flag = true;
  } else {
    flag = false;
    localStorage.removeItem("user");
  }
  return flag;
};

const socket = io(BASE_URL);

export { hasJWT, BASE_URL, socket };
