import api from '@/api/base';
import { Note } from './Notes.types';

// Fetch all notes
export const getNotes = async (): Promise<Note[]> => {
    try {
        const response = await api.get<Note[]>('/notes');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch notes:', error);
        throw error;
    }
};

// Add a new note
export const createNote = async (note: Partial<Note>): Promise<Note> => {
    try {
        const response = await api.post<Note>('/note/create-note', note);
        return response.data;
    } catch (error) {
        console.error('Failed to add note:', error);
        throw error;
    }
};

// Update an existing note
export const updateNote = async (id: string, updatedNote: Partial<Note>): Promise<Note> => {
    try {
        const response = await api.put<Note>(`/notes/${id}`, updatedNote);
        return response.data;
    } catch (error) {
        console.error('Failed to update note:', error);
        throw error;
    }
};

// Delete a note
export const deleteNote = async (id: string): Promise<void> => {
    try {
        await api.delete(`/notes/${id}`);
    } catch (error) {
        console.error('Failed to delete note:', error);
        throw error;
    }
};

// Delete all notes
export const deleteAllNotes = async (): Promise<void> => {
    try {
        await api.delete('/notes');
    } catch (error) {
        console.error('Failed to delete all notes:', error);
        throw error;
    }
};
