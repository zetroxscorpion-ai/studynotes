'use client'

import { useState, useEffect } from 'react'

export default function Home() {
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [supabaseReady, setSupabaseReady] = useState(false)

  useEffect(() => {
    // Dynamic import to avoid SSR issues
    const initSupabase = async () => {
      try {
        const { getNotes } = await import('../lib/database')
        const data = await getNotes()
        setNotes(data)
        setSupabaseReady(true)
      } catch (error) {
        console.error('Error loading notes:', error)
      } finally {
        setLoading(false)
      }
    }
    initSupabase()
  }, [])

  async function loadNotes() {
    const { getNotes } = await import('../lib/database')
    const data = await getNotes()
    setNotes(data)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    const { addNote } = await import('../lib/database')
    await addNote(title, content)
    setTitle('')
    setContent('')
    loadNotes()
  }

  async function handleDelete(id) {
    const { deleteNote } = await import('../lib/database')
    await deleteNote(id)
    loadNotes()
  }

  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          StudyNotes
        </h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-8">
          <input
            type="text"
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Write your note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Add Note
          </button>
        </form>

        {loading ? (
          <p className="text-center text-gray-500">Loading notes...</p>
        ) : notes.length === 0 ? (
          <p className="text-center text-gray-500">No notes yet. Add one above!</p>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div key={note.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold text-gray-800">{note.title}</h2>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-gray-600 mt-2 whitespace-pre-wrap">{note.content}</p>
                <p className="text-sm text-gray-400 mt-2">
                  {new Date(note.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}