'use client'

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown, ChevronRight, Plus, X, Star, Calendar, Shuffle, Settings,
  Sun, Moon, GripVertical, Trash2, Edit3, Check, Play, BookOpen,
  Lightbulb, AlertCircle, ArrowLeft, ArrowRight, Upload, CheckCircle,
  XCircle, MinusCircle, LogOut, User, Loader2
} from 'lucide-react'
import { supabase, uploadImage } from '@/lib/supabase'
import * as db from '@/lib/database'

// Auth Component
function AuthForm({ onSuccess }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setError('Check your email for confirmation link!')
      }
      onSuccess?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="text-blue-500" size={40} />
            <h1 className="text-3xl font-bold text-white">StudyNotes</h1>
          </div>
          <p className="text-gray-400">Track your mistakes, master your subjects</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-semibold text-white text-center">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>

          {error && (
            <div className={`p-3 rounded-lg text-sm ${
              error.includes('Check your email') 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {error}
            </div>
          )}

          <div>
            <label className="text-sm text-gray-400 block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-blue-500 focus:outline-none"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={20} />}
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>

          <p className="text-center text-gray-400 text-sm">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-400 hover:text-blue-300"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}

// Loading Spinner
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="animate-spin text-blue-500 mx-auto mb-4" size={48} />
        <p className="text-gray-400">Loading your notes...</p>
      </div>
    </div>
  )
}

// Helper functions
const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const isToday = (date) => {
  if (!date) return false
  const today = new Date()
  const d = new Date(date)
  return d.toDateString() === today.toDateString()
}

const isPastDue = (date) => {
  if (!date) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d < today
}

const addDays = (date, days) => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

const getStatusColor = (status, darkMode) => {
  switch (status) {
    case 'success': return darkMode ? 'text-green-400 bg-green-500/20' : 'text-green-600 bg-green-100'
    case 'partial': return darkMode ? 'text-yellow-400 bg-yellow-500/20' : 'text-yellow-600 bg-yellow-100'
    case 'fail': return darkMode ? 'text-red-400 bg-red-500/20' : 'text-red-600 bg-red-100'
    default: return darkMode ? 'text-gray-400 bg-gray-500/20' : 'text-gray-600 bg-gray-100'
  }
}

const getStatusIcon = (status) => {
  switch (status) {
    case 'success': return CheckCircle
    case 'partial': return MinusCircle
    case 'fail': return XCircle
    default: return CheckCircle
  }
}

const redoIntervals = [
  { days: 1, label: 'Tomorrow' },
  { days: 3, label: '3 days' },
  { days: 7, label: '1 week' },
  { days: 14, label: '2 weeks' },
  { days: 30, label: '1 month' },
]

const redoStatuses = [
  { id: 'success', label: 'Success', color: 'green' },
  { id: 'partial', label: 'Partial', color: 'yellow' },
  { id: 'fail', label: 'Fail', color: 'red' },
]

// Image Upload Component
function ImageUpload({ value, onChange, darkMode }) {
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const url = await uploadImage(file, 'notes')
      onChange(url)
    } catch (err) {
      console.error('Upload failed:', err)
      alert('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onChange(null)
  }

  return (
    <div className="mt-2">
      {value ? (
        <div className="relative inline-block">
          <img src={value} alt="Uploaded" className="max-h-40 rounded-lg border border-gray-600" />
          <button
            onClick={removeImage}
            className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
            type="button"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <label className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer border border-dashed transition-colors ${
          darkMode 
            ? 'border-gray-600 hover:border-gray-500 text-gray-400 hover:text-gray-300' 
            : 'border-gray-300 hover:border-gray-400 text-gray-500 hover:text-gray-600'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          {uploading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Upload size={16} />
          )}
          <span className="text-sm">{uploading ? 'Uploading...' : 'Upload Image'}</span>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            className="hidden" 
            disabled={uploading}
          />
        </label>
      )}
    </div>
  )
}

// Rich Input Component
function RichInput({ label, value, image, onTextChange, onImageChange, darkMode, multiline = true }) {
  return (
    <div className="space-y-2">
      <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{label}</label>
      {multiline ? (
        <textarea
          value={value || ''}
          onChange={(e) => onTextChange(e.target.value)}
          className={`w-full px-3 py-2 rounded-lg border resize-none transition-colors ${
            darkMode
              ? 'bg-gray-800 border-gray-600 text-gray-100 focus:border-blue-500'
              : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
          } focus:outline-none focus:ring-1 focus:ring-blue-500`}
          rows={3}
        />
      ) : (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onTextChange(e.target.value)}
          className={`w-full px-3 py-2 rounded-lg border transition-colors ${
            darkMode
              ? 'bg-gray-800 border-gray-600 text-gray-100 focus:border-blue-500'
              : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
          } focus:outline-none focus:ring-1 focus:ring-blue-500`}
        />
      )}
      <ImageUpload value={image} onChange={onImageChange} darkMode={darkMode} />
    </div>
  )
}

// Flashcard Component
function FlashcardMode({ items, onClose, darkMode }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  const current = items[currentIndex]

  const next = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setShowAnswer(false)
    }
  }

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setShowAnswer(false)
    }
  }

  if (!current) return null

  const isTip = current.type === 'tip'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: darkMode ? 'rgba(0,0,0,0.95)' : 'rgba(0,0,0,0.9)' }}
    >
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-300'}`}>
            {currentIndex + 1} / {items.length}
          </span>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-700 text-gray-300'
            }`}
          >
            <X size={24} />
          </button>
        </div>

        <div
          className={`min-h-96 rounded-2xl p-8 cursor-pointer ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}
          onClick={() => setShowAnswer(!showAnswer)}
        >
          {!showAnswer ? (
            <div className="space-y-4">
              {isTip ? (
                <>
                  <div className="flex items-center gap-2 text-amber-500">
                    <Lightbulb size={20} />
                    <span className="text-sm font-medium">TIP</span>
                    {current.is_important && <Star size={14} className="fill-amber-500" />}
                  </div>
                  <p className={`text-xl ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    {current.text}
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {current.title || 'Question'}
                    </h3>
                    {current.is_important && <Star size={16} className="text-amber-500 fill-amber-500" />}
                  </div>
                  <p className={`text-xl ${darkMode ? 'text-gray-100' : 'text-gray-900'} whitespace-pre-wrap`}>
                    {current.question}
                  </p>
                  {current.question_image && (
                    <img src={current.question_image} alt="" className="max-h-48 rounded-lg mx-auto" />
                  )}
                </>
              )}
              <p className={`text-center text-sm mt-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {isTip ? 'Click to continue' : 'Click to reveal answer'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {isTip ? (
                <div className="flex flex-col items-center justify-center min-h-64">
                  <CheckCircle size={48} className="text-green-500 mb-4" />
                  <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Tip reviewed!
                  </p>
                </div>
              ) : (
                <>
                  <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Model Answer</h4>
                  <p className={`text-lg ${darkMode ? 'text-gray-100' : 'text-gray-900'} whitespace-pre-wrap`}>
                    {current.model_answer || 'No model answer provided'}
                  </p>
                  {current.model_answer_image && (
                    <img src={current.model_answer_image} alt="" className="max-h-48 rounded-lg mx-auto" />
                  )}
                  {current.explanation && (
                    <>
                      <h4 className={`text-sm font-medium mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Explanation</h4>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} whitespace-pre-wrap`}>
                        {current.explanation}
                      </p>
                    </>
                  )}
                </>
              )}
              <p className={`text-center text-sm mt-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Click to hide answer
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            disabled={currentIndex === 0}
            className={`p-3 rounded-full transition-colors ${
              currentIndex === 0
                ? 'opacity-30 cursor-not-allowed'
                : darkMode
                  ? 'bg-gray-800 hover:bg-gray-700 text-white'
                  : 'bg-white hover:bg-gray-100 text-gray-900'
            }`}
          >
            <ArrowLeft size={24} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            disabled={currentIndex === items.length - 1}
            className={`p-3 rounded-full transition-colors ${
              currentIndex === items.length - 1
                ? 'opacity-30 cursor-not-allowed'
                : darkMode
                  ? 'bg-gray-800 hover:bg-gray-700 text-white'
                  : 'bg-white hover:bg-gray-100 text-gray-900'
            }`}
          >
            <ArrowRight size={24} />
          </button>
        </div>
      </div>
    </div>
  )
}

// Main App Component
export default function StudyNotesApp() {
  // Auth state
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  // Data state
  const [subjects, setSubjects] = useState([])
  const [modules, setModules] = useState([])
  const [mistakeNotes, setMistakeNotes] = useState([])
  const [tips, setTips] = useState([])
  const [mistakeTypes, setMistakeTypes] = useState([])
  const [settings, setSettings] = useState({ dark_mode: true })
  const [loading, setLoading] = useState(false)

  // UI state
  const [darkMode, setDarkMode] = useState(true)
  const [activeView, setActiveView] = useState('subjects')
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [selectedTab, setSelectedTab] = useState('mistakes')
  const [selectedModule, setSelectedModule] = useState(null)
  const [showImportantOnly, setShowImportantOnly] = useState(false)
  const [flashcardItems, setFlashcardItems] = useState(null)
  const [showAddModule, setShowAddModule] = useState(false)
  const [newModuleName, setNewModuleName] = useState('')
  const [newTipText, setNewTipText] = useState('')

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setAuthLoading(false)
    }
    
    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Load data when user logs in
  useEffect(() => {
    if (user) {
      loadInitialData()
    }
  }, [user])

  const loadInitialData = async () => {
    setLoading(true)
    try {
      const [subjectsData, mistakeTypesData, settingsData] = await Promise.all([
        db.getSubjects(),
        db.getMistakeTypes(),
        db.getUserSettings()
      ])
      
      setSubjects(subjectsData || [])
      setMistakeTypes(mistakeTypesData || [])
      if (settingsData) {
        setSettings(settingsData)
        setDarkMode(settingsData.dark_mode)
      }
    } catch (err) {
      console.error('Failed to load data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Load modules and notes when subject changes
  useEffect(() => {
    if (selectedSubject) {
      loadSubjectData(selectedSubject.id)
    }
  }, [selectedSubject])

  const loadSubjectData = async (subjectId) => {
    try {
      const [modulesData, notesData, tipsData] = await Promise.all([
        db.getModules(subjectId),
        db.getMistakeNotes(null, subjectId),
        db.getTips(null, subjectId)
      ])
      
      setModules(modulesData || [])
      setMistakeNotes(notesData || [])
      setTips(tipsData || [])
      
      // Set default selected module
      const mistakeModules = (modulesData || []).filter(m => m.module_type === 'mistake')
      const tipModules = (modulesData || []).filter(m => m.module_type === 'tip')
      
      if (selectedTab === 'mistakes' && mistakeModules.length > 0) {
        setSelectedModule(mistakeModules[0])
      } else if (selectedTab === 'tips' && tipModules.length > 0) {
        setSelectedModule(tipModules[0])
      } else {
        setSelectedModule(null)
      }
    } catch (err) {
      console.error('Failed to load subject data:', err)
    }
  }

  // Handle dark mode toggle
  const toggleDarkMode = async () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    try {
      await db.updateUserSettings({ dark_mode: newMode })
    } catch (err) {
      console.error('Failed to save setting:', err)
    }
  }

  // Handle sign out
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setSubjects([])
    setModules([])
    setMistakeNotes([])
    setTips([])
  }

  // Subject operations
  const addSubject = async () => {
    try {
      const newSubject = await db.createSubject({
        name: 'New Subject',
        icon: '📚',
        color: 'blue',
        sort_order: subjects.length
      })
      setSubjects([...subjects, newSubject])
    } catch (err) {
      console.error('Failed to create subject:', err)
    }
  }

  const updateSubject = async (id, updates) => {
    try {
      const updated = await db.updateSubject(id, updates)
      setSubjects(subjects.map(s => s.id === id ? updated : s))
    } catch (err) {
      console.error('Failed to update subject:', err)
    }
  }

  const deleteSubject = async (id) => {
    if (!confirm('Delete this subject and all its content?')) return
    try {
      await db.deleteSubject(id)
      setSubjects(subjects.filter(s => s.id !== id))
    } catch (err) {
      console.error('Failed to delete subject:', err)
    }
  }

  // Module operations
  const addModule = async () => {
    if (!newModuleName.trim() || !selectedSubject) return
    try {
      const newModule = await db.createModule({
        subject_id: selectedSubject.id,
        name: newModuleName,
        module_type: selectedTab === 'mistakes' ? 'mistake' : 'tip',
        sort_order: modules.filter(m => m.module_type === (selectedTab === 'mistakes' ? 'mistake' : 'tip')).length
      })
      setModules([...modules, newModule])
      setSelectedModule(newModule)
      setNewModuleName('')
      setShowAddModule(false)
    } catch (err) {
      console.error('Failed to create module:', err)
    }
  }

  // Mistake operations
  const addMistake = async () => {
    if (!selectedSubject || !selectedModule) return
    try {
      const newNote = await db.createMistakeNote({
        subject_id: selectedSubject.id,
        module_id: selectedModule.id,
        title: '',
        sort_order: mistakeNotes.filter(n => n.module_id === selectedModule.id).length
      })
      setMistakeNotes([...mistakeNotes, { ...newNote, redo_attempts: [], isNew: true }])
    } catch (err) {
      console.error('Failed to create mistake:', err)
    }
  }

  const updateMistake = async (id, updates) => {
    try {
      const updated = await db.updateMistakeNote(id, updates)
      setMistakeNotes(mistakeNotes.map(n => n.id === id ? { ...n, ...updated, isNew: false } : n))
    } catch (err) {
      console.error('Failed to update mistake:', err)
    }
  }

  const deleteMistake = async (id) => {
    try {
      await db.deleteMistakeNote(id)
      setMistakeNotes(mistakeNotes.filter(n => n.id !== id))
    } catch (err) {
      console.error('Failed to delete mistake:', err)
    }
  }

  // Redo attempt operations
  const addRedoAttempt = async (mistakeNoteId, attempt) => {
    try {
      const newAttempt = await db.createRedoAttempt({
        mistake_note_id: mistakeNoteId,
        ...attempt
      })
      setMistakeNotes(mistakeNotes.map(n => {
        if (n.id === mistakeNoteId) {
          return { ...n, redo_attempts: [...(n.redo_attempts || []), newAttempt] }
        }
        return n
      }))
    } catch (err) {
      console.error('Failed to add redo attempt:', err)
    }
  }

  // Tip operations
  const addTip = async () => {
    if (!newTipText.trim() || !selectedSubject || !selectedModule) return
    try {
      const newTip = await db.createTip({
        subject_id: selectedSubject.id,
        module_id: selectedModule.id,
        text: newTipText,
        sort_order: tips.filter(t => t.module_id === selectedModule.id).length
      })
      setTips([...tips, newTip])
      setNewTipText('')
    } catch (err) {
      console.error('Failed to create tip:', err)
    }
  }

  const updateTip = async (id, updates) => {
    try {
      const updated = await db.updateTip(id, updates)
      setTips(tips.map(t => t.id === id ? updated : t))
    } catch (err) {
      console.error('Failed to update tip:', err)
    }
  }

  const deleteTip = async (id) => {
    try {
      await db.deleteTip(id)
      setTips(tips.filter(t => t.id !== id))
    } catch (err) {
      console.error('Failed to delete tip:', err)
    }
  }

  // Mistake type operations
  const addMistakeType = async (name) => {
    try {
      const newType = await db.createMistakeType(name)
      setMistakeTypes([...mistakeTypes, newType])
    } catch (err) {
      console.error('Failed to add mistake type:', err)
    }
  }

  const removeMistakeType = async (id) => {
    try {
      await db.deleteMistakeType(id)
      setMistakeTypes(mistakeTypes.filter(t => t.id !== id))
    } catch (err) {
      console.error('Failed to delete mistake type:', err)
    }
  }

  // Filtered data
  const currentModules = modules.filter(m => 
    m.module_type === (selectedTab === 'mistakes' ? 'mistake' : 'tip')
  )

  const currentMistakes = useMemo(() => {
    let filtered = mistakeNotes.filter(n => n.module_id === selectedModule?.id)
    if (showImportantOnly) {
      filtered = filtered.filter(n => n.is_important)
    }
    return filtered.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
  }, [mistakeNotes, selectedModule, showImportantOnly])

  const currentTips = useMemo(() => {
    let filtered = tips.filter(t => t.module_id === selectedModule?.id)
    if (showImportantOnly) {
      filtered = filtered.filter(t => t.is_important)
    }
    return filtered.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
  }, [tips, selectedModule, showImportantOnly])

  // Auth loading
  if (authLoading) {
    return <LoadingScreen />
  }

  // Not logged in
  if (!user) {
    return <AuthForm onSuccess={() => {}} />
  }

  // Loading data
  if (loading && subjects.length === 0) {
    return <LoadingScreen />
  }

  // Styles
  const bgColor = darkMode ? 'bg-gray-900' : 'bg-gray-50'
  const textColor = darkMode ? 'text-gray-100' : 'text-gray-900'
  const secondaryText = darkMode ? 'text-gray-400' : 'text-gray-500'
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white'
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200'

  return (
    <div className={`min-h-screen ${bgColor} ${textColor}`}>
      {/* Flashcard Modal */}
      <AnimatePresence>
        {flashcardItems && (
          <FlashcardMode
            items={flashcardItems}
            onClose={() => setFlashcardItems(null)}
            darkMode={darkMode}
          />
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className={`sticky top-0 z-40 ${cardBg} border-b ${borderColor}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <BookOpen className="text-blue-500" size={24} />
              <span className="font-semibold text-lg">StudyNotes</span>
            </div>
            
            <div className="flex items-center gap-1">
              {[
                { id: 'subjects', icon: BookOpen, label: 'Subjects' },
                { id: 'schedule', icon: Calendar, label: 'Schedule' },
                { id: 'study', icon: Shuffle, label: 'Study' },
                { id: 'settings', icon: Settings, label: 'Settings' },
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => { setActiveView(id); setSelectedSubject(null); }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    activeView === id
                      ? 'bg-blue-500/20 text-blue-400'
                      : darkMode
                        ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={handleSignOut}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                }`}
                title="Sign Out"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Subjects List */}
        {activeView === 'subjects' && !selectedSubject && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Your Subjects</h1>
              <button
                onClick={addSubject}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                <Plus size={18} />
                Add Subject
              </button>
            </div>

            {subjects.length === 0 ? (
              <div className={`text-center py-16 ${secondaryText}`}>
                <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No subjects yet</p>
                <p className="text-sm">Create your first subject to start tracking mistakes</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjects.map((subject) => {
                  const subjectMistakes = mistakeNotes.filter(n => n.subject_id === subject.id).length
                  const subjectTips = tips.filter(t => t.subject_id === subject.id).length

                  return (
                    <motion.div
                      key={subject.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-6 rounded-2xl cursor-pointer transition-colors ${cardBg} border ${borderColor} hover:border-blue-500/50`}
                      onClick={() => setSelectedSubject(subject)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="text-4xl mb-3">{subject.icon}</div>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteSubject(subject.id); }}
                          className={`p-1 rounded opacity-0 hover:opacity-100 transition-opacity ${
                            darkMode ? 'hover:bg-red-500/20 text-gray-400 hover:text-red-400' : 'hover:bg-red-50 text-gray-400 hover:text-red-500'
                          }`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{subject.name}</h3>
                      <div className={`flex items-center gap-4 text-sm ${secondaryText}`}>
                        <span className="flex items-center gap-1">
                          <AlertCircle size={14} />
                          {subjectMistakes} mistakes
                        </span>
                        <span className="flex items-center gap-1">
                          <Lightbulb size={14} />
                          {subjectTips} tips
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Subject Detail View */}
        {activeView === 'subjects' && selectedSubject && (
          <div>
            <button
              onClick={() => setSelectedSubject(null)}
              className={`flex items-center gap-2 mb-6 ${secondaryText} hover:${textColor} transition-colors`}
            >
              <ArrowLeft size={18} />
              Back to Subjects
            </button>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl">{selectedSubject.icon}</span>
              <div>
                <h1 className="text-2xl font-bold">{selectedSubject.name}</h1>
                <p className={secondaryText}>Manage your mistakes and tips</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-4 mb-6 flex-wrap">
              <div className={`flex rounded-lg p-1 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <button
                  onClick={() => {
                    setSelectedTab('mistakes')
                    const mistakeModules = modules.filter(m => m.module_type === 'mistake')
                    setSelectedModule(mistakeModules[0] || null)
                  }}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    selectedTab === 'mistakes'
                      ? 'bg-blue-500 text-white'
                      : secondaryText
                  }`}
                >
                  Mistakes
                </button>
                <button
                  onClick={() => {
                    setSelectedTab('tips')
                    const tipModules = modules.filter(m => m.module_type === 'tip')
                    setSelectedModule(tipModules[0] || null)
                  }}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    selectedTab === 'tips'
                      ? 'bg-blue-500 text-white'
                      : secondaryText
                  }`}
                >
                  Tips & Tricks
                </button>
              </div>

              <button
                onClick={() => setShowImportantOnly(!showImportantOnly)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                  showImportantOnly
                    ? 'border-amber-500 text-amber-500 bg-amber-500/10'
                    : `${borderColor} ${secondaryText}`
                }`}
              >
                <Star size={16} className={showImportantOnly ? 'fill-amber-500' : ''} />
                Important Only
              </button>
            </div>

            {/* Module Selector */}
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              {currentModules.map((module) => (
                <button
                  key={module.id}
                  onClick={() => setSelectedModule(module)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    selectedModule?.id === module.id
                      ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                      : `${borderColor} ${secondaryText} hover:border-gray-500`
                  }`}
                >
                  {module.name}
                </button>
              ))}
              
              {showAddModule ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newModuleName}
                    onChange={(e) => setNewModuleName(e.target.value)}
                    placeholder="Module name..."
                    className={`px-3 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-800 border-gray-600 text-gray-100'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    onKeyPress={(e) => e.key === 'Enter' && addModule()}
                    autoFocus
                  />
                  <button
                    onClick={addModule}
                    className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                  >
                    <Check size={18} />
                  </button>
                  <button
                    onClick={() => { setShowAddModule(false); setNewModuleName(''); }}
                    className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddModule(true)}
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg border border-dashed transition-colors ${
                    darkMode
                      ? 'border-gray-600 text-gray-400 hover:border-gray-500'
                      : 'border-gray-300 text-gray-500 hover:border-gray-400'
                  }`}
                >
                  <Plus size={16} />
                  Add Module
                </button>
              )}
            </div>

            {/* Mistakes Content */}
            {selectedTab === 'mistakes' && (
              <div className="space-y-3">
                {!selectedModule ? (
                  <div className={`text-center py-12 ${secondaryText}`}>
                    <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">No modules created yet</p>
                    <p className="text-sm">Create a module to start adding mistake notes</p>
                  </div>
                ) : (
                  <>
                    {currentMistakes.map((mistake) => (
                      <MistakeCard
                        key={mistake.id}
                        mistake={mistake}
                        modules={modules.filter(m => m.module_type === 'mistake')}
                        mistakeTypes={mistakeTypes}
                        darkMode={darkMode}
                        onUpdate={(updates) => updateMistake(mistake.id, updates)}
                        onDelete={() => deleteMistake(mistake.id)}
                        onAddRedoAttempt={(attempt) => addRedoAttempt(mistake.id, attempt)}
                        onStartFlashcard={() => setFlashcardItems([{ ...mistake, type: 'mistake' }])}
                        borderColor={borderColor}
                        secondaryText={secondaryText}
                      />
                    ))}

                    {currentMistakes.length === 0 && (
                      <div className={`text-center py-12 ${secondaryText}`}>
                        <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
                        <p>{showImportantOnly ? 'No important mistakes in this module' : 'No mistakes in this module yet'}</p>
                      </div>
                    )}

                    <button
                      onClick={addMistake}
                      className={`w-full py-4 rounded-xl border-2 border-dashed transition-colors flex items-center justify-center gap-2 ${
                        darkMode
                          ? 'border-gray-700 text-gray-400 hover:border-blue-500 hover:text-blue-400'
                          : 'border-gray-200 text-gray-400 hover:border-blue-500 hover:text-blue-500'
                      }`}
                    >
                      <Plus size={20} />
                      Add Mistake Note
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Tips Content */}
            {selectedTab === 'tips' && (
              <div className="space-y-3">
                {!selectedModule ? (
                  <div className={`text-center py-12 ${secondaryText}`}>
                    <Lightbulb size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">No modules created yet</p>
                    <p className="text-sm">Create a module to start adding tips</p>
                  </div>
                ) : (
                  <>
                    {currentTips.map((tip) => (
                      <TipCard
                        key={tip.id}
                        tip={tip}
                        darkMode={darkMode}
                        onUpdate={(updates) => updateTip(tip.id, updates)}
                        onDelete={() => deleteTip(tip.id)}
                      />
                    ))}

                    {currentTips.length === 0 && (
                      <div className={`text-center py-12 ${secondaryText}`}>
                        <Lightbulb size={48} className="mx-auto mb-4 opacity-50" />
                        <p>{showImportantOnly ? 'No important tips in this module' : 'No tips in this module yet'}</p>
                      </div>
                    )}

                    {/* Add Tip Form */}
                    <div className={`p-4 rounded-xl ${cardBg} border ${borderColor}`}>
                      <textarea
                        value={newTipText}
                        onChange={(e) => setNewTipText(e.target.value)}
                        placeholder="Add a new tip..."
                        className={`w-full px-3 py-2 rounded-lg border resize-none ${
                          darkMode
                            ? 'bg-gray-700 border-gray-600 text-gray-100'
                            : 'bg-gray-50 border-gray-200 text-gray-900'
                        }`}
                        rows={2}
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={addTip}
                          disabled={!newTipText.trim()}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                            newTipText.trim()
                              ? 'bg-blue-500 text-white hover:bg-blue-600'
                              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          <Plus size={16} />
                          Add Tip
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Schedule View */}
        {activeView === 'schedule' && (
          <ScheduleView
            darkMode={darkMode}
            cardBg={cardBg}
            borderColor={borderColor}
            secondaryText={secondaryText}
            onStartFlashcard={(items) => setFlashcardItems(items)}
          />
        )}

        {/* Study Mode View */}
        {activeView === 'study' && (
          <StudyView
            subjects={subjects}
            modules={modules}
            mistakes={mistakeNotes}
            tips={tips}
            darkMode={darkMode}
            cardBg={cardBg}
            borderColor={borderColor}
            secondaryText={secondaryText}
            onStartStudy={(items) => setFlashcardItems(items)}
          />
        )}

        {/* Settings View */}
        {activeView === 'settings' && (
          <SettingsView
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            mistakeTypes={mistakeTypes}
            onAddMistakeType={addMistakeType}
            onRemoveMistakeType={removeMistakeType}
            cardBg={cardBg}
            borderColor={borderColor}
            secondaryText={secondaryText}
            user={user}
          />
        )}
      </main>
    </div>
  )
}

// Mistake Card Component
function MistakeCard({ mistake, modules, mistakeTypes, darkMode, onUpdate, onDelete, onAddRedoAttempt, onStartFlashcard, borderColor, secondaryText }) {
  const [isExpanded, setIsExpanded] = useState(mistake.isNew)
  const [isEditing, setIsEditing] = useState(mistake.isNew)
  const [editData, setEditData] = useState(mistake)
  const [showRedoForm, setShowRedoForm] = useState(false)
  const [newRedoText, setNewRedoText] = useState('')
  const [newRedoStatus, setNewRedoStatus] = useState('success')
  const [newRedoImage, setNewRedoImage] = useState(null)
  const [expandedAttempts, setExpandedAttempts] = useState({})
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    const { id, isNew, redo_attempts, ...updateData } = editData
    await onUpdate(updateData)
    setIsEditing(false)
    setIsExpanded(false)
    setSaving(false)
  }

  const handleCancel = () => {
    if (mistake.isNew) {
      onDelete()
    } else {
      setIsEditing(false)
      setEditData(mistake)
    }
  }

  const handleAddRedoAttempt = async () => {
    if (!newRedoText.trim()) return
    await onAddRedoAttempt({
      notes: newRedoText,
      status: newRedoStatus,
      image: newRedoImage,
      attempt_date: new Date().toISOString()
    })
    setNewRedoText('')
    setNewRedoStatus('success')
    setNewRedoImage(null)
    setShowRedoForm(false)
  }

  const scheduleRedo = (days) => {
    const newDate = addDays(new Date(), days)
    setEditData({ ...editData, scheduled_redo: newDate.toISOString() })
  }

  const dueStatus = useMemo(() => {
    if (!mistake.scheduled_redo) return null
    if (isToday(mistake.scheduled_redo)) return 'today'
    if (isPastDue(mistake.scheduled_redo)) return 'overdue'
    return 'upcoming'
  }, [mistake.scheduled_redo])

  const redoAttempts = mistake.redo_attempts || []

  return (
    <div
      className={`rounded-xl border overflow-hidden ${
        darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
      } ${mistake.is_important ? (darkMode ? 'ring-2 ring-amber-500/50' : 'ring-2 ring-amber-400/50') : ''}`}
    >
      {/* Header */}
      <div
        className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
          darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
        }`}
        onClick={() => !mistake.isNew && setIsExpanded(!isExpanded)}
      >
        <GripVertical size={16} className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
        
        <button onClick={(e) => { e.stopPropagation(); if (!mistake.isNew) setIsExpanded(!isExpanded); }}>
          {isExpanded ? (
            <ChevronDown size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
          ) : (
            <ChevronRight size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-medium truncate ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              {mistake.title || 'Untitled Question'}
            </span>
            {mistake.is_important && <Star size={14} className="text-amber-500 fill-amber-500 flex-shrink-0" />}
            {dueStatus === 'today' && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">Today</span>
            )}
            {dueStatus === 'overdue' && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">Overdue</span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className={`text-xs ${secondaryText}`}>
              {modules.find(m => m.id === mistake.module_id)?.name || 'No Module'}
            </span>
            {mistake.mistake_types?.length > 0 && (
              <span className={`text-xs ${secondaryText}`}>
                • {mistake.mistake_types.slice(0, 2).join(', ')}{mistake.mistake_types.length > 2 ? '...' : ''}
              </span>
            )}
            {redoAttempts.length > 0 && (
              <div className="flex items-center gap-1">
                <span className={`text-xs ${secondaryText}`}>•</span>
                {redoAttempts.slice(-3).map((attempt) => {
                  const StatusIcon = getStatusIcon(attempt.status)
                  return (
                    <StatusIcon
                      key={attempt.id}
                      size={12}
                      className={
                        attempt.status === 'success' ? 'text-green-500' :
                        attempt.status === 'partial' ? 'text-yellow-500' :
                        'text-red-500'
                      }
                    />
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onStartFlashcard(); }}
            className={`p-2 rounded-lg transition-colors ${
              darkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <Play size={16} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setIsEditing(true); setIsExpanded(true); }}
            className={`p-2 rounded-lg transition-colors ${
              darkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className={`p-2 rounded-lg transition-colors ${
              darkMode ? 'hover:bg-red-500/20 text-gray-400 hover:text-red-400' : 'hover:bg-red-50 text-gray-500 hover:text-red-500'
            }`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className={`px-4 pb-4 pt-2 border-t ${borderColor}`}>
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Title</label>
                      <input
                        type="text"
                        value={editData.title || ''}
                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                        placeholder="Question title..."
                        className={`w-full mt-1 px-3 py-2 rounded-lg border transition-colors ${
                          darkMode
                            ? 'bg-gray-800 border-gray-600 text-gray-100 focus:border-blue-500'
                            : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                        } focus:outline-none`}
                      />
                    </div>
                    <div>
                      <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Module</label>
                      <select
                        value={editData.module_id || ''}
                        onChange={(e) => setEditData({ ...editData, module_id: e.target.value })}
                        className={`w-full mt-1 px-3 py-2 rounded-lg border transition-colors ${
                          darkMode
                            ? 'bg-gray-800 border-gray-600 text-gray-100'
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none`}
                      >
                        {modules.map((module) => (
                          <option key={module.id} value={module.id}>{module.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <RichInput
                    label="Original Question"
                    value={editData.question}
                    image={editData.question_image}
                    onTextChange={(v) => setEditData({ ...editData, question: v })}
                    onImageChange={(v) => setEditData({ ...editData, question_image: v })}
                    darkMode={darkMode}
                  />

                  <RichInput
                    label="My Incorrect Answer"
                    value={editData.incorrect_answer}
                    image={editData.incorrect_answer_image}
                    onTextChange={(v) => setEditData({ ...editData, incorrect_answer: v })}
                    onImageChange={(v) => setEditData({ ...editData, incorrect_answer_image: v })}
                    darkMode={darkMode}
                  />

                  <RichInput
                    label="Model Answer"
                    value={editData.model_answer}
                    image={editData.model_answer_image}
                    onTextChange={(v) => setEditData({ ...editData, model_answer: v })}
                    onImageChange={(v) => setEditData({ ...editData, model_answer_image: v })}
                    darkMode={darkMode}
                  />

                  <RichInput
                    label="Explanation"
                    value={editData.explanation}
                    image={editData.explanation_image}
                    onTextChange={(v) => setEditData({ ...editData, explanation: v })}
                    onImageChange={(v) => setEditData({ ...editData, explanation_image: v })}
                    darkMode={darkMode}
                  />

                  <div>
                    <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Type of Mistake</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {mistakeTypes.map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => {
                            const types = editData.mistake_types || []
                            if (types.includes(type.name)) {
                              setEditData({ ...editData, mistake_types: types.filter(t => t !== type.name) })
                            } else {
                              setEditData({ ...editData, mistake_types: [...types, type.name] })
                            }
                          }}
                          className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                            (editData.mistake_types || []).includes(type.name)
                              ? 'bg-blue-500 border-blue-500 text-white'
                              : darkMode
                                ? 'border-gray-600 text-gray-300 hover:border-gray-500'
                                : 'border-gray-300 text-gray-600 hover:border-gray-400'
                          }`}
                        >
                          {type.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editData.is_important || false}
                        onChange={(e) => setEditData({ ...editData, is_important: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Mark as Important
                      </span>
                      <Star size={14} className="text-amber-500" />
                    </label>
                  </div>

                  <div>
                    <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Schedule Redo</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {redoIntervals.map(({ days, label }) => (
                        <button
                          key={days}
                          type="button"
                          onClick={() => scheduleRedo(days)}
                          className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                            darkMode
                              ? 'border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400'
                              : 'border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-500'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                      <input
                        type="date"
                        value={editData.scheduled_redo ? new Date(editData.scheduled_redo).toISOString().split('T')[0] : ''}
                        onChange={(e) => setEditData({ ...editData, scheduled_redo: e.target.value ? new Date(e.target.value).toISOString() : null })}
                        className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                          darkMode
                            ? 'bg-gray-800 border-gray-600 text-gray-300'
                            : 'bg-white border-gray-300 text-gray-600'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        darkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center gap-2"
                    >
                      {saving && <Loader2 size={16} className="animate-spin" />}
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {mistake.question && (
                    <div>
                      <h4 className={`text-sm font-medium mb-1 ${secondaryText}`}>Original Question</h4>
                      <p className={`${darkMode ? 'text-gray-200' : 'text-gray-800'} whitespace-pre-wrap`}>{mistake.question}</p>
                      {mistake.question_image && <img src={mistake.question_image} alt="" className="mt-2 max-h-60 rounded-lg" />}
                    </div>
                  )}

                  {mistake.incorrect_answer && (
                    <div>
                      <h4 className={`text-sm font-medium mb-1 ${secondaryText}`}>My Incorrect Answer</h4>
                      <p className={`${darkMode ? 'text-gray-200' : 'text-gray-800'} whitespace-pre-wrap`}>{mistake.incorrect_answer}</p>
                      {mistake.incorrect_answer_image && <img src={mistake.incorrect_answer_image} alt="" className="mt-2 max-h-60 rounded-lg" />}
                    </div>
                  )}

                  {mistake.model_answer && (
                    <div>
                      <h4 className={`text-sm font-medium mb-1 ${secondaryText}`}>Model Answer</h4>
                      <p className={`${darkMode ? 'text-gray-200' : 'text-gray-800'} whitespace-pre-wrap`}>{mistake.model_answer}</p>
                      {mistake.model_answer_image && <img src={mistake.model_answer_image} alt="" className="mt-2 max-h-60 rounded-lg" />}
                    </div>
                  )}

                  {mistake.explanation && (
                    <div>
                      <h4 className={`text-sm font-medium mb-1 ${secondaryText}`}>Explanation</h4>
                      <p className={`${darkMode ? 'text-gray-200' : 'text-gray-800'} whitespace-pre-wrap`}>{mistake.explanation}</p>
                      {mistake.explanation_image && <img src={mistake.explanation_image} alt="" className="mt-2 max-h-60 rounded-lg" />}
                    </div>
                  )}

                  {/* Redo Attempts */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`text-sm font-medium ${secondaryText}`}>
                        Redo Attempts ({redoAttempts.length})
                      </h4>
                      <button
                        type="button"
                        onClick={() => setShowRedoForm(true)}
                        className={`text-sm flex items-center gap-1 ${
                          darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600'
                        }`}
                      >
                        <Plus size={14} /> Add Attempt
                      </button>
                    </div>

                    {showRedoForm && (
                      <div className={`p-3 rounded-lg mb-3 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                        <div className="flex gap-2 mb-3">
                          {redoStatuses.map(({ id, label }) => {
                            const StatusIcon = getStatusIcon(id)
                            return (
                              <button
                                key={id}
                                type="button"
                                onClick={() => setNewRedoStatus(id)}
                                className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                                  newRedoStatus === id
                                    ? id === 'success' ? 'border-green-500 bg-green-500/20 text-green-400' :
                                      id === 'partial' ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400' :
                                      'border-red-500 bg-red-500/20 text-red-400'
                                    : darkMode ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-600'
                                }`}
                              >
                                <StatusIcon size={14} />
                                {label}
                              </button>
                            )
                          })}
                        </div>
                        <textarea
                          value={newRedoText}
                          onChange={(e) => setNewRedoText(e.target.value)}
                          placeholder="Notes on this redo attempt..."
                          className={`w-full px-3 py-2 rounded-lg border resize-none ${
                            darkMode
                              ? 'bg-gray-800 border-gray-600 text-gray-100'
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                          rows={3}
                        />
                        <div className="mt-2">
                          <ImageUpload value={newRedoImage} onChange={setNewRedoImage} darkMode={darkMode} />
                        </div>
                        <div className="flex justify-end gap-2 mt-3">
                          <button
                            type="button"
                            onClick={() => { setShowRedoForm(false); setNewRedoText(''); setNewRedoImage(null); }}
                            className={`px-3 py-1 text-sm rounded-lg ${
                              darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'
                            }`}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleAddRedoAttempt}
                            className="px-3 py-1 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                          >
                            Save Attempt
                          </button>
                        </div>
                      </div>
                    )}

                    {redoAttempts.map((attempt, index) => {
                      const StatusIcon = getStatusIcon(attempt.status)
                      const isAttemptExpanded = expandedAttempts[attempt.id]
                      
                      return (
                        <div
                          key={attempt.id}
                          className={`mb-2 rounded-lg overflow-hidden ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'}`}
                        >
                          <button
                            type="button"
                            onClick={() => setExpandedAttempts(prev => ({ ...prev, [attempt.id]: !prev[attempt.id] }))}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-left ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                          >
                            {isAttemptExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(attempt.status, darkMode)}`}>
                              <StatusIcon size={12} className="inline mr-1" />
                              {attempt.status === 'success' ? 'Success' : attempt.status === 'partial' ? 'Partial' : 'Fail'}
                            </span>
                            <span className="font-medium">Redo Attempt {index + 1}</span>
                            <span className={`text-xs ${secondaryText}`}>
                              - {formatDate(attempt.attempt_date)}
                            </span>
                          </button>
                          
                          {isAttemptExpanded && (
                            <div className={`px-3 pb-3 ${secondaryText}`}>
                              <p className="whitespace-pre-wrap">{attempt.notes}</p>
                              {attempt.image && (
                                <img src={attempt.image} alt="" className="mt-2 max-h-40 rounded-lg" />
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Tip Card Component
function TipCard({ tip, darkMode, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(tip.text)

  const handleSave = async () => {
    await onUpdate({ text: editText })
    setIsEditing(false)
  }

  const toggleImportant = async () => {
    await onUpdate({ is_important: !tip.is_important })
  }

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-lg ${
        darkMode ? 'bg-gray-800/50' : 'bg-white'
      } ${tip.is_important ? (darkMode ? 'ring-2 ring-amber-500/50' : 'ring-2 ring-amber-400/50') : ''}`}
    >
      <GripVertical size={16} className={`mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'} flex-shrink-0`} />
      <Lightbulb size={16} className="mt-1 text-amber-500 flex-shrink-0" />
      
      {isEditing ? (
        <div className="flex-1">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className={`w-full px-3 py-2 rounded-lg border resize-none ${
              darkMode
                ? 'bg-gray-800 border-gray-600 text-gray-100'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            rows={2}
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => { setIsEditing(false); setEditText(tip.text); }}
              className={`px-3 py-1 text-sm rounded-lg ${
                darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 flex items-start gap-2">
            <p className={`flex-1 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{tip.text}</p>
            {tip.is_important && <Star size={14} className="text-amber-500 fill-amber-500 flex-shrink-0 mt-1" />}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={toggleImportant}
              className={`p-1.5 rounded-lg transition-colors ${
                tip.is_important
                  ? 'text-amber-500 hover:bg-amber-500/20'
                  : darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              }`}
            >
              <Star size={14} className={tip.is_important ? 'fill-amber-500' : ''} />
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className={`p-1.5 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              }`}
            >
              <Edit3 size={14} />
            </button>
            <button
              onClick={onDelete}
              className={`p-1.5 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-red-500/20 text-gray-400 hover:text-red-400' : 'hover:bg-red-50 text-gray-500 hover:text-red-500'
              }`}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// Schedule View Component
function ScheduleView({ darkMode, cardBg, borderColor, secondaryText, onStartFlashcard }) {
  const [scheduledItems, setScheduledItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSchedule()
  }, [])

  const loadSchedule = async () => {
    try {
      const data = await db.getScheduledMistakes()
      setScheduledItems(data || [])
    } catch (err) {
      console.error('Failed to load schedule:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Redo Schedule</h1>
      <p className={`${secondaryText} mb-6`}>Questions scheduled for review</p>

      {scheduledItems.length > 0 ? (
        <div className="space-y-3">
          {scheduledItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl ${cardBg} border ${
                isPastDue(item.scheduled_redo) ? 'border-red-500/50' : 'border-blue-500/50'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{item.subjects?.icon || '📚'}</span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium">{item.title || 'Untitled Question'}</h3>
                      {item.is_important && <Star size={14} className="text-amber-500 fill-amber-500" />}
                      {isPastDue(item.scheduled_redo) && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">Overdue</span>
                      )}
                      {isToday(item.scheduled_redo) && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">Today</span>
                      )}
                    </div>
                    <p className={`text-sm ${secondaryText}`}>
                      {item.subjects?.name || 'Subject'} • {item.modules?.name || 'Module'}
                    </p>
                    <p className={`text-sm mt-1 ${secondaryText}`}>
                      Scheduled: {formatDate(item.scheduled_redo)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onStartFlashcard([{ ...item, type: 'mistake' }])}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors flex-shrink-0"
                >
                  <Play size={16} />
                  Start
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`text-center py-16 ${secondaryText}`}>
          <Calendar size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">No questions scheduled for today</p>
          <p className="text-sm mt-1">Schedule questions from your mistake notes</p>
        </div>
      )}
    </div>
  )
}

// Study View Component
function StudyView({ subjects, modules, mistakes, tips, darkMode, cardBg, borderColor, secondaryText, onStartStudy }) {
  const [studySelections, setStudySelections] = useState({})
  const [studyItemCount, setStudyItemCount] = useState(10)

  const toggleSelection = (subjectId, moduleId) => {
    setStudySelections(prev => ({
      ...prev,
      [`${subjectId}-${moduleId}`]: !prev[`${subjectId}-${moduleId}`]
    }))
  }

  const startStudy = () => {
    const items = []
    
    Object.entries(studySelections).forEach(([key, isSelected]) => {
      if (isSelected) {
        const [subjectId, moduleId] = key.split('-')
        
        const moduleMistakes = mistakes.filter(m => m.module_id === moduleId)
        moduleMistakes.forEach(m => items.push({ ...m, type: 'mistake' }))
        
        const moduleTips = tips.filter(t => t.module_id === moduleId)
        moduleTips.forEach(t => items.push({ ...t, type: 'tip' }))
      }
    })

    const shuffled = items.sort(() => Math.random() - 0.5)
    const limited = shuffled.slice(0, studyItemCount)
    
    if (limited.length > 0) {
      onStartStudy(limited)
    } else {
      alert('Please select at least one module with content')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Study Mode</h1>
      <p className={`${secondaryText} mb-6`}>Select subjects and modules to review</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`p-6 rounded-2xl ${cardBg} border ${borderColor}`}>
          <h2 className="font-semibold mb-4">Select Content</h2>
          
          <div className="space-y-4">
            {subjects.map((subject) => {
              const subjectModules = modules.filter(m => m.subject_id === subject.id)
              
              return (
                <div key={subject.id}>
                  <h3 className="flex items-center gap-2 font-medium mb-2">
                    <span>{subject.icon}</span>
                    {subject.name}
                  </h3>
                  <div className="flex flex-wrap gap-2 pl-6">
                    {subjectModules.map((module) => {
                      const isSelected = studySelections[`${subject.id}-${module.id}`]
                      const moduleItems = mistakes.filter(m => m.module_id === module.id).length +
                                         tips.filter(t => t.module_id === module.id).length

                      return (
                        <button
                          key={module.id}
                          onClick={() => toggleSelection(subject.id, module.id)}
                          className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                            isSelected
                              ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                              : `${borderColor} ${secondaryText}`
                          }`}
                        >
                          {module.name} ({moduleItems})
                        </button>
                      )
                    })}
                    {subjectModules.length === 0 && (
                      <span className={`text-sm ${secondaryText}`}>No modules yet</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className={`p-6 rounded-2xl ${cardBg} border ${borderColor}`}>
          <h2 className="font-semibold mb-4">Session Settings</h2>

          <div className="space-y-4">
            <div>
              <label className={`text-sm ${secondaryText}`}>Number of items</label>
              <input
                type="range"
                min="5"
                max="50"
                value={studyItemCount}
                onChange={(e) => setStudyItemCount(parseInt(e.target.value))}
                className="w-full mt-2"
              />
              <div className="flex justify-between text-sm mt-1">
                <span className={secondaryText}>5</span>
                <span className="font-medium">{studyItemCount} items</span>
                <span className={secondaryText}>50</span>
              </div>
            </div>

            <button
              onClick={startStudy}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2"
            >
              <Play size={20} />
              Start Study Session
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Settings View Component
function SettingsView({ darkMode, toggleDarkMode, mistakeTypes, onAddMistakeType, onRemoveMistakeType, cardBg, borderColor, secondaryText, user }) {
  const [newTypeName, setNewTypeName] = useState('')

  const handleAddType = async () => {
    if (!newTypeName.trim()) return
    await onAddMistakeType(newTypeName)
    setNewTypeName('')
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">Settings</h1>
      <p className={`${secondaryText} mb-6`}>Customize your study notes</p>

      <div className="space-y-6">
        {/* Account */}
        <div className={`p-6 rounded-2xl ${cardBg} border ${borderColor}`}>
          <h2 className="font-semibold mb-4">Account</h2>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <User size={24} className={secondaryText} />
            </div>
            <div>
              <p className="font-medium">{user?.email}</p>
              <p className={`text-sm ${secondaryText}`}>Signed in</p>
            </div>
          </div>
        </div>

        {/* Theme */}
        <div className={`p-6 rounded-2xl ${cardBg} border ${borderColor}`}>
          <h2 className="font-semibold mb-4">Appearance</h2>
          <div className="flex items-center justify-between">
            <span>Dark Mode</span>
            <button
              onClick={toggleDarkMode}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                darkMode ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${
                  darkMode ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mistake Types */}
        <div className={`p-6 rounded-2xl ${cardBg} border ${borderColor}`}>
          <h2 className="font-semibold mb-4">Mistake Type Labels</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {mistakeTypes.map((type) => (
              <div
                key={type.id}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${borderColor}`}
              >
                <span className="text-sm">{type.name}</span>
                <button
                  onClick={() => onRemoveMistakeType(type.id)}
                  className="text-gray-400 hover:text-red-400"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value)}
              placeholder="Add new mistake type..."
              className={`flex-1 px-3 py-2 rounded-lg border ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-gray-100'
                  : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
              onKeyPress={(e) => e.key === 'Enter' && handleAddType()}
            />
            <button
              onClick={handleAddType}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}