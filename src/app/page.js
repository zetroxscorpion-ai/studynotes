'use client'
import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter,
  Trash2, 
  Edit3, 
  Save,
  X,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Clock,
  Tag,
  Folder,
  Moon,
  Sun,
  Download,
  Upload,
  RefreshCw,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  Settings,
  ChevronUp,
  Home,
  Menu,
  Sparkles,
  LogOut,
  User,
  BarChart3,
  TrendingUp,
  Target,
  Award,
  Zap,
  Brain,
  ArrowRight,
  Eye,
  EyeOff,
  Copy,
  Share2,
  Archive,
  Star,
  StarOff,
  SortAsc,
  SortDesc,
  Grid,
  List
} from 'lucide-react'
import jsPDF from 'jspdf'
import * as db from '@/lib/database'

// Authentication Component
function AuthScreen({ onLogin, onSignup, darkMode }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        await onLogin(email, password)
      } else {
        if (password !== confirmPassword) {
          setError('Passwords do not match')
          setLoading(false)
          return
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters')
          setLoading(false)
          return
        }
        await onSignup(email, password)
      }
    } catch (err) {
      setError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">StudyNotes</h1>
          <p className="text-gray-400">Track your mistakes, master your subjects</p>
        </div>

        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
          <div className="flex mb-6 bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                isLogin ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                !isLogin ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            )}

            {error && (
              <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Please wait...' : isLogin ? 'Log In' : 'Create Account'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const addDays = (date, days) => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

const getNextWeekend = () => {
  const today = new Date()
  const dayOfWeek = today.getDay() // 0 = Sunday, 6 = Saturday
  
  let daysUntilSaturday
  if (dayOfWeek === 6) {
    // It's Saturday, return today
    daysUntilSaturday = 0
  } else if (dayOfWeek === 0) {
    // It's Sunday, return today (it's already the weekend)
    daysUntilSaturday = 0
  } else {
    // Monday-Friday, calculate days until Saturday
    daysUntilSaturday = 6 - dayOfWeek
  }
  
  return addDays(today, daysUntilSaturday)
}

const isOverdue = (dateString) => {
  if (!dateString) return false
  const date = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

const isDueToday = (dateString) => {
  if (!dateString) return false
  const date = new Date(dateString)
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

const isDueSoon = (dateString) => {
  if (!dateString) return false
  const date = new Date(dateString)
  const today = new Date()
  const threeDaysFromNow = addDays(today, 3)
  return date <= threeDaysFromNow && date >= today
}

// Updated redo intervals with weekend option
const redoIntervals = [
  { days: 1, label: 'Tomorrow' },
  { days: 3, label: '3 days' },
  { days: 7, label: '1 week' },
  { days: 14, label: '2 weeks' },
  { days: 30, label: '1 month' },
  { days: 'weekend', label: 'This Weekend' },
]

// Main App Component
export default function StudyNotesApp() {
  // Force dark mode - always true
  const darkMode = true
  
  // Auth state
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  
  // App state
  const [mistakes, setMistakes] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // UI state
  const [currentView, setCurrentView] = useState('home')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [selectedType, setSelectedType] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState('cards')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Mistake types
  const [mistakeTypes, setMistakeTypes] = useState([
    { id: 'conceptual', name: 'Conceptual Error' },
    { id: 'careless', name: 'Careless Mistake' },
    { id: 'knowledge', name: 'Knowledge Gap' },
    { id: 'application', name: 'Application Error' },
    { id: 'reading', name: 'Misread Question' },
  ])

  // Check auth status on mount
  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const currentUser = await db.getCurrentUser()
      setUser(currentUser)
    } catch (err) {
      console.error('Auth check error:', err)
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogin = async (email, password) => {
    const { user } = await db.signIn(email, password)
    setUser(user)
  }

  const handleSignup = async (email, password) => {
    const { user } = await db.signUp(email, password)
    setUser(user)
  }

  const handleLogout = async () => {
    await db.signOut()
    setUser(null)
    setMistakes([])
    setSubjects([])
  }

  // Load data when user is authenticated
  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [mistakesData, subjectsData, settingsData] = await Promise.all([
        db.getMistakes(),
        db.getSubjects(),
        db.getUserSettings()
      ])
      
      setMistakes(mistakesData || [])
      setSubjects(subjectsData || [])
      
      // Load mistake types if saved
      if (settingsData?.mistake_types) {
        setMistakeTypes(settingsData.mistake_types)
      }
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault()
        setShowAddModal(true)
      }
      if (e.key === 'Escape') {
        setShowAddModal(false)
        setShowFilters(false)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Filter and sort mistakes
  const filteredMistakes = useMemo(() => {
    let filtered = [...mistakes]
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(m => 
        m.question?.toLowerCase().includes(query) ||
        m.correct_answer?.toLowerCase().includes(query) ||
        m.notes?.toLowerCase().includes(query) ||
        m.topic?.toLowerCase().includes(query)
      )
    }
    
    // Subject filter
    if (selectedSubject) {
      filtered = filtered.filter(m => m.subject_id === selectedSubject)
    }
    
    // Type filter
    if (selectedType) {
      filtered = filtered.filter(m => m.mistake_type === selectedType)
    }
    
    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        break
      case 'subject':
        filtered.sort((a, b) => (a.subject_id || '').localeCompare(b.subject_id || ''))
        break
      case 'due':
        filtered.sort((a, b) => {
          if (!a.scheduled_redo) return 1
          if (!b.scheduled_redo) return -1
          return new Date(a.scheduled_redo) - new Date(b.scheduled_redo)
        })
        break
      case 'priority':
        const priorityOrder = { high: 0, medium: 1, low: 2 }
        filtered.sort((a, b) => 
          (priorityOrder[a.priority] || 1) - (priorityOrder[b.priority] || 1)
        )
        break
    }
    
    return filtered
  }, [mistakes, searchQuery, selectedSubject, selectedType, sortBy])

  // Statistics
  const stats = useMemo(() => {
    const total = mistakes.length
    const byType = mistakeTypes.map(type => ({
      ...type,
      count: mistakes.filter(m => m.mistake_type === type.id).length
    }))
    const bySubject = subjects.map(subject => ({
      ...subject,
      count: mistakes.filter(m => m.subject_id === subject.id).length
    }))
    const overdue = mistakes.filter(m => isOverdue(m.scheduled_redo)).length
    const dueToday = mistakes.filter(m => isDueToday(m.scheduled_redo)).length
    const completed = mistakes.filter(m => m.is_resolved).length
    const thisWeek = mistakes.filter(m => {
      const date = new Date(m.created_at)
      const weekAgo = addDays(new Date(), -7)
      return date >= weekAgo
    }).length
    
    return { total, byType, bySubject, overdue, dueToday, completed, thisWeek }
  }, [mistakes, subjects, mistakeTypes])

  // CRUD operations
  const addMistake = async (mistakeData) => {
    try {
      const newMistake = await db.createMistake(mistakeData)
      setMistakes(prev => [newMistake, ...prev])
      setShowAddModal(false)
      return newMistake
    } catch (err) {
      console.error('Error adding mistake:', err)
      throw err
    }
  }

  const updateMistake = async (id, updates) => {
    try {
      const updated = await db.updateMistake(id, updates)
      setMistakes(prev => prev.map(m => m.id === id ? updated : m))
      return updated
    } catch (err) {
      console.error('Error updating mistake:', err)
      throw err
    }
  }

  const deleteMistake = async (id) => {
    try {
      await db.deleteMistake(id)
      setMistakes(prev => prev.filter(m => m.id !== id))
    } catch (err) {
      console.error('Error deleting mistake:', err)
      throw err
    }
  }

  const addSubject = async (name, color) => {
    try {
      const newSubject = await db.createSubject(name, color)
      setSubjects(prev => [...prev, newSubject])
      return newSubject
    } catch (err) {
      console.error('Error adding subject:', err)
      throw err
    }
  }

  const deleteSubject = async (id) => {
    try {
      await db.deleteSubject(id)
      setSubjects(prev => prev.filter(s => s.id !== id))
    } catch (err) {
      console.error('Error deleting subject:', err)
      throw err
    }
  }

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    let yPos = 20
    
    // Title
    doc.setFontSize(24)
    doc.setTextColor(59, 130, 246)
    doc.text('StudyNotes Export', pageWidth / 2, yPos, { align: 'center' })
    yPos += 15
    
    // Date
    doc.setFontSize(10)
    doc.setTextColor(128, 128, 128)
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, yPos, { align: 'center' })
    yPos += 20
    
    // Stats summary
    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.text(`Total Mistakes: ${stats.total}`, 20, yPos)
    yPos += 8
    doc.text(`Completed: ${stats.completed}`, 20, yPos)
    yPos += 8
    doc.text(`Overdue: ${stats.overdue}`, 20, yPos)
    yPos += 15
    
    // Mistakes
    filteredMistakes.forEach((mistake, index) => {
      if (yPos > 260) {
        doc.addPage()
        yPos = 20
      }
      
      const subject = subjects.find(s => s.id === mistake.subject_id)
      
      doc.setFontSize(12)
      doc.setTextColor(59, 130, 246)
      doc.text(`${index + 1}. ${subject?.name || 'No Subject'}`, 20, yPos)
      yPos += 7
      
      doc.setFontSize(10)
      doc.setTextColor(0, 0, 0)
      
      // Question (with text wrapping)
      const questionLines = doc.splitTextToSize(`Q: ${mistake.question || 'No question'}`, pageWidth - 40)
      doc.text(questionLines, 25, yPos)
      yPos += questionLines.length * 5 + 3
      
      // Answer
      const answerLines = doc.splitTextToSize(`A: ${mistake.correct_answer || 'No answer'}`, pageWidth - 40)
      doc.text(answerLines, 25, yPos)
      yPos += answerLines.length * 5 + 3
      
      // Notes if present
      if (mistake.notes) {
        const notesLines = doc.splitTextToSize(`Notes: ${mistake.notes}`, pageWidth - 40)
        doc.setTextColor(100, 100, 100)
        doc.text(notesLines, 25, yPos)
        yPos += notesLines.length * 5 + 3
      }
      
      yPos += 10
    })
    
    doc.save('studynotes-export.pdf')
  }

  // Export to JSON
  const exportToJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      mistakes: mistakes,
      subjects: subjects,
      mistakeTypes: mistakeTypes
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'studynotes-backup.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  // Import from JSON
  const importFromJSON = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      
      // Import subjects first
      if (data.subjects) {
        for (const subject of data.subjects) {
          try {
            await addSubject(subject.name, subject.color)
          } catch (err) {
            console.log('Subject might already exist:', subject.name)
          }
        }
      }
      
      // Import mistakes
      if (data.mistakes) {
        for (const mistake of data.mistakes) {
          const { id, created_at, updated_at, user_id, ...mistakeData } = mistake
          try {
            await addMistake(mistakeData)
          } catch (err) {
            console.error('Error importing mistake:', err)
          }
        }
      }
      
      if (data.mistakeTypes) {
        setMistakeTypes(data.mistakeTypes)
      }
      
      alert('Import completed successfully!')
      loadData()
    } catch (err) {
      console.error('Import error:', err)
      alert('Failed to import data. Please check the file format.')
    }
  }

  // Theme classes
  const bgColor = 'bg-gray-900'
  const cardBg = 'bg-gray-800'
  const textColor = 'text-white'
  const secondaryText = 'text-gray-400'
  const borderColor = 'border-gray-700'

  // Auth loading
  if (authLoading) {
    return (
      <div className={`min-h-screen ${bgColor} flex items-center justify-center`}>
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className={secondaryText}>Loading...</p>
        </div>
      </div>
    )
  }

  // Show auth screen if not logged in
  if (!user) {
    return (
      <AuthScreen 
        onLogin={handleLogin} 
        onSignup={handleSignup}
        darkMode={darkMode}
      />
    )
  }

  // Main app render
  return (
    <div className={`min-h-screen ${bgColor} ${textColor}`}>
      {/* Navigation */}
      <nav className={`sticky top-0 z-50 ${cardBg} border-b ${borderColor} backdrop-blur-lg bg-opacity-90`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold hidden sm:block">StudyNotes</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {[
                { id: 'home', label: 'Home', icon: Home },
                { id: 'mistakes', label: 'Mistakes', icon: FileText },
                { id: 'stats', label: 'Statistics', icon: BarChart3 },
                { id: 'settings', label: 'Settings', icon: Settings },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setCurrentView(id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    currentView === id
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>
            
            {/* Right side buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Add Mistake</span>
              </button>
              
              {/* User menu */}
              <div className="relative group">
                <button className="p-2 rounded-lg hover:bg-gray-700">
                  <User size={20} />
                </button>
                <div className="absolute right-0 mt-2 w-48 py-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-sm text-gray-400">Signed in as</p>
                    <p className="text-sm font-medium truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-gray-700"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              </div>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-700"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-gray-700 overflow-hidden"
            >
              <div className="px-4 py-2 space-y-1">
                {[
                  { id: 'home', label: 'Home', icon: Home },
                  { id: 'mistakes', label: 'Mistakes', icon: FileText },
                  { id: 'stats', label: 'Statistics', icon: BarChart3 },
                  { id: 'settings', label: 'Settings', icon: Settings },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => { setCurrentView(id); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      currentView === id
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    <Icon size={18} />
                    {label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
              <p className={secondaryText}>Loading your data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={loadData}
                className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Home View */}
            {currentView === 'home' && (
              <HomeView
                stats={stats}
                mistakes={mistakes}
                subjects={subjects}
                darkMode={darkMode}
                cardBg={cardBg}
                borderColor={borderColor}
                secondaryText={secondaryText}
                onViewAll={() => setCurrentView('mistakes')}
                onAddMistake={() => setShowAddModal(true)}
                updateMistake={updateMistake}
                mistakeTypes={mistakeTypes}
              />
            )}
            
            {/* Mistakes View */}
            {currentView === 'mistakes' && (
              <MistakesView
                mistakes={filteredMistakes}
                subjects={subjects}
                mistakeTypes={mistakeTypes}
                darkMode={darkMode}
                cardBg={cardBg}
                borderColor={borderColor}
                secondaryText={secondaryText}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedSubject={selectedSubject}
                setSelectedSubject={setSelectedSubject}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                sortBy={sortBy}
                setSortBy={setSortBy}
                viewMode={viewMode}
                setViewMode={setViewMode}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                updateMistake={updateMistake}
                deleteMistake={deleteMistake}
                onAddMistake={() => setShowAddModal(true)}
              />
            )}
            
            {/* Stats View */}
            {currentView === 'stats' && (
              <StatsView
                stats={stats}
                mistakes={mistakes}
                subjects={subjects}
                mistakeTypes={mistakeTypes}
                darkMode={darkMode}
                cardBg={cardBg}
                borderColor={borderColor}
                secondaryText={secondaryText}
              />
            )}
            
            {/* Settings View */}
            {currentView === 'settings' && (
              <SettingsView
                darkMode={darkMode}
                mistakeTypes={mistakeTypes}
                onAddMistakeType={async (name) => {
                  const newType = { id: name.toLowerCase().replace(/\s+/g, '-'), name }
                  const updated = [...mistakeTypes, newType]
                  setMistakeTypes(updated)
                  await db.updateUserSettings({ mistake_types: updated })
                }}
                onRemoveMistakeType={async (id) => {
                  const updated = mistakeTypes.filter(t => t.id !== id)
                  setMistakeTypes(updated)
                  await db.updateUserSettings({ mistake_types: updated })
                }}
                subjects={subjects}
                addSubject={addSubject}
                deleteSubject={deleteSubject}
                exportToPDF={exportToPDF}
                exportToJSON={exportToJSON}
                importFromJSON={importFromJSON}
                cardBg={cardBg}
                borderColor={borderColor}
                secondaryText={secondaryText}
              />
            )}
          </>
        )}
      </main>

      {/* Add Mistake Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddMistakeModal
            onClose={() => setShowAddModal(false)}
            onAdd={addMistake}
            subjects={subjects}
            addSubject={addSubject}
            mistakeTypes={mistakeTypes}
            darkMode={darkMode}
            cardBg={cardBg}
            borderColor={borderColor}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// Home View Component
function HomeView({ stats, mistakes, subjects, darkMode, cardBg, borderColor, secondaryText, onViewAll, onAddMistake, updateMistake, mistakeTypes }) {
  const todayMistakes = mistakes.filter(m => isDueToday(m.scheduled_redo))
  const overdueMistakes = mistakes.filter(m => isOverdue(m.scheduled_redo))
  const recentMistakes = mistakes.slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome Back! 👋</h1>
          <p className={secondaryText}>
            {stats.overdue > 0 
              ? `You have ${stats.overdue} overdue item${stats.overdue > 1 ? 's' : ''} to review`
              : stats.dueToday > 0
                ? `${stats.dueToday} item${stats.dueToday > 1 ? 's' : ''} due today`
                : 'All caught up! Great job!'}
          </p>
        </div>
        <button
          onClick={onAddMistake}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={20} />
          Log New Mistake
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Mistakes', value: stats.total, icon: FileText, color: 'blue' },
          { label: 'This Week', value: stats.thisWeek, icon: TrendingUp, color: 'green' },
          { label: 'Overdue', value: stats.overdue, icon: AlertCircle, color: 'red' },
          { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'purple' },
        ].map(({ label, value, icon: Icon, color }) => (
          <motion.div
            key={label}
            whileHover={{ scale: 1.02 }}
            className={`p-6 rounded-2xl ${cardBg} border ${borderColor}`}
          >
            <div className={`w-12 h-12 rounded-xl bg-${color}-500/20 flex items-center justify-center mb-4`}>
              <Icon className={`w-6 h-6 text-${color}-400`} />
            </div>
            <p className={`text-sm ${secondaryText} mb-1`}>{label}</p>
            <p className="text-3xl font-bold">{value}</p>
          </motion.div>
        ))}
      </div>

      {/* Due Today & Overdue */}
      {(todayMistakes.length > 0 || overdueMistakes.length > 0) && (
        <div className={`p-6 rounded-2xl ${cardBg} border ${borderColor}`}>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            Review Queue
          </h2>
          <div className="space-y-3">
            {overdueMistakes.map(mistake => (
              <MistakeCard
                key={mistake.id}
                mistake={mistake}
                subjects={subjects}
                mistakeTypes={mistakeTypes}
                darkMode={darkMode}
                cardBg={cardBg}
                borderColor={borderColor}
                secondaryText={secondaryText}
                updateMistake={updateMistake}
                compact
                showBadge="overdue"
              />
            ))}
            {todayMistakes.map(mistake => (
              <MistakeCard
                key={mistake.id}
                mistake={mistake}
                subjects={subjects}
                mistakeTypes={mistakeTypes}
                darkMode={darkMode}
                cardBg={cardBg}
                borderColor={borderColor}
                secondaryText={secondaryText}
                updateMistake={updateMistake}
                compact
                showBadge="today"
              />
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className={`p-6 rounded-2xl ${cardBg} border ${borderColor}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            Recent Activity
          </h2>
          <button
            onClick={onViewAll}
            className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
          >
            View All
            <ArrowRight size={16} />
          </button>
        </div>
        {recentMistakes.length > 0 ? (
          <div className="space-y-3">
            {recentMistakes.map(mistake => (
              <MistakeCard
                key={mistake.id}
                mistake={mistake}
                subjects={subjects}
                mistakeTypes={mistakeTypes}
                darkMode={darkMode}
                cardBg={cardBg}
                borderColor={borderColor}
                secondaryText={secondaryText}
                updateMistake={updateMistake}
                compact
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <p className={secondaryText}>No mistakes logged yet</p>
            <button
              onClick={onAddMistake}
              className="mt-4 text-blue-400 hover:text-blue-300"
            >
              Add your first mistake
            </button>
          </div>
        )}
      </div>

      {/* Subject Breakdown */}
      {subjects.length > 0 && (
        <div className={`p-6 rounded-2xl ${cardBg} border ${borderColor}`}>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Folder className="w-5 h-5 text-blue-400" />
            By Subject
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.bySubject.map(subject => (
              <div
                key={subject.id}
                className="p-4 rounded-xl bg-gray-700/50 hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: subject.color || '#3B82F6' }}
                  />
                  <span className="font-medium truncate">{subject.name}</span>
                </div>
                <p className="text-2xl font-bold">{subject.count}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Mistakes View Component
function MistakesView({
  mistakes,
  subjects,
  mistakeTypes,
  darkMode,
  cardBg,
  borderColor,
  secondaryText,
  searchQuery,
  setSearchQuery,
  selectedSubject,
  setSelectedSubject,
  selectedType,
  setSelectedType,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  showFilters,
  setShowFilters,
  updateMistake,
  deleteMistake,
  onAddMistake
}) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">My Mistakes</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'cards' ? 'list' : 'cards')}
            className={`p-2 rounded-lg ${cardBg} border ${borderColor}`}
          >
            {viewMode === 'cards' ? <List size={20} /> : <Grid size={20} />}
          </button>
          <button
            onClick={onAddMistake}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white"
          >
            <Plus size={18} />
            Add New
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={`p-4 rounded-2xl ${cardBg} border ${borderColor}`}>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mistakes..."
              className={`w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500`}
            />
          </div>
          
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
              showFilters ? 'border-blue-500 text-blue-400' : `${borderColor} text-gray-400`
            }`}
          >
            <Filter size={18} />
            Filters
            {(selectedSubject || selectedType) && (
              <span className="w-2 h-2 rounded-full bg-blue-500" />
            )}
          </button>
          
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`px-4 py-2 rounded-lg bg-gray-700 border ${borderColor} text-white focus:outline-none focus:border-blue-500`}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="due">Due Date</option>
            <option value="subject">Subject</option>
            <option value="priority">Priority</option>
          </select>
        </div>
        
        {/* Expanded Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Subject Filter */}
                <div>
                  <label className={`block text-sm ${secondaryText} mb-2`}>Subject</label>
                  <select
                    value={selectedSubject || ''}
                    onChange={(e) => setSelectedSubject(e.target.value || null)}
                    className={`w-full px-4 py-2 rounded-lg bg-gray-700 border ${borderColor} text-white`}
                  >
                    <option value="">All Subjects</option>
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                
                {/* Type Filter */}
                <div>
                  <label className={`block text-sm ${secondaryText} mb-2`}>Mistake Type</label>
                  <select
                    value={selectedType || ''}
                    onChange={(e) => setSelectedType(e.target.value || null)}
                    className={`w-full px-4 py-2 rounded-lg bg-gray-700 border ${borderColor} text-white`}
                  >
                    <option value="">All Types</option>
                    {mistakeTypes.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Clear Filters */}
              {(selectedSubject || selectedType) && (
                <button
                  onClick={() => { setSelectedSubject(null); setSelectedType(null); }}
                  className="mt-4 text-sm text-blue-400 hover:text-blue-300"
                >
                  Clear all filters
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results Count */}
      <p className={secondaryText}>
        Showing {mistakes.length} mistake{mistakes.length !== 1 ? 's' : ''}
      </p>

      {/* Mistakes Grid/List */}
      {mistakes.length > 0 ? (
        <div className={viewMode === 'cards' 
          ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
          : 'space-y-3'
        }>
          {mistakes.map(mistake => (
            <MistakeCard
              key={mistake.id}
              mistake={mistake}
              subjects={subjects}
              mistakeTypes={mistakeTypes}
              darkMode={darkMode}
              cardBg={cardBg}
              borderColor={borderColor}
              secondaryText={secondaryText}
              updateMistake={updateMistake}
              deleteMistake={deleteMistake}
              compact={viewMode === 'list'}
            />
          ))}
        </div>
      ) : (
        <div className={`text-center py-16 ${cardBg} rounded-2xl border ${borderColor}`}>
          <Search className="w-12 h-12 mx-auto mb-4 text-gray-600" />
          <p className="text-xl font-medium mb-2">No mistakes found</p>
          <p className={secondaryText}>Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}

// Mistake Card Component
function MistakeCard({
  mistake,
  subjects,
  mistakeTypes,
  darkMode,
  cardBg,
  borderColor,
  secondaryText,
  updateMistake,
  deleteMistake,
  compact = false,
  showBadge = null
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(mistake)
  const [showScheduleEditor, setShowScheduleEditor] = useState(false)
  
  const subject = subjects.find(s => s.id === mistake.subject_id)
  const mistakeType = mistakeTypes.find(t => t.id === mistake.mistake_type)
  
  const handleSave = async () => {
    await updateMistake(mistake.id, editData)
    setIsEditing(false)
  }
  
  const updateSchedule = async (newDate) => {
    await updateMistake(mistake.id, { scheduled_redo: newDate })
    setShowScheduleEditor(false)
  }
  
  const clearSchedule = async () => {
    await updateMistake(mistake.id, { scheduled_redo: null })
    setShowScheduleEditor(false)
  }
  
  const markComplete = async () => {
    await updateMistake(mistake.id, { 
      is_resolved: !mistake.is_resolved,
      scheduled_redo: null 
    })
  }

  if (compact && !isExpanded) {
    return (
      <motion.div
        layout
        className={`p-4 rounded-xl ${cardBg} border ${borderColor} hover:border-gray-600 transition-colors`}
      >
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={markComplete}
            className={`mt-1 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              mistake.is_resolved
                ? 'bg-green-500 border-green-500'
                : 'border-gray-500 hover:border-green-500'
            }`}
          >
            {mistake.is_resolved && <CheckCircle2 size={14} className="text-white" />}
          </button>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {subject && (
                <span 
                  className="px-2 py-0.5 rounded text-xs font-medium"
                  style={{ 
                    backgroundColor: `${subject.color}20`,
                    color: subject.color 
                  }}
                >
                  {subject.name}
                </span>
              )}
              {showBadge === 'overdue' && (
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-500/20 text-red-400">
                  Overdue
                </span>
              )}
              {showBadge === 'today' && (
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-500/20 text-yellow-400">
                  Due Today
                </span>
              )}
            </div>
            <p className={`${mistake.is_resolved ? 'line-through text-gray-500' : ''} line-clamp-2`}>
              {mistake.question}
            </p>
            {mistake.scheduled_redo && (
              <p className={`text-xs ${secondaryText} mt-1`}>
                <Calendar size={12} className="inline mr-1" />
                {formatDate(mistake.scheduled_redo)}
              </p>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); setShowScheduleEditor(!showScheduleEditor); }}
              className={`p-2 rounded-lg transition-colors ${
                showScheduleEditor
                  ? 'bg-blue-500/20 text-blue-400'
                  : mistake.scheduled_redo
                    ? 'hover:bg-gray-600 text-blue-400'
                    : 'hover:bg-gray-600 text-gray-400'
              }`}
              title={mistake.scheduled_redo ? 'Edit Schedule' : 'Schedule Redo'}
            >
              <Calendar size={16} />
            </button>
            <button
              onClick={() => setIsExpanded(true)}
              className="p-2 hover:bg-gray-600 rounded-lg text-gray-400"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        
        {/* Schedule Editor Popup */}
        {showScheduleEditor && (
          <div className={`mt-4 pt-4 border-t ${borderColor}`}>
            <div className={`p-4 rounded-lg bg-gray-700/50`}>
              <h4 className="text-sm font-medium mb-3 text-gray-300">
                {mistake.scheduled_redo ? 'Edit Schedule' : 'Schedule Redo'}
              </h4>
              {mistake.scheduled_redo && (
                <p className={`text-sm mb-3 ${secondaryText}`}>
                  Currently scheduled: {formatDate(mistake.scheduled_redo)}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mb-3">
                {redoIntervals.map(({ days, label }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      const newDate = days === 'weekend' 
                        ? getNextWeekend() 
                        : addDays(new Date(), days)
                      updateSchedule(newDate.toISOString())
                    }}
                    className="px-3 py-1 text-sm rounded-lg border border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400 transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="date"
                  onChange={(e) => updateSchedule(new Date(e.target.value).toISOString())}
                  className="flex-1 px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white text-sm"
                />
                {mistake.scheduled_redo && (
                  <button
                    onClick={clearSchedule}
                    className="px-3 py-2 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/20 text-sm"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    )
  }

  return (
    <motion.div
      layout
      className={`rounded-2xl ${cardBg} border ${borderColor} overflow-hidden`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={markComplete}
              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                mistake.is_resolved
                  ? 'bg-green-500 border-green-500'
                  : 'border-gray-500 hover:border-green-500'
              }`}
            >
              {mistake.is_resolved && <CheckCircle2 size={16} className="text-white" />}
            </button>
            {subject && (
              <span 
                className="px-2 py-1 rounded-lg text-sm font-medium"
                style={{ 
                  backgroundColor: `${subject.color}20`,
                  color: subject.color 
                }}
              >
                {subject.name}
              </span>
            )}
            {mistakeType && (
              <span className="px-2 py-1 rounded-lg text-sm bg-gray-700 text-gray-300">
                {mistakeType.name}
              </span>
            )}
            {mistake.priority && (
              <span className={`px-2 py-1 rounded-lg text-sm ${
                mistake.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                mistake.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-gray-700 text-gray-400'
              }`}>
                {mistake.priority}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); setShowScheduleEditor(!showScheduleEditor); }}
              className={`p-2 rounded-lg transition-colors ${
                showScheduleEditor
                  ? 'bg-blue-500/20 text-blue-400'
                  : mistake.scheduled_redo
                    ? 'hover:bg-gray-600 text-blue-400'
                    : 'hover:bg-gray-600 text-gray-400'
              }`}
              title={mistake.scheduled_redo ? 'Edit Schedule' : 'Schedule Redo'}
            >
              <Calendar size={16} />
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`p-2 rounded-lg transition-colors ${
                isEditing ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-gray-600 text-gray-400'
              }`}
            >
              <Edit3 size={16} />
            </button>
            {deleteMistake && (
              <button
                onClick={() => {
                  if (confirm('Delete this mistake?')) {
                    deleteMistake(mistake.id)
                  }
                }}
                className="p-2 hover:bg-gray-600 rounded-lg text-gray-400 hover:text-red-400"
              >
                <Trash2 size={16} />
              </button>
            )}
            {compact && (
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 hover:bg-gray-600 rounded-lg text-gray-400"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className={`block text-sm ${secondaryText} mb-2`}>Question</label>
              <textarea
                value={editData.question || ''}
                onChange={(e) => setEditData({...editData, question: e.target.value})}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                rows={3}
              />
            </div>
            <div>
              <label className={`block text-sm ${secondaryText} mb-2`}>Correct Answer</label>
              <textarea
                value={editData.correct_answer || ''}
                onChange={(e) => setEditData({...editData, correct_answer: e.target.value})}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                rows={3}
              />
            </div>
            <div>
              <label className={`block text-sm ${secondaryText} mb-2`}>Your Answer</label>
              <textarea
                value={editData.wrong_answer || ''}
                onChange={(e) => setEditData({...editData, wrong_answer: e.target.value})}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                rows={2}
              />
            </div>
            <div>
              <label className={`block text-sm ${secondaryText} mb-2`}>Notes</label>
              <textarea
                value={editData.notes || ''}
                onChange={(e) => setEditData({...editData, notes: e.target.value})}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm ${secondaryText} mb-2`}>Priority</label>
                <select
                  value={editData.priority || 'medium'}
                  onChange={(e) => setEditData({...editData, priority: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm ${secondaryText} mb-2`}>Topic</label>
                <input
                  type="text"
                  value={editData.topic || ''}
                  onChange={(e) => setEditData({...editData, topic: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                />
              </div>
            </div>
            
            {/* Schedule in edit mode */}
            <div>
              <label className={`block text-sm ${secondaryText} mb-2`}>Schedule Redo</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {redoIntervals.map(({ days, label }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      const newDate = days === 'weekend' 
                        ? getNextWeekend() 
                        : addDays(new Date(), days)
                      setEditData({...editData, scheduled_redo: newDate.toISOString()})
                    }}
                    className="px-3 py-1 text-sm rounded-lg border border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400"
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={editData.scheduled_redo ? new Date(editData.scheduled_redo).toISOString().split('T')[0] : ''}
                  onChange={(e) => setEditData({...editData, scheduled_redo: e.target.value ? new Date(e.target.value).toISOString() : null})}
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                />
                {editData.scheduled_redo && (
                  <button
                    type="button"
                    onClick={() => setEditData({...editData, scheduled_redo: null})}
                    className="px-3 py-2 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/20"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setIsEditing(false); setEditData(mistake); }}
                className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-blue-400 mb-1">Question</h3>
              <p className={mistake.is_resolved ? 'line-through text-gray-500' : ''}>
                {mistake.question || 'No question provided'}
              </p>
            </div>
            
            {mistake.wrong_answer && (
              <div>
                <h3 className="font-medium text-red-400 mb-1">Your Answer</h3>
                <p className="text-gray-300">{mistake.wrong_answer}</p>
              </div>
            )}
            
            <div>
              <h3 className="font-medium text-green-400 mb-1">Correct Answer</h3>
              <p className="text-gray-300">{mistake.correct_answer || 'No answer provided'}</p>
            </div>
            
            {mistake.notes && (
              <div>
                <h3 className="font-medium text-purple-400 mb-1">Notes</h3>
                <p className="text-gray-300 whitespace-pre-wrap">{mistake.notes}</p>
              </div>
            )}
            
            {/* Meta info */}
            <div className={`flex flex-wrap gap-4 pt-4 border-t border-gray-700 text-sm ${secondaryText}`}>
              {mistake.topic && (
                <span className="flex items-center gap-1">
                  <Tag size={14} />
                  {mistake.topic}
                </span>
              )}
              {mistake.source && (
                <span className="flex items-center gap-1">
                  <FileText size={14} />
                  {mistake.source}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {formatDate(mistake.created_at)}
              </span>
              {mistake.scheduled_redo && (
                <span className={`flex items-center gap-1 ${
                  isOverdue(mistake.scheduled_redo) ? 'text-red-400' :
                  isDueToday(mistake.scheduled_redo) ? 'text-yellow-400' :
                  isDueSoon(mistake.scheduled_redo) ? 'text-blue-400' : ''
                }`}>
                  <Calendar size={14} />
                  Redo: {formatDate(mistake.scheduled_redo)}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Schedule Editor (when not in edit mode) */}
      {showScheduleEditor && !isEditing && (
        <div className={`px-4 pb-4 border-t ${borderColor}`}>
          <div className={`p-4 rounded-lg bg-gray-700/50`}>
            <h4 className="text-sm font-medium mb-3 text-gray-300">
              {mistake.scheduled_redo ? 'Edit Schedule' : 'Schedule Redo'}
            </h4>
            {mistake.scheduled_redo && (
              <p className={`text-sm mb-3 ${secondaryText}`}>
                Currently scheduled: {formatDate(mistake.scheduled_redo)}
              </p>
            )}
            <div className="flex flex-wrap gap-2 mb-3">
              {redoIntervals.map(({ days, label }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    const newDate = days === 'weekend' 
                      ? getNextWeekend() 
                      : addDays(new Date(), days)
                    updateSchedule(newDate.toISOString())
                  }}
                  className="px-3 py-1 text-sm rounded-lg border border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400 transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="date"
                onChange={(e) => updateSchedule(new Date(e.target.value).toISOString())}
                className="flex-1 px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white text-sm"
              />
              {mistake.scheduled_redo && (
                <button
                  onClick={clearSchedule}
                  className="px-3 py-2 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/20 text-sm"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

// Stats View Component
function StatsView({ stats, mistakes, subjects, mistakeTypes, darkMode, cardBg, borderColor, secondaryText }) {
  // Calculate weekly data
  const weeklyData = useMemo(() => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = addDays(new Date(), -i)
      const dateStr = date.toDateString()
      const count = mistakes.filter(m => 
        new Date(m.created_at).toDateString() === dateStr
      ).length
      days.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        count
      })
    }
    return days
  }, [mistakes])
  
  const maxCount = Math.max(...weeklyData.map(d => d.count), 1)

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Statistics</h1>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Mistakes', value: stats.total, icon: FileText, color: 'blue' },
          { label: 'This Week', value: stats.thisWeek, icon: TrendingUp, color: 'green' },
          { label: 'Overdue', value: stats.overdue, icon: AlertCircle, color: 'red' },
          { label: 'Completion Rate', value: `${stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%`, icon: Target, color: 'purple' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`p-6 rounded-2xl ${cardBg} border ${borderColor}`}>
            <div className={`w-12 h-12 rounded-xl bg-${color}-500/20 flex items-center justify-center mb-4`}>
              <Icon className={`w-6 h-6 text-${color}-400`} />
            </div>
            <p className={`text-sm ${secondaryText} mb-1`}>{label}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>
      
      {/* Weekly Activity */}
      <div className={`p-6 rounded-2xl ${cardBg} border ${borderColor}`}>
        <h2 className="text-xl font-semibold mb-6">Weekly Activity</h2>
        <div className="flex items-end justify-between gap-2 h-40">
          {weeklyData.map(({ day, count }) => (
            <div key={day} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col items-center justify-end h-32">
                <span className={`text-sm ${secondaryText} mb-2`}>{count}</span>
                <div 
                  className="w-full max-w-12 rounded-t-lg bg-gradient-to-t from-blue-600 to-blue-400 transition-all"
                  style={{ height: `${(count / maxCount) * 100}%`, minHeight: count > 0 ? '8px' : '0' }}
                />
              </div>
              <span className={`text-sm ${secondaryText} mt-2`}>{day}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* By Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`p-6 rounded-2xl ${cardBg} border ${borderColor}`}>
          <h2 className="text-xl font-semibold mb-4">By Mistake Type</h2>
          <div className="space-y-3">
            {stats.byType.filter(t => t.count > 0).map(type => (
              <div key={type.id}>
                <div className="flex justify-between mb-1">
                  <span className={secondaryText}>{type.name}</span>
                  <span className="font-medium">{type.count}</span>
                </div>
                <div className="h-2 rounded-full bg-gray-700">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                    style={{ width: `${stats.total > 0 ? (type.count / stats.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
            {stats.byType.filter(t => t.count > 0).length === 0 && (
              <p className={secondaryText}>No data yet</p>
            )}
          </div>
        </div>
        
        <div className={`p-6 rounded-2xl ${cardBg} border ${borderColor}`}>
          <h2 className="text-xl font-semibold mb-4">By Subject</h2>
          <div className="space-y-3">
            {stats.bySubject.filter(s => s.count > 0).map(subject => (
              <div key={subject.id}>
                <div className="flex justify-between mb-1">
                  <span className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: subject.color || '#3B82F6' }}
                    />
                    <span className={secondaryText}>{subject.name}</span>
                  </span>
                  <span className="font-medium">{subject.count}</span>
                </div>
                <div className="h-2 rounded-full bg-gray-700">
                  <div 
                    className="h-full rounded-full"
                    style={{ 
                      width: `${stats.total > 0 ? (subject.count / stats.total) * 100 : 0}%`,
                      backgroundColor: subject.color || '#3B82F6'
                    }}
                  />
                </div>
              </div>
            ))}
            {stats.bySubject.filter(s => s.count > 0).length === 0 && (
              <p className={secondaryText}>No data yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Settings View Component
function SettingsView({
  darkMode,
  mistakeTypes,
  onAddMistakeType,
  onRemoveMistakeType,
  subjects,
  addSubject,
  deleteSubject,
  exportToPDF,
  exportToJSON,
  importFromJSON,
  cardBg,
  borderColor,
  secondaryText
}) {
  const [newTypeName, setNewTypeName] = useState('')
  const [newSubjectName, setNewSubjectName] = useState('')
  const [newSubjectColor, setNewSubjectColor] = useState('#3B82F6')
  const fileInputRef = useRef(null)

  const handleAddType = () => {
    if (newTypeName.trim()) {
      onAddMistakeType(newTypeName.trim())
      setNewTypeName('')
    }
  }

  const handleAddSubject = async () => {
    if (newSubjectName.trim()) {
      await addSubject(newSubjectName.trim(), newSubjectColor)
      setNewSubjectName('')
    }
  }

  const colors = [
    '#3B82F6', '#8B5CF6', '#EC4899', '#EF4444', '#F97316',
    '#EAB308', '#22C55E', '#14B8A6', '#06B6D4', '#6366F1'
  ]

  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="text-3xl font-bold">Settings</h1>

      {/* Subjects */}
      <div className={`p-6 rounded-2xl ${cardBg} border ${borderColor}`}>
        <h2 className="font-semibold mb-4">Subjects</h2>
        <div className="space-y-3 mb-4">
          {subjects.map(subject => (
            <div key={subject.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50">
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: subject.color }}
                />
                <span>{subject.name}</span>
              </div>
              <button
                onClick={() => {
                  if (confirm(`Delete ${subject.name}? This won't delete associated mistakes.`)) {
                    deleteSubject(subject.id)
                  }
                }}
                className="p-1 hover:bg-gray-600 rounded text-gray-400 hover:text-red-400"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
        
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              placeholder="New subject name..."
              className="flex-1 px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
              onKeyPress={(e) => e.key === 'Enter' && handleAddSubject()}
            />
            <button
              onClick={handleAddSubject}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            >
              Add
            </button>
          </div>
          <div className="flex gap-2">
            {colors.map(color => (
              <button
                key={color}
                onClick={() => setNewSubjectColor(color)}
                className={`w-8 h-8 rounded-full transition-transform ${
                  newSubjectColor === color ? 'scale-110 ring-2 ring-white' : ''
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mistake Types */}
      <div className={`p-6 rounded-2xl ${cardBg} border ${borderColor}`}>
        <h2 className="font-semibold mb-4">Mistake Type Labels</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {mistakeTypes.map((type) => (
            <div
              key={type.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-700/50"
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
            className="flex-1 px-3 py-2 rounded-lg border bg-gray-700 border-gray-600 text-gray-100"
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

      {/* Import/Export */}
      <div className={`p-6 rounded-2xl ${cardBg} border ${borderColor}`}>
        <h2 className="font-semibold mb-4">Data Management</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={exportToPDF}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-600 hover:border-blue-500 hover:text-blue-400 transition-colors"
          >
            <Download size={18} />
            Export PDF
          </button>
          <button
            onClick={exportToJSON}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-600 hover:border-green-500 hover:text-green-400 transition-colors"
          >
            <Download size={18} />
            Backup JSON
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-600 hover:border-purple-500 hover:text-purple-400 transition-colors"
          >
            <Upload size={18} />
            Import
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={importFromJSON}
            className="hidden"
          />
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className={`p-6 rounded-2xl ${cardBg} border ${borderColor}`}>
        <h2 className="font-semibold mb-4">Keyboard Shortcuts</h2>
        <div className="space-y-2">
          {[
            { keys: ['Ctrl', 'N'], action: 'Add new mistake' },
            { keys: ['Esc'], action: 'Close modals' },
          ].map(({ keys, action }) => (
            <div key={action} className="flex items-center justify-between">
              <span className={secondaryText}>{action}</span>
              <div className="flex gap-1">
                {keys.map(key => (
                  <kbd
                    key={key}
                    className="px-2 py-1 rounded bg-gray-700 text-xs font-mono"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Add Mistake Modal
function AddMistakeModal({ onClose, onAdd, subjects, addSubject, mistakeTypes, darkMode, cardBg, borderColor }) {
  const [formData, setFormData] = useState({
    subject_id: '',
    mistake_type: '',
    question: '',
    wrong_answer: '',
    correct_answer: '',
    notes: '',
    topic: '',
    source: '',
    priority: 'medium',
    scheduled_redo: null
  })
  const [newSubjectName, setNewSubjectName] = useState('')
  const [showNewSubject, setShowNewSubject] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.question.trim()) return
    
    setLoading(true)
    try {
      await onAdd(formData)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSubject = async () => {
    if (newSubjectName.trim()) {
      const subject = await addSubject(newSubjectName.trim(), '#3B82F6')
      setFormData({...formData, subject_id: subject.id})
      setNewSubjectName('')
      setShowNewSubject(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto ${cardBg} rounded-2xl border ${borderColor} shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-700 bg-gray-800 rounded-t-2xl">
          <h2 className="text-xl font-bold">Log New Mistake</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Subject and Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Subject</label>
              {showNewSubject ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                    placeholder="Subject name"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleAddSubject}
                    className="px-3 py-2 bg-blue-500 rounded-lg"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewSubject(false)}
                    className="px-3 py-2 bg-gray-600 rounded-lg"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <select
                    value={formData.subject_id}
                    onChange={(e) => setFormData({...formData, subject_id: e.target.value})}
                    className="flex-1 px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                  >
                    <option value="">Select subject</option>
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowNewSubject(true)}
                    className="px-3 py-2 bg-gray-600 rounded-lg hover:bg-gray-500"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Mistake Type</label>
              <select
                value={formData.mistake_type}
                onChange={(e) => setFormData({...formData, mistake_type: e.target.value})}
                className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
              >
                <option value="">Select type</option>
                {mistakeTypes.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Question */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Question / Problem *</label>
            <textarea
              value={formData.question}
              onChange={(e) => setFormData({...formData, question: e.target.value})}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white resize-none"
              rows={3}
              placeholder="What was the question or problem?"
              required
            />
          </div>

          {/* Your Answer */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Your Answer</label>
            <textarea
              value={formData.wrong_answer}
              onChange={(e) => setFormData({...formData, wrong_answer: e.target.value})}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white resize-none"
              rows={2}
              placeholder="What did you answer?"
            />
          </div>

          {/* Correct Answer */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Correct Answer</label>
            <textarea
              value={formData.correct_answer}
              onChange={(e) => setFormData({...formData, correct_answer: e.target.value})}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white resize-none"
              rows={2}
              placeholder="What was the correct answer?"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Notes / Explanation</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white resize-none"
              rows={3}
              placeholder="Why did you get it wrong? What should you remember?"
            />
          </div>

          {/* Topic, Source, Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Topic</label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData({...formData, topic: e.target.value})}
                className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                placeholder="e.g., Derivatives"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Source</label>
              <input
                type="text"
                value={formData.source}
                onChange={(e) => setFormData({...formData, source: e.target.value})}
                className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                placeholder="e.g., Chapter 5 Quiz"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Schedule */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Schedule Redo</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {redoIntervals.map(({ days, label }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    const newDate = days === 'weekend' 
                      ? getNextWeekend() 
                      : addDays(new Date(), days)
                    setFormData({...formData, scheduled_redo: newDate.toISOString()})
                  }}
                  className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                    formData.scheduled_redo && 
                    (days === 'weekend' 
                      ? new Date(formData.scheduled_redo).toDateString() === getNextWeekend().toDateString()
                      : new Date(formData.scheduled_redo).toDateString() === addDays(new Date(), days).toDateString())
                      ? 'border-blue-500 text-blue-400 bg-blue-500/20'
                      : 'border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="date"
                value={formData.scheduled_redo ? new Date(formData.scheduled_redo).toISOString().split('T')[0] : ''}
                onChange={(e) => setFormData({...formData, scheduled_redo: e.target.value ? new Date(e.target.value).toISOString() : null})}
                className="flex-1 px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
              />
              {formData.scheduled_redo && (
                <button
                  type="button"
                  onClick={() => setFormData({...formData, scheduled_redo: null})}
                  className="px-3 py-2 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/20"
                >
                  Clear
                </button>
              )}
            </div>
            {formData.scheduled_redo && (
              <p className="text-sm text-gray-400 mt-2">
                Scheduled for: {formatDate(formData.scheduled_redo)}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.question.trim()}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Mistake'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}