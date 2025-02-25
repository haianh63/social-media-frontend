import { Outlet, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Home,
  MessageCircleIcon as Message,
  Search,
  Users,
} from "lucide-react";
import { BASE_URL, hasJWT } from "../../utils";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Menu } from "@mantine/core";
export default function Layout() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const links = [
    {
      href: "/",
      icon: <Home className="w-6 h-6" />,
    },
    {
      href: "/chat",
      icon: <Message className="w-6 h-6" />,
    },
    {
      href: `/profile/${user?.userId}`,
      icon: <Users className="w-6 h-6" />,
    },
  ];

  const queryClient = useQueryClient();
  return (
    <>
      {hasJWT() && (
        <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-10">
          <div className="max-w-6xl mx-auto flex items-center justify-between p-2">
            <div className="flex items-center">
              <div className="relative">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (keyword !== "") {
                      navigate("/user/search?name=" + keyword);
                      setKeyword("");
                      await queryClient.invalidateQueries({
                        queryKey: ["search"],
                      });
                      await queryClient.refetchQueries({
                        queryKey: ["search"],
                      });
                    }
                  }}
                >
                  <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    type="text"
                    placeholder="Search Facebook"
                    className="bg-gray-100 rounded-full py-2 px-4 pl-10 w-60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-500 w-5 h-5" />
                </form>
              </div>
            </div>
            <nav className="hidden md:flex space-x-2">
              {links.map(({ href, icon }) => {
                return (
                  <Link
                    to={href}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                  >
                    {icon}
                  </Link>
                );
              })}
            </nav>
            <div className="flex items-center space-x-2">
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <img
                    src={`${BASE_URL}/${user?.avatar_src}`}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full cursor-pointer"
                  />
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item
                    onClick={() => {
                      localStorage.removeItem("user");
                      navigate("/signin");
                    }}
                  >
                    Log out
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </div>
          </div>
        </header>
      )}

      <div className="py-4">
        <Outlet />
      </div>
    </>
  );
}
