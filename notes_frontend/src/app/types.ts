export interface Note {
    id: string;
    title: string;
    content: string;
    tags: string[];
    pinned: boolean;
    favorite: boolean;
    updated_at: string;
    created_at: string;
}

export interface Tag {
    id: string;
    name: string;
}

export interface User {
    id: string;
    email: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
}

export interface NotesQuery {
    search?: string;
    tags?: string[];
    pinned?: boolean;
    favorite?: boolean;
}
