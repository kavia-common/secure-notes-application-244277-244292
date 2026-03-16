'use client';
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getNotes, createNote, updateNote, deleteNote, getTags, createTag } from '../api';
import { Note, Tag, NotesQuery } from '../types';

interface NotesContextValue {
    notes: Note[];
    selectedNote: Note | null;
    tags: Tag[];
    loading: boolean;
    error: string | null;
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

// PUBLIC_INTERFACE
const NotesContext = createContext<NotesContextValue | undefined>(undefined);

/**
 * PUBLIC_INTERFACE
 * NotesProvider wraps children with notes and tags state, robust error handling, and async actions.
 */
export function NotesProvider({ children }: { children: React.ReactNode }) {
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<NotesQuery>({});

    function getErrorMessage(e: unknown): string {
        if (typeof e === "string") {
            return e;
        } else if (typeof e === "object" && e !== null && "message" in e) {
            const maybeErr = e as { message?: unknown };
            if (typeof maybeErr.message === "string") return maybeErr.message;
        }
        return "Unknown error";
    }

    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const ns = await getNotes({
                ...filter,
                search,
            });
            setNotes(ns);
        } catch (e: unknown) {
            setError(getErrorMessage(e));
            setNotes([]);
        } finally {
            setLoading(false);
        }
    }, [filter, search]);

    // Fetch all tags.
    const loadTags = useCallback(async () => {
        setError(null);
        try {
            const tgs = await getTags();
            setTags(tgs);
        } catch (e: unknown) {
            setError(getErrorMessage(e));
            setTags([]);
        }
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
        setError(null);
        try {
            const nt = await createNote({ title: '', content: '', tags: [], is_pinned: false, is_favorite: false });
            setSelectedNote(nt);
            await refresh();
        } catch (e: unknown) {
            setError(getErrorMessage(e));
        } finally {
            setLoading(false);
        }
    };

    const saveNote = async (modified: Partial<Note>) => {
        if (!selectedNote) return;
        setLoading(true);
        setError(null);
        try {
            const nt = await updateNote(selectedNote.id, modified);
            setSelectedNote(nt);
            await refresh();
        } catch (e: unknown) {
            setError(getErrorMessage(e));
        } finally {
            setLoading(false);
        }
    };

    const removeNote = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await deleteNote(id);
            if (selectedNote?.id === id) setSelectedNote(null);
            await refresh();
        } catch (e: unknown) {
            setError(getErrorMessage(e));
        } finally {
            setLoading(false);
        }
    };

    const favoriteToggle = async (id: string, favorite: boolean) => {
        setLoading(true);
        setError(null);
        try {
            await updateNote(id, { is_favorite: favorite });
            await refresh();
        } catch (e: unknown) {
            setError(getErrorMessage(e));
        } finally {
            setLoading(false);
        }
    };

    const pinToggle = async (id: string, pinned: boolean) => {
        setLoading(true);
        setError(null);
        try {
            await updateNote(id, { is_pinned: pinned });
            await refresh();
        } catch (e: unknown) {
            setError(getErrorMessage(e));
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTag = async (name: string) => {
        setError(null);
        try {
            await createTag(name);
            await loadTags();
        } catch (e: unknown) {
            setError(getErrorMessage(e));
        }
    };

    return (
        <NotesContext.Provider value={{
            notes,
            selectedNote,
            tags,
            loading,
            error,
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

/**
 * PUBLIC_INTERFACE
 * useNotes hook to access context in components.
 */
export function useNotes() {
    const ctx = useContext(NotesContext);
    if (!ctx) throw new Error('useNotes must be used within NotesProvider');
    return ctx;
}
