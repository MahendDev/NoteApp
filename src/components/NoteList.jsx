import React, { useState } from 'react';
import NoteCard from './NoteCard';
import '../styles/NoteList.css';

const CATEGORIES = [
    { id: 'All', icon: '✨' },
    { id: 'Personal', icon: '🏠' },
    { id: 'Work', icon: '💼' },
    { id: 'Ideas', icon: '💡' },
    { id: 'Shopping', icon: '🛒' },
    { id: 'Love', icon: '❤️' }
];

export default function NoteList({ notes, onDelete, onEdit, onView }) {
    const [filter, setFilter] = useState('All');
    const [isOpen, setIsOpen] = useState(false);

    const filteredNotes = filter === 'All'
        ? notes
        : notes.filter(n => n.category === filter);

    const activeCategory = CATEGORIES.find(c => c.id === filter);

    if (notes.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-illustration">🌸</div>
                <p>No notes yet!</p>
                <p className="empty-sub">Tap the + button to add one.</p>
            </div>
        );
    }

    return (
        <div className="note-list-container">
            <div className="filter-dropdown-container">
                <div className="dropdown-label">Filter:</div>
                <div className="custom-select">
                    <button
                        className="dropdown-trigger"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <span>{activeCategory.icon} {activeCategory.id}</span>
                        <span className="arrow">▼</span>
                    </button>

                    {isOpen && (
                        <div className="dropdown-menu">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    className={`dropdown-item ${filter === cat.id ? 'active' : ''}`}
                                    onClick={() => {
                                        setFilter(cat.id);
                                        setIsOpen(false);
                                    }}
                                >
                                    {cat.icon} {cat.id}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Backdrop to close */}
                {isOpen && <div className="backdrop" onClick={() => setIsOpen(false)} />}
            </div>

            <div className="note-list">
                {filteredNotes.length > 0 ? (
                    filteredNotes.map((note) => (
                        <NoteCard
                            key={note.id}
                            note={note}
                            onDelete={onDelete}
                            onEdit={onEdit}
                            onView={onView}
                        />
                    ))
                ) : (
                    <div className="empty-filter">
                        <p>No notes under {filter}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
