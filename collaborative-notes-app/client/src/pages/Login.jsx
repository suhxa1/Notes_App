import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [slideIn, setSlideIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setSlideIn(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 px-4">
      <motion.form
        onSubmit={handleLogin}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-2xl w-full max-w-sm transform transition-all duration-700 ${
          slideIn ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0"
        }`}
      >
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl font-extrabold mb-6 text-center text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500"
        >
          Login
        </motion.h2>

        <motion.input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          whileFocus={{ scale: 1.02 }}
          className="w-full border p-3 mb-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 shadow-sm"
        />

        <motion.input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          whileFocus={{ scale: 1.02 }}
          className="w-full border p-3 mb-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 shadow-sm"
        />

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white p-3 rounded-xl font-semibold shadow-lg transition-all duration-300 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-5 text-center text-gray-700 dark:text-gray-300"
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-pink-500 font-medium hover:underline hover:text-pink-700 transition-colors duration-300"
          >
            Register
          </Link>
        </motion.div>
      </motion.form>
    </div>
  );
}

export default Login;