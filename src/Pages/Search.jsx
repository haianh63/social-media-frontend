import { useQuery } from "@tanstack/react-query";
import UserCard from "../components/UserCard";
import { useSearchParams } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_BASE_URL;
export default function Search() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("name");
  const { data, isError, isPending, error } = useQuery({
    queryKey: ["search"],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/user/search?name=${keyword}`);
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

  console.log(data);
  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="pt-16">
        <div className="mt-6 flex flex-col items-center">
          {/* Main Content / Posts */}
          <div className="lg:col-span-2 w-full sm:w-3/4 lg:w-5/12">
            {data.map(({ user_id, name, avatar_src }) => {
              return (
                <UserCard
                  key={user_id}
                  name={name}
                  avatar_src={avatar_src}
                  user_id={user_id}
                />
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
