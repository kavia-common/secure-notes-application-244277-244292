'use client';
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getNotes, createNote, updateNote, deleteNote, getTags, createTag } from '../api';
import { Note, Tag, NotesQuery } from '../types';

interface NotesContextValue {
    notes: Note[];
    selectedNote: Note | null;
    tags: Tag[];
    loading: boolean;
    search: string;
    setSearch: (v: string) => void;
    filter: NotesQuery;
    setFilter: (f: NotesQuery) => void;
    selectNote: (id: string) => void;
    newNote: () => Promise<void>;
    saveNote: (note: Partial<Note>) => Promise<void>;
    removeNote: (id: string) => Promise<void>;
    refresh: () => Promise<void>;
    favoriteToggle: (id: string, favorite: boolean) => Promise<void>;
    pinToggle: (id: string, pinned: boolean) => Promise<void>;
    createTag: (name: string) => Promise<void>;
}

const NotesContext = createContext<NotesContextValue | undefined>(undefined);

export function NotesProvider({ children }: { children: React.ReactNode }) {
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<NotesQuery>({});

    // Fetch all notes (with current filter).
    const refresh = useCallback(async () => {
        setLoading(true);
        try {
            const ns = await getNotes({
                ...filter,
                search,
            });
            setNotes(ns);
        } finally {
            setLoading(false);
        }
    }, [filter, search]);

    // Fetch all tags.
    const loadTags = useCallback(async () => {
        const tgs = await getTags();
        setTags(tgs);
    }, []);

    useEffect(() => {
        refresh();
        loadTags();
    }, [refresh, loadTags]);

    const selectNote = (id: string) => {
        setSelectedNote(notes.find(n => n.id === id) || null);
    };

    const newNote = async () => {
        setLoading(true);
        const nt = await createNote({ title: '', content: '', tags: [], pinned: false, favorite: false });
        setSelectedNote(nt);
        await refresh();
        setLoading(false);
    };

    const saveNote = async (modified: Partial<Note>) => {
        if (!selectedNote) return;
        setLoading(true);
        const nt = await updateNote(selectedNote.id, modified);
        setSelectedNote(nt);
        await refresh();
        setLoading(false);
    };

    const removeNote = async (id: string) => {
        setLoading(true);
        await deleteNote(id);
        setSelectedNote(null);
        await refresh();
        setLoading(false);
    };

    const favoriteToggle = async (id: string, favorite: boolean) => {
        setLoading(true);
        await updateNote(id, { favorite });
        await refresh();
        setLoading(false);
    };

    const pinToggle = async (id: string, pinned: boolean) => {
        setLoading(true);
        await updateNote(id, { pinned });
        await refresh();
        setLoading(false);
    };

    const handleCreateTag = async (name: string) => {
        await createTag(name);
        await loadTags();
    };

    return (
        <NotesContext.Provider value={{
            notes,
            selectedNote,
            tags,
            loading,
            search,
            setSearch,
            filter,
            setFilter,
            selectNote,
            newNote,
            saveNote,
            removeNote,
            refresh,
            favoriteToggle,
            pinToggle,
            createTag: handleCreateTag,
        }}>
            {children}
        </NotesContext.Provider>
    );
}

export function useNotes() {
    const ctx = useContext(NotesContext);
    if (!ctx) throw new Error('useNotes must be used within NotesProvider');
    return ctx;
}
