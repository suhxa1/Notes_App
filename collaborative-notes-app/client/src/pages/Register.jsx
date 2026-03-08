import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [slideIn, setSlideIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setSlideIn(true);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/auth/register", { name, email, password });
      toast.success("Registration successful!");
      navigate("/");
    } catch (err) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-500 px-4">
      <motion.form
        onSubmit={handleRegister}
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
          className="text-4xl font-extrabold mb-6 text-center text-gradient bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-500"
        >
          Create Account
        </motion.h2>

        <motion.input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          whileFocus={{ scale: 1.02 }}
          className="w-full border p-3 mb-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300 shadow-sm"
        />

        <motion.input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          whileFocus={{ scale: 1.02 }}
          className="w-full border p-3 mb-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300 shadow-sm"
        />

        <motion.input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          whileFocus={{ scale: 1.02 }}
          className="w-full border p-3 mb-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300 shadow-sm"
        />

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-full bg-gradient-to-r from-green-500 to-blue-500 text-white p-3 rounded-xl font-semibold shadow-lg transition-all duration-300 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-5 text-sm text-center text-gray-700 dark:text-gray-300"
        >
          Already have an account?{" "}
          <Link
            to="/"
            className="text-purple-600 font-medium hover:underline hover:text-purple-800 transition-colors duration-300"
          >
            Login
          </Link>
        </motion.p>
      </motion.form>
    </div>
  );
}

export default Register;