import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // flag state is used to update the UI based on the login state
  //  -1: Initial or reset state (no login attempt yet or after input changes).
  //   0: Login successful.
  //   1: Login failed.
  const [flag, setFlag] = useState(-1);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setFlag(-1);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setFlag(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/login?email=${email}&password=${password}`
      );
      console.log(res);
      if (res.data.token) {
        console.log("Login Succesful");
        console.log(res.data.token);
        localStorage.setItem("jwtToken", res.data.token);

        setFlag(0);
      } else {
        setFlag(1);
      }
      // console.log("Login successful:", res.data.email);
    } catch (error) {
      console.log("Login failed:", error.message);
    }
  };
  const navigate = useNavigate(); // Hook for navigation

  // checks whether there is a jwt token stored in the local storage
  // if a token exists, it means the user has logged in previously, so it directly redirects to the homepa
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <section className="bg-gray-50 dark:bg-gray-900 font-sans">
      {flag == 0 && <Navigate to="/" />}
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <div className="text-6xl font-bold text-white text-center tracking-tighter">
            FullToss
          </div>
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Login to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />

                {flag === 1 && (
                  <p className="text-red-300">Incorrect Password/Username</p>
                )}
              </div>
              <button
                type="submit"
                style={{ zIndex: 10, position: "relative" }}
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Login
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Sign up here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
