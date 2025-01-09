import express from "express";
import {
    createNote,
    getNote,
    getNotes,
    updateNote,
    deleteNote,
    searchNotes
} from "../api/controllers/notesController";
import { protect } from "../middlewares/authMiddleware";



import { createNoteValidation, updateNoteValidation } from "../validators/notesValidators";

const router = express.Router();

router.post(
    "/create-note",
    protect,
    createNoteValidation(),
    createNote
);

router.get(
    "/get-notes",
    
    protect,
    getNotes
);
router.get(
    "/get-note/:id",
    protect,
    getNote
);
router.get(
    "/search-notes",
    protect,
    searchNotes
)

router.put(
    "/update-note/:id",
    protect,
    updateNoteValidation(),
    updateNote
);

router.delete(
    "/delete-note/:id",
    protect,
    deleteNote
);

export default router;