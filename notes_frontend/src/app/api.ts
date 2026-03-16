import { Note, Tag, User, AuthResponse, NotesQuery } from './types';

// Set backend URL via environment variable for easy config.
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

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
 * Generic HTTP request helper.
 */
async function apiRequest(path: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
        ...(options.headers ? options.headers as Record<string, string> : {}),
    };
    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    headers['Content-Type'] = 'application/json';
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
    });
    if (!res.ok) {
        throw new Error(await res.text());
    }
    return res.json();
}

/**
 * PUBLIC_INTERFACE
 * Register a new user.
 */
export async function register(email: string, password: string): Promise<AuthResponse> {
    return apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
}

/**
 * PUBLIC_INTERFACE
 * Login.
 */
export async function login(email: string, password: string): Promise<AuthResponse> {
    return apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
}

/**
 * PUBLIC_INTERFACE
 * Get user profile.
 */
export async function getProfile(): Promise<User> {
    return apiRequest('/auth/profile');
}

/**
 * PUBLIC_INTERFACE
 * Get all notes (supports optional query for search/filter).
 */
export async function getNotes(query?: NotesQuery): Promise<Note[]> {
    let q = '';
    if (query) {
        const params = new URLSearchParams();
        if (query.search) params.append('search', query.search);
        if (query.tags) query.tags.forEach(t => params.append('tags', t));
        if (query.pinned !== undefined) params.append('pinned', String(query.pinned));
        if (query.favorite !== undefined) params.append('favorite', String(query.favorite));
        q = '?' + params.toString();
    }
    return apiRequest(`/notes${q}`);
}

/**
 * PUBLIC_INTERFACE
 * Create a new note.
 */
export async function createNote(note: Partial<Note>): Promise<Note> {
    return apiRequest('/notes', {
        method: 'POST',
        body: JSON.stringify(note),
    });
}

/**
 * PUBLIC_INTERFACE
 * Update a note by id.
 */
export async function updateNote(id: string, note: Partial<Note>): Promise<Note> {
    return apiRequest(`/notes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(note),
    });
}

/**
 * PUBLIC_INTERFACE
 * Delete a note.
 */
export async function deleteNote(id: string): Promise<void> {
    await apiRequest(`/notes/${id}`, {
        method: 'DELETE',
    });
}

/**
 * PUBLIC_INTERFACE
 * Get all tags.
 */
export async function getTags(): Promise<Tag[]> {
    return apiRequest('/tags');
}

/**
 * PUBLIC_INTERFACE
 * Create a tag.
 */
export async function createTag(name: string): Promise<Tag> {
    return apiRequest('/tags', {
        method: 'POST',
        body: JSON.stringify({ name }),
    });
}

