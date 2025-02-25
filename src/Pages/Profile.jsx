import { MessageCircleIcon as Message, UserPlus, Pencil } from "lucide-react";
import avatar from "../assets/avatar.jpg";
import wallpaper from "../assets/wallpaper.jpg";
import { useParams } from "react-router-dom";
import { BASE_URL, hasJWT } from "../../utils";
import { useQueries } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import EditProfileForm from "../components/EditProfileForm";
import CreatePostForm from "../components/CreatePostForm";
import Post from "../components/Post";
export default function Profile() {
  const [
    editProfileModalOpened,
    { open: openEditProfileModal, close: closeEditProfileModal },
  ] = useDisclosure(false);

  const [
    createPostModalOpened,
    { open: openCreatePostModal, close: closeCreatePostModal },
  ] = useDisclosure(false);
  const userId = useParams().userId;
  const result = useQueries({
    queries: [
      {
        queryKey: ["user", userId],
        queryFn: async () => {
          const response = await fetch(`${BASE_URL}/user/${userId}`);
          const data = await response.json();
          const user = data.data;
          return user;
        },
      },
      {
        queryKey: ["post", userId],
        queryFn: async () => {
          const response = await fetch(`${BASE_URL}/post/${userId}`);
          const data = await response.json();
          const posts = data.data;
          return posts;
        },
      },
    ],
  });

  const [userQuery, postQuery] = result;

  if (userQuery.isPending || postQuery.isPending) {
    return <h1>Fetching Data...</h1>;
  }

  if (userQuery.isError) {
    return <h1>An error occured: {userQuery.error.message}</h1>;
  }

  if (postQuery.isError) {
    return <h1>An error occured: {postQuery.error.message}</h1>;
  }

  if (userQuery.data === null) {
    return <Navigate to="/" replace />;
  }
  const cover_src =
    userQuery.data.cover_src === null
      ? wallpaper
      : `${BASE_URL}/${userQuery.data.cover_src}`;
  const avatar_src =
    userQuery.data.avatar_src === null
      ? avatar
      : `${BASE_URL}/${userQuery.data.avatar_src}`;
  return (
    <div className="bg-gray-100 min-h-screen">
      <EditProfileForm
        userId={userId}
        nameValue={userQuery.data.name}
        avatar_src={avatar_src}
        cover_src={cover_src}
        opened={editProfileModalOpened}
        onClose={closeEditProfileModal}
        title="Authentication"
        centered
      />
      <CreatePostForm
        userId={userId}
        opened={createPostModalOpened}
        onClose={closeCreatePostModal}
        title="Tạo bài viết"
        centered
        avatar_src={avatar_src}
      />

      {/* Main Content */}
      <main className="pt-16">
        {/* Cover Photo */}
        <div className="relative mx-auto w-11/12 xl:w-9/12  h-80 bg-gray-300 rounded-xl">
          <img
            src={cover_src}
            alt="Cover Photo"
            className="h-full w-full object-cover object-center rounded-xl"
          />
        </div>

        {/* Profile Info */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="sm:flex sm:items-end sm:space-x-5">
              <div className="relative -mt-24">
                <img
                  src={avatar_src}
                  alt="Profile Picture"
                  className="w-[168px] h-[168px] rounded-full ring-4 ring-white object-cover"
                />
              </div>
              <div className="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                <div className="sm:hidden md:block mt-6 min-w-0 flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 truncate">
                    {userQuery.data.name}
                  </h1>
                </div>
                <div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                  {hasJWT() &&
                    JSON.parse(localStorage.getItem("user")).userId !=
                      userId && (
                      <button
                        type="button"
                        className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Message
                          className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        <span>Message</span>
                      </button>
                    )}
                  {hasJWT() &&
                    JSON.parse(localStorage.getItem("user")).userId ==
                      userId && (
                      <button
                        onClick={openEditProfileModal}
                        type="button"
                        className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Pencil
                          className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        <span>Edit Profile</span>
                      </button>
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="mt-6 flex flex-col items-center">
            {/* Main Content / Posts */}
            <div className="lg:col-span-2 w-full lg:w-3/4">
              {/* Create Post */}
              {hasJWT() &&
                JSON.parse(localStorage.getItem("user")).userId == userId && (
                  <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex items-center space-x-4">
                      <img
                        src={avatar_src}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <button
                        onClick={openCreatePostModal}
                        type="button"
                        className="flex-grow bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        What's on your mind, John?
                      </button>
                    </div>
                  </div>
                )}

              {/* Sample Post */}
              {postQuery.data.map(
                ({ post_id, img_src, content, created_at }) => (
                  <Post
                    key={`post-${post_id}`}
                    avatar={avatar_src}
                    userId={userId}
                    postId={post_id}
                    image={`${BASE_URL}/${img_src}`}
                    content={content}
                    created_at={created_at}
                  />
                )
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
