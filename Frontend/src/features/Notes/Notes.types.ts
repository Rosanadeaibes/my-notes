// Note interface represents a single note object
export interface Note {
    
    id: string; // Unique identifier for the note
    title: string; // Title of the note
    content: string; // Content/body of the note
    category: string; // Category of the note (e.g., personal, work, archived)
}

// NoteResponse interface represents the API response for a note
export interface NoteResponse {
    id: string; // Unique identifier for the note
    title: string; // Title of the note
    content: string; // Content/body of the note
    category: string; // Category of the note
}
