import { useState, useEffect } from 'react';
import { Plus, Palette } from 'lucide-react';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';
import NoteViewer from './components/NoteViewer';
import { getNotes, saveNote, deleteNote, updateNote } from './lib/storage';
import './styles/global.css';
import './styles/App.css';

function App() {
    const [notes, setNotes] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [viewingNote, setViewingNote] = useState(null); // New state for View Mode
    const [currentNote, setCurrentNote] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem('cute_notes_theme') || 'default');
    const [showThemePicker, setShowThemePicker] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState(null); // State for delete modal

    useEffect(() => {
        setNotes(getNotes());
        document.body.className = theme === 'default' ? '' : `theme-${theme}`;
    }, [theme]);

    // Update shortcuts whenever notes list changes
    useEffect(() => {
        if (notes.length > 0) {
            updateShortcuts();
        }
    }, [notes]);

    // Handle deep links/shortcuts
    useEffect(() => {
        const handleShortcut = (event) => {
            try {
                // Parse the data from the event
                console.log('Received shortcut event:', event.detail);
                let noteId;
                if (typeof event.detail === 'string') {
                    try {
                        const parsed = JSON.parse(event.detail);
                        noteId = parsed.noteId;
                    } catch (e) {
                        // maybe it's just the ID string?
                        noteId = event.detail;
                    }
                } else if (event.detail && event.detail.noteId) {
                    noteId = event.detail.noteId;
                }

                if (noteId) {
                    // Small delay to ensure notes are loaded
                    setTimeout(() => {
                        const allNotes = getNotes();
                        const targetNote = allNotes.find(n => n.id === noteId);
                        if (targetNote) {
                            setViewingNote(targetNote);
                            setIsEditing(false);
                            setCurrentNote(null);
                        }
                    }, 500);
                }
            } catch (error) {
                console.error('Failed to handle shortcut:', error);
            }
        };

        window.addEventListener('noteShortcutOpened', handleShortcut);

        return () => {
            window.removeEventListener('noteShortcutOpened', handleShortcut);
        };
    }, []);

    const handleAddNote = () => {
        setCurrentNote(null);
        setViewingNote(null);
        setIsEditing(true);
    };

    const handleViewNote = (note) => {
        setViewingNote(note);
        setIsEditing(false);
    };

    const handleEditNote = (note) => {
        setCurrentNote(note);
        setViewingNote(null); // Close viewer when editing
        setIsEditing(true);
    };

    const handleSaveNote = (note) => {

        if (note.id) {
            updateNote(note);
            // If we were viewing a note, update the view as well
            if (viewingNote?.id === note.id) {
                setViewingNote(note);
            }
        } else {
            saveNote(note);
        }

        // Refresh notes from storage to apply sorting (Pinned first)
        setNotes(getNotes());

        setIsEditing(false);
        setIsEditing(false);
        // If we came from view mode, return to view mode (updated note)
        // If it was a new note, maybe go to list. Let's default to list for now unless we want to view the new note.
    };

    const handleUpdateChecklist = (updatedNote) => {
        // Specifically for toggling checkboxes in View Mode
        const newNotes = updateNote(updatedNote);
        setNotes(newNotes);
        setViewingNote(updatedNote); // Keep viewing the updated state
    };

    const handleDelete = (id) => {
        const note = notes.find((n) => n.id === id);
        setNoteToDelete(note);
    };

    const confirmDelete = () => {
        if (noteToDelete) {
            const updated = deleteNote(noteToDelete.id);
            setNotes(updated);
            setViewingNote(null);
            setNoteToDelete(null);
        }
    };

    const handleSplitNote = (originalNote) => {
        if (originalNote.type !== 'checklist') return;

        const uncheckedItems = originalNote.checklist.filter(item => !item.done);
        const checkedItems = originalNote.checklist.filter(item => item.done);

        if (uncheckedItems.length === 0) {
            alert("No unchecked items to move!");
            return;
        }

        // 1. Update original note (keep only checked)
        const updatedOriginal = { ...originalNote, checklist: checkedItems };
        const updatedNotes = updateNote(updatedOriginal);

        // 2. Create new note (with unchecked)
        // Remove existing "(Remaining)" suffix if present to avoid duplication
        let baseTitle = originalNote.title;
        if (baseTitle.endsWith(' (Remaining)')) {
            baseTitle = baseTitle.replace(/ \(Remaining\)$/, '');
        }

        const newNote = {
            title: `${baseTitle} (Remaining)`,
            content: '',
            type: 'checklist',
            checklist: uncheckedItems,
            color: originalNote.color,
            category: originalNote.category
        };
        saveNote(newNote);

        // 3. Update state
        // Refresh notes from storage to apply sorting (Pinned first)
        setNotes(getNotes());
        setViewingNote(null); // Close viewer as we modified the note significantly
    };

    const switchTheme = (newTheme) => {
        setTheme(newTheme);
        localStorage.setItem('cute_notes_theme', newTheme);
        setShowThemePicker(false);
    };

    return (
        <div className="app-container">
            {/* Header only shows on List View */}
            {!isEditing && !viewingNote && (
                <header className="app-header">
                    <h1>Notes</h1>
                    <button className="theme-btn" onClick={() => setShowThemePicker(!showThemePicker)}>
                        <Palette size={24} />
                    </button>
                </header>
            )}

            {/* Theme Picker Dropdown */}
            {showThemePicker && (
                <div className="theme-picker-overlay" onClick={() => setShowThemePicker(false)}>
                    <div className="theme-picker" onClick={(e) => e.stopPropagation()}>
                        <h3 style={{ marginBottom: 12 }}>Pick a Theme</h3>
                        <div className="theme-options">
                            <button className="theme-opt default" onClick={() => switchTheme('default')}>💜</button>
                            <button className="theme-opt pink" onClick={() => switchTheme('pink')}>💖</button>
                            <button className="theme-opt mint" onClick={() => switchTheme('mint')}>💚</button>
                            <button className="theme-opt peach" onClick={() => switchTheme('peach')}>🍑</button>
                            <button className="theme-opt sky" onClick={() => switchTheme('sky')}>☁️</button>
                            <button className="theme-opt lemon" onClick={() => switchTheme('lemon')}>🍋</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {noteToDelete && (
                <div className="theme-picker-overlay" onClick={() => setNoteToDelete(null)}>
                    <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="modal-title">Delete Note?</h3>
                        <p className="modal-msg">
                            Are you sure you want to delete <b>"{noteToDelete.title}"</b>? This action cannot be undone. 🥺
                        </p>
                        <div className="modal-actions">
                            <button className="modal-btn cancel" onClick={() => setNoteToDelete(null)}>
                                Cancel
                            </button>
                            <button className="modal-btn delete" onClick={confirmDelete}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main>
                {isEditing ? (
                    <NoteEditor
                        note={currentNote || {}}
                        onSave={handleSaveNote}
                        onCancel={() => {
                            setIsEditing(false);
                            // If we were viewing, go back to view? For now back to list to keep it simple.
                            // Or better: if editing existing note, go back to View.
                            if (currentNote?.id) {
                                setViewingNote(currentNote);
                            }
                        }}
                    />
                ) : viewingNote ? (
                    <NoteViewer
                        note={viewingNote}
                        onClose={() => setViewingNote(null)}
                        onEdit={handleEditNote}
                        onDelete={handleDelete}
                        onUpdate={handleUpdateChecklist}
                        onSplit={handleSplitNote}
                    />
                ) : (
                    <>
                        <NoteList
                            notes={notes}
                            onDelete={handleDelete}
                            onEdit={handleEditNote}
                            onView={handleViewNote}
                        />
                        {/* We need to intercept the card click in NoteList to triggering View instead of Edit */}
                    </>
                )}

                {!isEditing && !viewingNote && (
                    <button className="fab" onClick={handleAddNote}>
                        <Plus size={32} />
                    </button>
                )}
            </main>
        </div>
    );
}

export default App;
