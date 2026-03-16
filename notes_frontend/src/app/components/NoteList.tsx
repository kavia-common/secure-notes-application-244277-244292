'use client';

import React from "react";
import { useNotes } from "../context/NotesContext";
import { colorForTag } from "../utils/retroColors";

/**
 * PUBLIC_INTERFACE
 * List of notes; currentNoteId is highlighted.
 */
export default function NoteList({ onSelectNote, currentNoteId }: { onSelectNote: (id: string) => void, currentNoteId: string | null }) {
    const { notes, favoriteToggle, pinToggle } = useNotes();

    if (!notes.length) {
        return <div className="p-8 text-gray-500 italic">No notes found.</div>;
    }

    return (
        <ul className="note-list">
            {notes.map(note => (
                <li
                    key={note.id}
                    className={"note-card flex flex-row items-start gap-2 cursor-pointer" + (note.id === currentNoteId ? " selected" : "")}
                    onClick={() => onSelectNote(note.id)}
                    aria-current={note.id === currentNoteId}
                >
                    <div className="flex-1">
                        <h4 className="font-bold text-lg mb-1">
                            {note.title || <span className="italic text-gray-400">Untitled</span>}
                        </h4>
                        <div className="flex flex-wrap mb-1">
                            {note.tags.map(tag => (
                                <span key={tag} className="retro-tag mr-1" style={{ background: colorForTag(tag) }}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <div className="text-xs text-gray-500">{new Date(note.updated_at).toLocaleString()}</div>
                    </div>
                    <div className="flex flex-col items-end justify-between gap-1 px-1">
                        <button
                            className="pin-star"
                            aria-label={note.pinned ? "Unpin" : "Pin"}
                            title={note.pinned ? "Unpin" : "Pin"}
                            onClick={e => { e.stopPropagation(); pinToggle(note.id, !note.pinned); }}
                        >
                            {note.pinned ? "★" : "☆"}
                        </button>
                        <button
                            className="favorite-star"
                            aria-label={note.favorite ? "Unfavorite" : "Favorite"}
                            title={note.favorite ? "Unfavorite" : "Favorite"}
                            onClick={e => { e.stopPropagation(); favoriteToggle(note.id, !note.favorite); }}
                        >
                            {note.favorite ? "❤" : "♡"}
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
}
