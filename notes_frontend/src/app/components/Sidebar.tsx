'use client';
import React, { useState } from "react";
import { useNotes } from "../context/NotesContext";
import { colorForTag } from "../utils/retroColors";

/**
 * PUBLIC_INTERFACE
 * Sidebar lists tags and new note controls.
 */
export default function Sidebar({ onCreateNote, onSelectTag }: { onCreateNote: () => void, onSelectTag: (tag: string) => void }) {
    const { tags, filter, setFilter, createTag } = useNotes();
    const [newTag, setNewTag] = useState('');

    function handleAddTag(e: React.FormEvent) {
        e.preventDefault();
        if (newTag.trim()) {
            createTag(newTag.trim());
            setNewTag('');
        }
    }

    return (
        <nav className="sidebar">
            <button
                className="button-link mb-6 font-bold text-lg"
                style={{ color: "#333" }}
                onClick={onCreateNote}
            >
                + New Note
            </button>

            <section>
                <h3 className="uppercase text-xs tracking-widest px-6 mb-2 text-gray-600">Tags</h3>
                <div className="flex flex-wrap px-6 mb-2">
                    <span
                        className={`retro-tag cursor-pointer ${!filter.tags ? 'ring-2 ring-indigo-500' : ''}`}
                        style={{ background: '#fff799', border: '1px solid #cece8a' }}
                        onClick={() => setFilter({ ...filter, tags: undefined })}
                    >
                        All
                    </span>
                    {tags.map(tag => (
                        <span
                            key={tag.id}
                            className={"retro-tag cursor-pointer " + ((filter.tags || []).includes(tag.name) ? 'ring-2 ring-indigo-900' : '')}
                            style={{ background: colorForTag(tag.name) }}
                            onClick={() => onSelectTag(tag.name)}
                        >
                            {tag.name}
                        </span>
                    ))}
                </div>
                <form onSubmit={handleAddTag} className="flex px-6 mb-3">
                    <input
                        type="text"
                        className="flex-1 mr-2"
                        value={newTag}
                        placeholder="Add tag"
                        onChange={e => setNewTag(e.target.value)}
                        aria-label="New tag name"
                    />
                    <button className="retro-tag" type="submit">+</button>
                </form>
            </section>
        </nav>
    );
}
