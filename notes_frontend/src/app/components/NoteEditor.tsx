'use client';

import React, { useEffect, useRef, useState } from "react";
import { useNotes } from "../context/NotesContext";
import { colorForTag } from "../utils/retroColors";

/**
 * PUBLIC_INTERFACE
 * Note editor with autosave (debounced), tag edits.
 */
export default function NoteEditor() {
    const { selectedNote, saveNote, removeNote, createTag } = useNotes();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [localTags, setLocalTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState('');
    const [saving, setSaving] = useState(false);
    const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Sync state when selectedNote changes
    useEffect(() => {
        if (selectedNote) {
            setTitle(selectedNote.title);
            setContent(selectedNote.content);
            setLocalTags(selectedNote.tags);
        }
    }, [selectedNote]);

    function handleSave() {
        if (!selectedNote) return;
        setSaving(true);
        saveNote({ title, content, tags: localTags })
            .then(() => setSaving(false));
    }

    // Autosave after 800ms no changes
    useEffect(() => {
        if (!selectedNote) return;
        // Clear timer if already running
        if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
        autoSaveTimer.current = setTimeout(handleSave, 800);
        return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
        // eslint-disable-next-line
    }, [title, content, localTags, selectedNote?.id]);

    if (!selectedNote) {
        return <div className="p-12 text-gray-400">Select or create a note.</div>;
    }

    function handleAddTag(e: React.FormEvent) {
        e.preventDefault();
        if (!newTag.trim() || localTags.includes(newTag.trim())) return;
        setLocalTags([...localTags, newTag.trim()]);
        createTag(newTag.trim());
        setNewTag('');
    }

    function handleRemoveTag(tag: string) {
        setLocalTags(localTags.filter(t => t !== tag));
    }

    return (
        <div className="note-card max-w-3xl mx-auto mt-8">
            <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="text-2xl mb-2 w-full font-semibold bg-transparent"
                placeholder="Note title..."
            />
            <div className="flex flex-wrap mb-3">
                {localTags.map(tag => (
                    <span key={tag} className="retro-tag mr-1" style={{ background: colorForTag(tag) }}>
                        {tag}
                        <button
                            type="button"
                            className="ml-1 text-red-500 font-bold"
                            onClick={() => handleRemoveTag(tag)}
                            aria-label="Remove tag"
                        >&times;</button>
                    </span>
                ))}
                <form onSubmit={handleAddTag} className="flex">
                    <input
                        className="ml-2 mr-1"
                        value={newTag}
                        onChange={e => setNewTag(e.target.value)}
                        placeholder="Add tag"
                        aria-label="Add tag"
                    />
                    <button className="retro-tag px-2" type="submit">+</button>
                </form>
            </div>
            <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={13}
                className="w-full bg-transparent mb-2"
                placeholder="Type your note here..."
            />
            <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">{saving ? "Saving..." : "Saved"}</span>
                <button
                    className="retro-tag bg-red-200 hover:bg-red-400"
                    style={{ background: "#ffb3ba", color: "#730000", borderColor: "#ff5353" }}
                    onClick={() => removeNote(selectedNote.id)}
                >
                    Delete
                </button>
            </div>
        </div>
    );
}
