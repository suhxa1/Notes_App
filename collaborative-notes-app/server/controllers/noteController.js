const Note = require("../models/Note");
const User = require("../models/User");

// Create Note
exports.createNote = async(req, res) => {
    try {
        const { title, content } = req.body;

        const note = await Note.create({
            title,
            content,
            owner: req.user,
        });

        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Notes (with search)
exports.getNotes = async(req, res) => {
    try {

        const search = req.query.search || "";
        const page = parseInt(req.query.page) || 1;
        const limit = 5;

        const query = {
            isDeleted: false,
            $or: [
                { owner: req.user },
                { collaborators: req.user }
            ]
        };

        if (search) {
            query.$text = { $search: search };
        }

        const total = await Note.countDocuments(query);

        const notes = await Note.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });

        res.json({
            page,
            totalPages: Math.ceil(total / limit),
            totalNotes: total,
            notes
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Note
exports.updateNote = async(req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) return res.status(404).json({ message: "Note not found" });

        if (
            note.owner.toString() !== req.user &&
            !note.collaborators.includes(req.user)
        ) {
            return res.status(403).json({ message: "Access denied" });
        }

        note.title = req.body.title || note.title;
        note.content = req.body.content || note.content;

        await note.save();

        res.json(note);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Soft Delete
exports.deleteNote = async(req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) return res.status(404).json({ message: "Note not found" });

        if (note.owner.toString() !== req.user) {
            return res.status(403).json({ message: "Only owner can delete" });
        }

        note.isDeleted = true;
        await note.save();

        res.json({ message: "Note deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add Collaborator
exports.addCollaborator = async(req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ message: "Note not found" });

        if (note.owner.toString() !== req.user) {
            return res.status(403).json({ message: "Only owner can add collaborators" });
        }

        if (!note.collaborators.includes(user._id)) {
            note.collaborators.push(user._id);
            await note.save();
        }

        res.json({ message: "Collaborator added successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};