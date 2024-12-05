import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import axios from "axios";

function Sidebar() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState("");
  const [userColor, setUserColor] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/login");
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/user`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setUser(res.data.user.name);
          setUserColor(res.data.user.color.toLowerCase());
          console.log("color: ", userColor);
        } catch (error) {
          console.error("Error fetching user details:", error);
        } finally {
          setLoading(false); // Set loading to false after data is fetched
        }
      } else {
        setLoading(false); // No token, skip loading
      }
    };

    fetchUser();
  }, []);

  // If loading, render a loader
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative flex">
      {/* Overlay for mobile devices */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-50 opacity-50 z-30 sm:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        onClick={toggleSidebar}
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="default-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div
          className={`h-full px-3 py-4 overflow-y-auto bg-${userColor}-500 dark:bg-${userColor}-500`}
        >
          <ul className="space-y-2 font-medium">
            <li>
              <a
                href="#"
                className={`flex items-center p-2 font-bold text-xl text-gray-900 rounded-lg dark:text-white hover:bg-${userColor}-900 dark:hover:bg-${userColor}-900 group`}
              >
                <svg
                  className="w-9 h-9 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 21"
                >
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                </svg>
                <span className="ms-3">{user}</span>
              </a>
            </li>
            <li>
              <button
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-red-400 group w-full"
                onClick={handleLogout}
              >
                <svg
                  className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M16 13v-2H7V8l-5 4 5 4v-3h9zM20 3H9c-1.103 0-2 .897-2 2v4h2V5h11v14H9v-4H7v4c0 1.103.897 2 2 2h11c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2z" />
                </svg>
                <span className="ms-3">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;
