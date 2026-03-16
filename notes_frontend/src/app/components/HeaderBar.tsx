'use client';
import React, { useRef } from "react";
import { useNotes } from "../context/NotesContext";
import { useAuth } from "../context/AuthContext";

/**
 * PUBLIC_INTERFACE
 * Header bar with search, user info, and filter switches.
 */
export default function HeaderBar() {
    const { user, logout } = useAuth();
    const { search, setSearch, filter, setFilter } = useNotes();
    const inputRef = useRef<HTMLInputElement>(null);

    function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSearch(e.target.value);
    }

    function handleFilterToggle(key: 'pinned' | 'favorite') {
        setFilter({
            ...filter,
            [key]: filter[key] ? undefined : true,
        });
    }

    return (
        <header className="header-bar flex flex-row items-center justify-between gap-4">
            <section className="flex gap-3 items-center">
                <input
                    ref={inputRef}
                    className="px-3 py-1.5 rounded bg-white border border-gray-200"
                    placeholder="Search notes..."
                    value={search}
                    onChange={handleSearchChange}
                />
                <button
                    className={`retro-tag ${filter.pinned ? 'ring-2 ring-yellow-400' : ''}`}
                    onClick={() => handleFilterToggle("pinned")}
                    aria-pressed={!!filter.pinned}
                    aria-label="Show only pinned"
                >
                    <span className="pin-star">&#9733;</span> Pin
                </button>
                <button
                    className={`retro-tag ${filter.favorite ? 'ring-2 ring-pink-400' : ''}`}
                    onClick={() => handleFilterToggle("favorite")}
                    aria-pressed={!!filter.favorite}
                    aria-label="Show only favorites"
                >
                    <span className="favorite-star">&#10084;</span> Fav
                </button>
            </section>
            <section className="flex items-center gap-2">
                {user ? (
                    <>
                        <span className="text-sm italic font-semibold">{user.email}</span>
                        <button className="retro-tag" onClick={logout}>Logout</button>
                    </>
                ) : (
                    <span className="text-xs text-gray-600">Not signed in</span>
                )}
            </section>
        </header>
    );
}
