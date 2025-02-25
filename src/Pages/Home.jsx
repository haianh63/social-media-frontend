import { useQuery } from "@tanstack/react-query";
import Post from "../components/Post";

const BASE_URL = import.meta.env.VITE_BASE_URL;
export default function Home() {
  const { data, isError, isPending, error } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/post`);
      const data = await response.json();
      return data.data;
    },
  });

  if (isPending) {
    return <h1>Fetching Data...</h1>;
  }

  if (isError) {
    return <h1>An error has occured: {error.message}</h1>;
  }
  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="pt-16">
        <div className="mt-6 flex flex-col items-center">
          {/* Main Content / Posts */}
          <div className="lg:col-span-2 w-full sm:w-3/4 lg:w-5/12">
            {data.map(
              ({
                post_id,
                img_src,
                content,
                created_at,
                avatar_src,
                user_id,
              }) => (
                <Post
                  key={`post-${post_id}`}
                  avatar={`${BASE_URL}/${avatar_src}`}
                  userId={user_id}
                  postId={post_id}
                  image={`${BASE_URL}/${img_src}`}
                  content={content}
                  created_at={created_at}
                />
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
