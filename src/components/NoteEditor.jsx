import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import '../styles/NoteEditor.css';
import '../styles/ChecklistEditor.css';

const COLORS = [
    '#FFFFFF', // White
    '#FFB7B2', // Melon
    '#FFDAC1', // Peach
    '#E2F0CB', // Tea Green
    '#B5EAD7', // Magic Mint
    '#C7CEEA', // Periwinkle
];

export default function NoteEditor({ note, onSave, onCancel }) {
    const [title, setTitle] = useState(note?.title || '');
    const [content, setContent] = useState(note?.content || '');
    const [color, setColor] = useState(note?.color || '#FFFFFF');
    const [category, setCategory] = useState(note?.category || 'Personal');
    const [type, setType] = useState(note?.type || 'text');
    const [checklist, setChecklist] = useState(
        (note?.checklist || []).map(item => ({ ...item, id: item.id || crypto.randomUUID() }))
    );
    // Ensure initial empty processing has ID if creating new
    useEffect(() => {
        if (checklist.length === 0 && type === 'checklist') {
            setChecklist([{ id: crypto.randomUUID(), text: '', done: false }]);
        }
    }, [type]);

    const [focusId, setFocusId] = useState(null);

    useEffect(() => {
        if (focusId) {
            const el = document.getElementById(`checklist-item-${focusId}`);
            if (el) {
                el.focus();
                setFocusId(null);
            }
        }
    }, [checklist, focusId]);

    const CATEGORIES = [
        { id: 'Personal', icon: '🏠' },
        { id: 'Work', icon: '💼' },
        { id: 'Ideas', icon: '💡' },
        { id: 'Shopping', icon: '🛒' },
        { id: 'Love', icon: '❤️' }
    ];

    const handleSave = () => {
        if (!title.trim() && (type === 'text' ? !content.trim() : checklist.length === 0)) return;
        // Strip internal IDs before saving if needed, but keeping them is fine/better for sync
        const cleanChecklist = checklist.filter(i => i.text.trim() !== '');
        onSave({ ...note, title, content, color, category, type, checklist: cleanChecklist });
    };

    const toggleType = () => {
        setType(type === 'text' ? 'checklist' : 'text');
        if (type === 'text' && checklist.length === 0) {
            setChecklist([{ id: crypto.randomUUID(), text: '', done: false }]);
        }
    };

    const updateChecklist = (index, value) => {
        const newChecklist = [...checklist];
        newChecklist[index].text = value;
        setChecklist(newChecklist);
    };

    const addChecklistItem = (index) => {
        const newChecklist = [...checklist];
        const newItem = { id: crypto.randomUUID(), text: '', done: false };
        newChecklist.splice(index + 1, 0, newItem);
        setChecklist(newChecklist);
        setFocusId(newItem.id);
    };

    const removeChecklistItem = (index) => {
        if (checklist.length === 1) return;
        const newChecklist = checklist.filter((_, i) => i !== index);
        setChecklist(newChecklist);
        // Focus previous item if possible
        if (index > 0) {
            setFocusId(checklist[index - 1].id);
        }
    };


    return (
        <div className="note-editor" style={{ backgroundColor: color }}>
            <header className="editor-header">
                <button onClick={onCancel} className="icon-btn">
                    <ArrowLeft size={24} />
                </button>
                <button onClick={toggleType} className="icon-btn type-toggle">
                    {type === 'text' ? '📝 Text' : '☑️ List'}
                </button>
                <button onClick={handleSave} className="save-btn">
                    Save
                </button>
            </header>

            <div className="editor-body">
                <input
                    className="title-input"
                    placeholder="Title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                {type === 'text' ? (
                    <textarea
                        className="content-input"
                        placeholder="Write your thoughts..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                ) : (
                    <div className="checklist-container">
                        {checklist.map((item, index) => (
                            <div key={item.id} className="checklist-item-row">
                                <input
                                    type="checkbox"
                                    disabled
                                    className="checklist-checkbox"
                                />
                                <input
                                    id={`checklist-item-${item.id}`}
                                    className="checklist-input"
                                    placeholder="List item..."
                                    value={item.text}
                                    onChange={(e) => updateChecklist(index, e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addChecklistItem(index);
                                        }
                                        if (e.key === 'Backspace' && item.text === '' && checklist.length > 1) {
                                            e.preventDefault();
                                            removeChecklistItem(index);
                                        }
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="editor-footer">
                <div className="category-label">Category</div>
                <div className="category-selector">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            className={`category-chip ${category === cat.id ? 'active' : ''}`}
                            onClick={() => setCategory(cat.id)}
                        >
                            {cat.icon} {cat.id}
                        </button>
                    ))}
                </div>

                <div className="color-picker">
                    {COLORS.map((c) => (
                        <button
                            key={c}
                            className={`color-btn ${color === c ? 'active' : ''}`}
                            style={{ backgroundColor: c }}
                            onClick={() => setColor(c)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
