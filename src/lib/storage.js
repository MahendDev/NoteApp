import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'cute_notes_data';

export const getNotes = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    const notes = data ? JSON.parse(data) : [];
    // Sort: Pinned first, then by date (newest first)
    return notes.sort((a, b) => {
        if (a.isPinned === b.isPinned) {
            return new Date(b.date) - new Date(a.date);
        }
        return a.isPinned ? -1 : 1;
    });
};

export const saveNote = (note) => {
    const notes = getNotes();
    const newNote = { ...note, id: uuidv4(), date: new Date().toISOString() };
    const updatedNotes = [newNote, ...notes];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
    return newNote;
};

export const updateNote = (updatedNote) => {
    const notes = getNotes();
    const newNotes = notes.map((n) => (n.id === updatedNote.id ? { ...updatedNote, date: new Date().toISOString() } : n));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newNotes));
    return newNotes;
};

export const deleteNote = (id) => {
    const notes = getNotes();
    const newNotes = notes.filter((n) => n.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newNotes));
    return newNotes;
};
