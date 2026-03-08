import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function Navbar() {
  const navigate = useNavigate();
  const [slideIn, setSlideIn] = useState(false);

  useEffect(() => setSlideIn(true), []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: slideIn ? 0 : -50, opacity: 1 }}
      transition={{ type: "spring", stiffness: 70, damping: 12 }}
      className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 shadow-xl p-4 flex justify-between items-center sticky top-0 z-50"
    >
      {/* Animated gradient text */}
      <motion.h1
        className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-400 to-pink-500"
        animate={{ x: [0, 5, 0], y: [0, 2, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
      >
        Notes App
      </motion.h1>

      <div className="flex gap-3">
        {/* Dark mode toggle */}
        <motion.button
          onClick={toggleDark}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white dark:bg-gray-700 dark:text-yellow-300 px-4 py-2 rounded-lg shadow-lg hover:shadow-2xl transition-colors font-semibold"
        >
          🌙
        </motion.button>

        {/* Logout */}
        <motion.button
          onClick={logout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white text-red-600 dark:bg-red-600 dark:text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-500 dark:hover:bg-red-700 transition-colors font-semibold"
        >
          Logout
        </motion.button>
      </div>
    </motion.nav>
  );
}

export default Navbar;