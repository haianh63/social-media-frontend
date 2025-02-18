export default function Form({ isSignUp, handleSubmit }) {
  return (
    <form
      className="space-y-4 md:space-y-6"
      method="POST"
      onSubmit={handleSubmit}
    >
      {isSignUp && (
        <div>
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
            placeholder="erickson"
            required
          />
        </div>
      )}
      <div>
        <label
          htmlFor="username"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Username <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="username"
          id="username"
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
          placeholder="emelia_erickson24"
          required
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block mb-2 text-sm font-medium text-gray-900 "
        >
          Password <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="••••••••"
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
          required
        />
      </div>
      <button
        type="submit"
        class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      >
        {isSignUp ? "Create an account" : "Sign In"}
      </button>
      {isSignUp && (
        <p className="text-sm font-light text-gray-500 ">
          Already have an account?{" "}
          <a
            className="font-medium text-blue-600 hover:underline "
            href="/signin"
          >
            Sign in here
          </a>
        </p>
      )}

      {!isSignUp && (
        <p className="text-sm font-light text-gray-500 ">
          Do not have an account?{" "}
          <a
            className="font-medium text-blue-600 hover:underline "
            href="/signup"
          >
            Sign up here
          </a>
        </p>
      )}
    </form>
  );
}
