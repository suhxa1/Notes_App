import { useState, useEffect } from "react";
import API from "../api/axios";
import ReactQuill from "react-quill";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

function NoteCard({ note, fetchNotes }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const token = localStorage.getItem("token");

  // Pastel gradient colors
  const colors = [
    "from-yellow-100 to-yellow-200",
    "from-pink-100 to-pink-200",
    "from-green-100 to-green-200",
    "from-blue-100 to-blue-200",
    "from-purple-100 to-purple-200",
    "from-orange-100 to-orange-200",
  ];
  const colorIndex = note._id
    ? note._id.charCodeAt(0) % colors.length
    : Math.floor(Math.random() * colors.length);
  const bgColor = colors[colorIndex];

  const togglePin = async () => {
    await API.put(
      `/notes/${note._id}`,
      { pinned: !note.pinned },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchNotes();
  };

  const updateNote = async () => {
    try {
      await API.put(
        `/notes/${note._id}`,
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Note updated");
      setEditing(false);
      fetchNotes();
    } catch {
      toast.error("Update failed");
    }
  };

  const deleteNote = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this note?");
    if (!confirmed) return;

    await API.delete(`/notes/${note._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.info("Note deleted");
    fetchNotes();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className={`bg-gradient-to-br ${bgColor} p-5 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.03] transform transition-all duration-300`}
      >
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-gray-800 dark:text-white text-lg">{note.title}</h3>
          <button onClick={togglePin} className="text-lg hover:scale-110 transition">
            {note.pinned ? "📌" : "📍"}
          </button>
        </div>

        <div
          className="mt-3 text-sm text-gray-700 dark:text-gray-200 max-h-40 overflow-y-auto bg-white/50 dark:bg-gray-800/50 p-2 rounded"
          dangerouslySetInnerHTML={{ __html: note.content }}
        />

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setEditing(true)}
            className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg transition"
          >
            Edit
          </button>
          <button
            onClick={deleteNote}
            className="bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded-lg transition"
          >
            Delete
          </button>
        </div>

        {editing && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white dark:bg-gray-900 p-6 rounded-2xl w-[500px] shadow-2xl"
            >
              <input
                className="border p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <ReactQuill value={content} onChange={setContent} className="mb-3 rounded bg-white" />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={updateNote}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-lg transition"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default NoteCard;