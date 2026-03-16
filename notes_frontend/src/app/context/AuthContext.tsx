'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getProfile, login, register } from '../api';
import { User } from '../types';

interface AuthContextValue {
    user: User | null;
    loading: boolean;
    error: string | null;
    loginUser: (email: string, password: string) => Promise<void>;
    registerUser: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

// PUBLIC_INTERFACE
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * PUBLIC_INTERFACE
 * AuthContextProvider wraps children with auth state, and provides robust error handling.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Try getting user on mount.
        async function init() {
            setLoading(true);
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            if (token) {
                try {
                    const profile = await getProfile();
                    setUser(profile);
                } catch {
                    localStorage.removeItem("token");
                    setUser(null);
                }
            }
            setLoading(false);
        }
        init();
    }, []);

    function getErrorMessage(e: unknown): string {
        if (typeof e === "string") {
            return e;
        } else if (typeof e === "object" && e !== null && "message" in e) {
            const maybeErr = e as { message?: unknown };
            if (typeof maybeErr.message === "string") return maybeErr.message;
        }
        return "Unknown error";
    }

    const loginUser = async (email: string, password: string) => {
        setError(null);
        setLoading(true);
        try {
            const res = await login(email, password);
            localStorage.setItem("token", res.access_token);
            const profile = await getProfile();
            setUser(profile);
        } catch (e: unknown) {
            setError(getErrorMessage(e));
            setUser(null);
        }
        setLoading(false);
    };

    const registerUser = async (email: string, password: string) => {
        setError(null);
        setLoading(true);
        try {
            const res = await register(email, password);
            localStorage.setItem("token", res.access_token);
            const profile = await getProfile();
            setUser(profile);
        } catch (e: unknown) {
            setError(getErrorMessage(e));
            setUser(null);
        }
        setLoading(false);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, loginUser, registerUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * PUBLIC_INTERFACE
 * useAuth hook to access context in components.
 */
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
