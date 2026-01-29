'use client'

import { useState, useEffect } from 'react'

const subjects = ['All', 'General', 'Math', 'Science', 'English', 'History', 'Other']

export default function Home() {
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [subject, setSubject] = useState('General')
  const [filterSubject, setFilterSubject] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [editingNote, setEditingNote] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode')
    if (savedTheme) setDarkMode(JSON.parse(savedTheme))
    loadNotes()
  }, [])

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  async function loadNotes() {
    setLoading(true)
    try {
      const { getNotes } = await import('../lib/database')
      const data = await getNotes()
      setNotes(data)
    } catch (error) {
      console.error('Error loading notes:', error)
    }
    setLoading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    try {
      if (editingNote) {
        const { updateNote } = await import('../lib/database')
        await updateNote(editingNote.id, title, content, subject)
        setEditingNote(null)
      } else {
        const { addNote } = await import('../lib/database')
        await addNote(title, content, subject)
      }
      setTitle('')
      setContent('')
      setSubject('General')
      loadNotes()
    } catch (error) {
      console.error('Error saving note:', error)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this note?')) return
    try {
      const { deleteNote } = await import('../lib/database')
      await deleteNote(id)
      loadNotes()
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  function handleEdit(note) {
    setEditingNote(note)
    setTitle(note.title)
    setContent(note.content)
    setSubject(note.subject || 'General')
  }

  function cancelEdit() {
    setEditingNote(null)
    setTitle('')
    setContent('')
    setSubject('General')
  }

  const filteredNotes = notes.filter(note => {
    const matchesSubject = filterSubject === 'All' || note.subject === filterSubject
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          note.content.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSubject && matchesSearch
  })

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-10 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              📚 StudyNotes
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 pr-4 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <svg className={`absolute left-3 top-2.5 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className={`w-64 min-h-screen p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r`}>
            <h2 className={`font-semibold mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Subjects</h2>
            <div className="space-y-2">
              {subjects.map(sub => (
                <button
                  key={sub}
                  onClick={() => setFilterSubject(sub)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    filterSubject === sub
                      ? 'bg-blue-500 text-white'
                      : darkMode
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            {/* Add/Edit Note Form */}
            <form onSubmit={handleSubmit} className={`rounded-xl shadow-lg p-6 mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {editingNote ? '✏️ Edit Note' : '➕ Add New Note'}
              </h2>
              
              <input
                type="text"
                placeholder="Note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border mb-4 ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              
              <textarea
                placeholder="Write your note..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border mb-4 ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              
              <div className="flex gap-4 mb-4">
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className={`flex-1 px-4 py-3 rounded-lg border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-800'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  {subjects.filter(s => s !== 'All').map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition font-semibold"
                >
                  {editingNote ? 'Update Note' : 'Add Note'}
                </button>
                {editingNote && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className={`px-6 py-3 rounded-lg transition font-semibold ${
                      darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {/* Notes List */}
            {loading ? (
              <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                Loading notes...
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <p className="text-4xl mb-4">📝</p>
                <p>No notes found. {filterSubject !== 'All' || searchQuery ? 'Try a different filter.' : 'Add one above!'}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    className={`rounded-xl shadow-md p-5 transition hover:shadow-lg ${
                      darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {note.title}
                        </h3>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                          darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {note.subject || 'General'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(note)}
                          className={`p-2 rounded-lg transition ${
                            darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                          }`}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(note.id)}
                          className={`p-2 rounded-lg transition ${
                            darkMode ? 'hover:bg-red-900 text-red-400' : 'hover:bg-red-100 text-red-500'
                          }`}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <p className={`whitespace-pre-wrap ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {note.content}
                    </p>
                    <p className={`text-sm mt-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {new Date(note.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}