import { useState } from "react";
import API from "../api/axios";
import ReactQuill from "react-quill";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

function NoteForm({ fetchNotes }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ header: [1, 2, 3, false] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      ["link"],
      ["clean"]
    ]
  };

  const createNote = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      const token = localStorage.getItem("token");
      await API.post("/notes", { title, content }, { headers: { Authorization: `Bearer ${token}` } });

      toast.success("Note created");
      setTitle("");
      setContent("");
      fetchNotes();
    } catch (error) {
      toast.error("Failed to create note");
    }
  };

  return (
    <motion.form
      onSubmit={createNote}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-lg hover:shadow-2xl transition-all"
    >
      <input
        type="text"
        placeholder="Title"
        className="border p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        modules={modules}
        className="mb-4 rounded bg-white"
      />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md transition"
        type="submit"
      >
        Add Note
      </motion.button>
    </motion.form>
  );
}

export default NoteForm;