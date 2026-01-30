import React, { useState } from 'react';
import { ArrowLeft, Pencil, Trash2, Scissors } from 'lucide-react';
import '../styles/NoteViewer.css';
import '../styles/ChecklistEditor.css'; // Reuse checklist styles

export default function NoteViewer({ note, onClose, onEdit, onDelete, onUpdate, onSplit }) {
    // Local state to handle immediate UI updates for checklist
    // We'll sync with parent via onUpdate
    const [checklist, setChecklist] = useState(note.checklist || []);

    const toggleCheckitem = (index) => {
        if (note.type !== 'checklist') return;

        const newChecklist = [...checklist];
        newChecklist[index].done = !newChecklist[index].done;
        setChecklist(newChecklist);

        // Update parent/storage immediately
        onUpdate({ ...note, checklist: newChecklist });
    };

    const date = new Date(note.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="note-viewer" style={{ backgroundColor: note.color }}>
            <header className="viewer-header">
                <button onClick={onClose} className="icon-btn">
                    <ArrowLeft size={24} />
                </button>
                <div className="header-actions">
                    {note.type === 'checklist' && (
                        <button onClick={() => onSplit(note)} className="icon-btn" title="Move unchecked to new note">
                            <Scissors size={24} />
                        </button>
                    )}
                    <button onClick={() => onEdit(note)} className="icon-btn">
                        <Pencil size={24} />
                    </button>
                    <button onClick={() => onDelete(note.id)} className="icon-btn delete">
                        <Trash2 size={24} />
                    </button>
                </div>
            </header>

            <div className="viewer-body">
                <div className="viewer-meta">
                    <span className="viewer-category">{note.category}</span>
                    <span className="viewer-date">{date}</span>
                </div>

                <h1 className="viewer-title">{note.title}</h1>

                {note.type === 'checklist' ? (
                    <div className="viewer-checklist">
                        {checklist.map((item, index) => (
                            <div
                                key={index}
                                className={`viewer-check-item ${item.done ? 'done' : ''}`}
                                onClick={() => toggleCheckitem(index)}
                            >
                                <div className={`custom-checkbox ${item.done ? 'checked' : ''}`}>
                                    {item.done && '✓'}
                                </div>
                                <span className="check-text">{item.text}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="viewer-content">{note.content}</p>
                )}
            </div>
        </div>
    );
}
