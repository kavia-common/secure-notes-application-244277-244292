'use client';
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

/**
 * PUBLIC_INTERFACE
 * Simple authentication page for login/register actions.
 */
export default function AuthPage() {
    const { loading, error, loginUser, registerUser } = useAuth();
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [inProgress, setInProgress] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setInProgress(true);
        if (isRegister) {
            await registerUser(email, password);
        } else {
            await loginUser(email, password);
        }
        setInProgress(false);
    }

    return (
        <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 to-pink-100">
            <form
                className="note-card flex flex-col gap-2 w-full max-w-md"
                style={{ marginTop: '5vh', minWidth: 320 }}
                onSubmit={handleSubmit}
            >
                <h2 className="mb-4 text-2xl font-bold tracking-wide text-center">
                    {isRegister ? "Register" : "Sign In"}
                </h2>
                <input
                    type="email"
                    autoFocus
                    placeholder="Email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                {error && <div className="text-red-500 italic">{error}</div>}
                <button
                    type="submit"
                    className="retro-tag mt-2"
                    disabled={loading || inProgress}
                >
                    {isRegister ? "Create Account" : "Log In"}
                </button>
                <button
                    type="button"
                    onClick={() => setIsRegister(r => !r)}
                    className="button-link text-xs mt-1"
                    tabIndex={-1}
                >
                    {isRegister ? "Already have an account? Sign in →" : "No account? Register →"}
                </button>
            </form>
        </main>
    );
}
