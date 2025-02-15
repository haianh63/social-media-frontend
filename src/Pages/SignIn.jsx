import { useMutation } from "@tanstack/react-query";
import Form from "../components/Form";
import { Navigate } from "react-router-dom";
const BASE_URL = "http://localhost:3000";

export default function SignIn() {
  const mutation = useMutation({
    mutationFn: async (userInfo) => {
      const response = await fetch(`${BASE_URL}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.data);
      }

      const token = data.data;
      localStorage.setItem("token", token);
      return data;
    },
  });
  const handleSignIn = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData);
    mutation.mutate(formValues);
  };
  return (
    <section className="flex flex-col items-center pt-6">
      <div className="w-full bg-white rounded-lg shadow-xl md:mt-0 sm:max-w-md xl:p-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
            Sign In
          </h1>

          {mutation.isPending && (
            <p className="block mb-2 text-sm font-medium text-gray-900">
              Sign in...
            </p>
          )}
          {mutation.isError && (
            <p className="block mb-2 text-sm font-medium text-gray-900">
              An error occured: {mutation.error.message}
            </p>
          )}
          {mutation.isSuccess && <Navigate to="/" />}
          <Form isSignUp={false} handleSubmit={handleSignIn} />
        </div>
      </div>
    </section>
  );
}
