import { Note, Tag, User, AuthResponse, NotesQuery } from './types';

// Set backend URL via environment variable for easy config.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/";

/**
 * Helper to get auth token from localStorage.
 */
function getToken() {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
}

/**
 * PUBLIC_INTERFACE
 * Generic HTTP request helper, robust error handling.
 */
export async function apiFetch<T = any>(url: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
        ...(options.headers ? options.headers as Record<string, string> : {}),
        "Content-Type": "application/json",
    };
    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const resp = await fetch(`${API_BASE_URL}${url.startsWith("/") ? url : `/${url}`}`, {
        ...options,
        headers,
        credentials: "include",
    });
    if (!resp.ok) {
        let detail;
        try {
            detail = await resp.json();
        } catch {
            detail = { error: await resp.text() };
        }
        throw new Error(
            detail?.detail ?? detail?.error ?? resp.statusText ?? "Server error"
        );
    }
    if (resp.status === 204) return undefined as any;
    return resp.json();
}

/**
 * PUBLIC_INTERFACE
 * Register a new user.
 */
export async function register(email: string, password: string): Promise<AuthResponse> {
    return apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
}

/**
 * PUBLIC_INTERFACE
 * Login a user (returns { access_token }).
 */
export async function login(email: string, password: string): Promise<AuthResponse> {
    // FastAPI login expects application/x-www-form-urlencoded for login
    const body = new URLSearchParams({ username: email, password });
    const resp = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        body,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
    if (!resp.ok) {
        let detail;
        try {
            detail = await resp.json();
        } catch {
            detail = { error: await resp.text() };
        }
        throw new Error(
            detail?.detail ?? detail?.error ?? resp.statusText ?? "Server error"
        );
    }
    return resp.json();
}

/**
 * PUBLIC_INTERFACE
 * Get user profile.
 */
export async function getProfile(): Promise<User> {
    return apiFetch('/auth/me');
}

/**
 * PUBLIC_INTERFACE
 * Get all notes (supports optional query for search/filter).
 */
export async function getNotes(query?: NotesQuery): Promise<Note[]> {
    let q = '';
    if (query) {
        const params = new URLSearchParams();
        if (query.search) params.append('query', query.search);
        if (query.tags) query.tags.forEach(t => params.append('tag_ids', t));
        if (query.pinned !== undefined) params.append('pinned', String(query.pinned));
        if (query.favorite !== undefined) params.append('favorite', String(query.favorite));
        q = '?' + params.toString();
    }
    return apiFetch(`/notes/${q}`);
}

/**
 * PUBLIC_INTERFACE
 * Create a new note.
 */
export async function createNote(note: Partial<Note>): Promise<Note> {
    return apiFetch('/notes/', {
        method: 'POST',
        body: JSON.stringify(note),
    });
}

/**
 * PUBLIC_INTERFACE
 * Update a note by id.
 */
export async function updateNote(id: string, note: Partial<Note>): Promise<Note> {
    return apiFetch(`/notes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(note),
    });
}

/**
 * PUBLIC_INTERFACE
 * Delete a note.
 */
export async function deleteNote(id: string): Promise<void> {
    await apiFetch(`/notes/${id}`, {
        method: 'DELETE',
    });
}

/**
 * PUBLIC_INTERFACE
 * Get all tags.
 */
export async function getTags(): Promise<Tag[]> {
    return apiFetch('/tags/');
}

/**
 * PUBLIC_INTERFACE
 * Create a tag.
 */
export async function createTag(name: string): Promise<Tag> {
    return apiFetch('/tags/', {
        method: 'POST',
        body: JSON.stringify({ name }),
    });
}
