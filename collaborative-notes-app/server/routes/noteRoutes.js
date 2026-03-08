const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
    createNote,
    getNotes,
    updateNote,
    deleteNote,
    addCollaborator,
} = require("../controllers/noteController");

const router = express.Router();

router.use(authMiddleware);

router.post("/", createNote);
router.get("/", getNotes);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);
router.post("/:id/collaborators", addCollaborator);

module.exports = router;