// Import required modules and types
import { NextFunction, Request, Response } from "express"; // Types for Express middleware
import { validationResult } from "express-validator"; // Validation result for checking input validation

import { errorHandler } from "../../utils/error";
 // Custom error handler for standardized error responses
 import { PrismaClient } from '@prisma/client';

// Define a TypeScript interface for a Note (optional, for type safety)
interface INote {
    id: string;
    title: string;
    content: string;
}

// Initialize Prisma client for interacting with the database
const prisma = new PrismaClient();

/**
 * Function to create a new note
 */
export const createNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Check for input validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(errorHandler(400, errors.array().map(err => err.msg)));
    }

    // Get the user ID from the request (assuming it's set by an authentication middleware)
    const id = req.user?.userId;
    if (!id) {
        return next(errorHandler(401, 'Unauthorized'));
    }

    // Ensure `id` is converted to an integer
    const authorId = parseInt(id, 10);
    if (isNaN(authorId)) {
        return next(errorHandler(400, 'Invalid user ID'));
    }

    // Extract the title and content from the request body
    const { title, content } = req.body;

    try {
        // Create a new note in the database
        const note = await prisma.notes.create({
            data: {
                title,
                content,
                authorId, // Use the parsed integer `authorId`
            },
        });

        // Respond with a success message and the created note's data
        res.status(201).json({
            statusCode: "201",
            message: "Note created",
            data: {
                id: note.id,
                title: note.title,
                content: note.content,
            },
        });
    } catch (error: unknown) {
        next(
            error instanceof Error
                ? errorHandler(500, `Internal Server Error, ${error.message}`)
                : errorHandler(500, 'An unknown error occurred')
        );
    }
};


/**
 * Function to fetch all notes for a user
 */
export const getNotes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Get the user ID from the request (assuming it's set by an authentication middleware)
    const id = req.user?.userId;
    if (!id) {
        return next(errorHandler(401, 'Unauthorized'));
    }

    try {
        // Fetch all notes for the logged-in user, ordered by creation date (descending)
        const notes = await prisma.notes.findMany({
            where: {
            authorId: id // Filter notes by user ID
            },
            orderBy: {
            id: 'desc', // Order by most recent
            },
        });

        // If no notes are found, return a 404 error
        if (!notes || notes.length === 0) {
            return next(errorHandler(404, 'No Notes found'));
        }

        // Respond with the notes
        res.json({
            statusCode: "200",
            message: "Notes retrieved",
            data: notes,
        });
    } catch (error: unknown) {
        // Handle any errors that occur during database interaction
        next(error instanceof Error
            ? errorHandler(500, `Internal Server Error, ${error.message}`)
            : errorHandler(500, 'An unknown error occurred'));
    }
};

/**
 * Function to search for notes by title or content
 */
export const searchNotes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id = req.user?.userId;
    if (!id) {
        return next(errorHandler(401, 'Unauthorized'));
    }

    // Get the search query from the request query parameters
    const query = req.query.q as string;

    try {
        // Fetch notes matching the search query (case-insensitive), ordered by creation date
        const notes = await prisma.notes.findMany({
            where: {
                authorId: id, // Filter notes by user ID
                ...(query && {
                    OR: [ // Match notes where the title or content contains the query string
                        { title: { contains: query, mode: 'insensitive' } },
                        { content: { contains: query, mode: 'insensitive' } }
                    ]
                })
            },

        });

        if (!notes || notes.length === 0) {
            return next(errorHandler(404, 'No Notes found'));
        }

        res.json({
            statusCode: "200",
            message: "Notes retrieved",
            data: notes,
        });
    } catch (error: unknown) {
        next(error instanceof Error
            ? errorHandler(500, `Internal Server Error, ${error.message}`)
            : errorHandler(500, 'An unknown error occurred'));
    }
};

/**
 * Function to fetch a single note by ID
 */
export const getNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id = req.user?.userId;
    if (!id) {
        return next(errorHandler(401, 'Unauthorized'));
    }

    // Get the note ID from the route parameters
    const noteId = req.params.id;

    try {
        // Fetch the note from the database
        const note = await prisma.notes.findUnique({
            where: {
                id: parseInt(noteId, 10)
            }
        });

        if (!note) {
            return next(errorHandler(404, 'Note not found'));
        }

        res.json({
            statusCode: "200",
            message: "Note retrieved",
            data: note
        });

    } catch (error: unknown) {
        next(error instanceof Error
            ? errorHandler(500, `Internal Server Error, ${error.message}`)
            : errorHandler(500, 'An unknown error occurred'));
    }
};

/**
 * Function to update a note by ID
 */
export const updateNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(errorHandler(400, errors.array().map(err => err.msg)));
    }

    const id = req.user?.userId;
    if (!id) {
        return next(errorHandler(401, 'Unauthorized'));
    }

    const noteId = req.params.id;
    const { title, content } = req.body;

    try {
        // Update the note in the database
        const note = await prisma.notes.update({
            where: {
                id: parseInt(noteId, 10)
            },
            data: {
                title,
                content
            }
        });

        res.json({
            statusCode: "200",
            message: "Note updated",
            data: note
        });

    } catch (error: unknown) {
        next(error instanceof Error
            ? errorHandler(500, `Internal Server Error, ${error.message}`)
            : errorHandler(500, 'An unknown error occurred'));
    }
};

/**
 * Function to delete a note by ID
 */
export const deleteNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id = req.user?.userId;
    if (!id) {
        return next(errorHandler(401, 'Unauthorized'));
    }

    const noteId = req.params.id;

    try {
        // Delete the note from the database
        await prisma.notes.delete({
            where: {
                id: parseInt(noteId, 10)
            }
        });

        res.json({
            statusCode: "200",
            message: `Note with id ${noteId} deleted`
        });

    } catch (error: unknown) {
        next(error instanceof Error
            ? errorHandler(500, `Internal Server Error, ${error.message}`)
            : errorHandler(500, 'An unknown error occurred'));
    }
};
