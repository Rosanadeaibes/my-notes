// Import necessary modules and components
import { useState, useEffect } from "react";
import { getNotes, createNote, deleteNote, deleteAllNotes } from "./Notes.services";
import { Note } from "./Notes.types";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";

const Notes = () => {
    // State to manage notes and search input
    const [notes, setNotes] = useState<Note[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch notes on component mount
    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const fetchedNotes = await getNotes();
                setNotes(fetchedNotes);
            } catch (error) {
                console.error("Error fetching notes:", error);
            }
        };

        fetchNotes();
    }, []);

    // Filter notes based on search term and category
    const filteredNotes = (category: string) => {
        return notes.filter(note =>
            (category === "all" || note.category === category) &&
            (note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                note.content.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    };

    // Handle adding a new note
    const handleAddNote = async () => {
        const newNote: Partial<Note> = {
            title: "New Note",
            content: "This is a new note.",
            category: "personal"
        };
        try {
            const addedNote = await createNote(newNote);
            setNotes([...notes, addedNote]);
        } catch (error) {
            console.error("Error adding note:", error);
        }
    };

    // Handle deleting a note
    const handleDeleteNote = async (id: string) => {
        try {
            await deleteNote(id);
            setNotes(notes.filter(note => note.id !== id));
        } catch (error) {
            console.error("Error deleting note:", error);
        }
    };

    // Handle deleting all notes
    const handleDeleteAllNotes = async () => {
        try {
            await deleteAllNotes();
            setNotes([]);
        } catch (error) {
            console.error("Error deleting all notes:", error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">My Notes</h1>

                <div className="flex space-x-2">
                    {/* Search Input */}
                    <Input
                        type="text"
                        placeholder="Search notes..."
                        className="w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    {/* Add Note Button */}
                    <Button
                        className="bg-green-500 hover:bg-green-600 text-white"
                        onClick={handleAddNote}
                    >
                        Add Note
                    </Button>

                    {/* Delete All Button */}
                    <Button
                        className="bg-red-500 hover:bg-red-600 text-white"
                        onClick={handleDeleteAllNotes}
                    >
                        Delete All
                    </Button>
                </div>
            </div>

            {/* Tabs Component */}
            <Tabs defaultValue="all">
                <TabsList>
                    <TabsTrigger value="all">All Notes</TabsTrigger>
                    <TabsTrigger value="personal">Personal</TabsTrigger>
                    <TabsTrigger value="work">Work</TabsTrigger>
                    <TabsTrigger value="archived">Archived</TabsTrigger>
                </TabsList>

                {/* Render Notes Based on Tabs */}
                {["all", "personal", "work", "archived"].map(category => (
                    <TabsContent key={category} value={category}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredNotes(category).map(note => (
                                <Card key={note.id} className="shadow-md">
                                    <CardHeader>
                                        <CardTitle>{note.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p>{note.content}</p>
                                    </CardContent>
                                    <div className="flex justify-between p-4">
                                        {/* Edit Button (Placeholder) */}
                                        <Button className="bg-blue-500 hover:bg-blue-600 text-white text-sm">
                                            Edit
                                        </Button>

                                        {/* Delete Button */}
                                        <Button
                                            className="bg-red-500 hover:bg-red-600 text-white text-sm"
                                            onClick={() => handleDeleteNote(note.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
};

export default Notes;
