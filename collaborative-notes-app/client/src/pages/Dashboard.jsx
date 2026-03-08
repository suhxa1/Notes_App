import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import NoteForm from "../components/NoteForm";
import NoteCard from "../components/NoteCard";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { motion } from "framer-motion";

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await API.get(`/notes?search=${search}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sorted = (res.data.notes || []).sort((a, b) => b.pinned - a.pinned);
      setNotes(sorted);
    } catch (err) {
      console.error("Error fetching notes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => fetchNotes(), 400);
    return () => clearTimeout(delay);
  }, [search]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(notes);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setNotes(items);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 transition-colors duration-500">
      <Navbar />

      <div className="max-w-6xl mx-auto mt-10 px-4">
        {/* Animated gradient title */}
        <motion.h1
          className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 text-center mb-8"
          animate={{ x: [0, 5, 0], y: [0, 3, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
        >
          My Notes
        </motion.h1>

        {/* Search Input */}
        <input
          type="text"
          placeholder="🔍 Search notes..."
          className="w-full border p-3 rounded-lg shadow-md focus:outline-none focus:ring-4 focus:ring-pink-400 focus:ring-opacity-50 mb-8 transition-all duration-300"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Floating Add Note */}
        <motion.div
          whileHover={{ scale: 1.02, boxShadow: "0px 15px 30px rgba(0,0,0,0.15)" }}
          className="mb-10 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg transition-all"
        >
          <NoteForm fetchNotes={fetchNotes} />
        </motion.div>

        {/* Loading spinner */}
        {loading && (
          <div className="flex justify-center mt-10">
            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Notes */}
        {!loading && (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="notes" direction="horizontal">
              {(provided) => (
                <div
                  className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {notes.length > 0 ? (
                    notes.map((note, index) => (
                      <Draggable key={note._id} draggableId={note._id} index={index}>
                        {(provided) => (
                          <motion.div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            whileHover={{ scale: 1.03 }}
                            transition={{ duration: 0.2 }}
                          >
                            <NoteCard note={note} fetchNotes={fetchNotes} />
                          </motion.div>
                        )}
                      </Draggable>
                    ))
                  ) : (
                    <motion.div
                      className="col-span-full text-center text-gray-500 mt-10"
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <p className="text-xl font-semibold">No notes yet</p>
                      <p>Create your first note ✨</p>
                    </motion.div>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </div>
  );
}

export default Dashboard;