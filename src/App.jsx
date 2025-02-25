import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import Home from "./Pages/Home";
import RouteGuard from "./components/RouteGuard";
import Profile from "./Pages/Profile";
import Search from "./Pages/Search";
import { MantineProvider } from "@mantine/core";
import { SocketContext } from "./Context/SocketContext";
import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import { socket } from "../utils";
import Chat from "./Pages/Chat";
import Layout from "./components/Layout";

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <SocketContext.Provider value={socket}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route
                  index
                  element={
                    <RouteGuard>
                      <Home />
                    </RouteGuard>
                  }
                />
                <Route path="signIn" element={<SignIn />} />
                <Route path="signUp" element={<SignUp />} />
                <Route path="profile/:userId" element={<Profile />} />
                <Route
                  path="chat"
                  element={
                    <RouteGuard>
                      <Chat />
                    </RouteGuard>
                  }
                />
                <Route path="user/search" element={<Search />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </SocketContext.Provider>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
