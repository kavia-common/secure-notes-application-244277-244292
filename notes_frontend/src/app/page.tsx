// "use client";
"use client";
import React, { useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { useNotes } from "./context/NotesContext";
import Sidebar from "./components/Sidebar";
import HeaderBar from "./components/HeaderBar";
import NoteList from "./components/NoteList";
import NoteEditor from "./components/NoteEditor";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, loading } = useAuth();
  const {
    selectedNote,
    selectNote,
    newNote,
    setFilter,
    filter,
  } = useNotes();
  const router = useRouter();

  // If not logged in, redirect to /auth
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth');
    }
  }, [user, loading, router]);

  // Helper for tag selection.
  function handleSelectTag(tag: string) {
    setFilter({
      ...filter,
      tags: filter.tags && filter.tags.includes(tag)
        ? filter.tags.filter(t => t !== tag)
        : [...(filter.tags || []), tag],
    });
  }

  // Auth loading screen
  if (loading || (!user && typeof window !== "undefined" && window.location.pathname !== '/auth')) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-400 text-xl">Loading...</div>
      </main>
    );
  }

  if (!user) return null; // Will redirect to /auth

  // Responsive layout: sidebar + main; mobile: stacked
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderBar />
      <div className="flex flex-1 flex-row">
        <aside className="hidden sm:block w-60">
          <Sidebar
            onCreateNote={newNote}
            onSelectTag={handleSelectTag}
          />
        </aside>
        <main className="flex-1 flex flex-col sm:flex-row min-h-0">
          <section className="w-full sm:w-2/5 border-r border-gray-200 bg-gray-50 overflow-y-auto">
            <NoteList
              onSelectNote={selectNote}
              currentNoteId={selectedNote?.id || null}
            />
          </section>
          <section className="flex-1 overflow-y-auto bg-[#f2efe9]">
            <NoteEditor />
          </section>
        </main>
      </div>
    </div>
  );
}
