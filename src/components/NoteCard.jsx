import React from 'react';
import { Trash2 } from 'lucide-react';
import '../styles/NoteCard.css';

export default function NoteCard({ note, onDelete, onEdit, onView }) {
    const date = new Date(note.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });

    // Dynamic font size based on title length
    const getTitleSize = (text) => {
        if (text.length < 20) return 'large';
        if (text.length < 50) return 'medium';
        return 'small';
    };

    return (
        <div className="note-card" style={{ backgroundColor: note.color || 'var(--bg-card)' }}>
            <div className="note-content" onClick={() => onView(note)}>
                <div className="note-header-row">
                    <span className="note-date">{date}</span>
                    <h3 className={`note-title ${getTitleSize(note.title)}`}>{note.title}</h3>
                    {note.category && (
                        <span className="note-category">{note.category}</span>
                    )}
                </div>
            </div>

            <div className="card-actions">
                <button className="action-btn edit" onClick={(e) => {
                    e.stopPropagation();
                    onEdit(note);
                }}>
                    <div style={{ transform: 'scaleX(-1)' }}>✎</div> {/* Simple pencil icon */}
                </button>
                <button className="action-btn delete" onClick={(e) => {
                    e.stopPropagation();
                    onDelete(note.id);
                }}>
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
}
