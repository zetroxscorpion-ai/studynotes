import { supabase } from './supabase'

// Auth functions
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

export async function signUp(email, password, name) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }
    }
  })
  if (error) throw error
  return data
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Subjects
export async function getSubjects() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('user_id', user.id)
    .order('name')
  if (error) throw error
  return data || []
}

export async function createSubject(subject) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  const { data, error } = await supabase
    .from('subjects')
    .insert({ ...subject, user_id: user.id })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateSubject(id, updates) {
  const { data, error } = await supabase
    .from('subjects')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteSubject(id) {
  const { error } = await supabase
    .from('subjects')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// Modules - TEMPORARY DEBUG VERSION
export async function getModules() {
  const { data, error } = await supabase
    .from('modules')
    .select('*, subjects(name, color)')
    .order('name')
  
  console.log('Modules data:', data)
  console.log('Modules error:', error)
  
  if (error) throw error
  return data || []
}

export async function createModule(module) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  const { data, error } = await supabase
    .from('modules')
    .insert({ ...module, user_id: user.id })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateModule(id, updates) {
  const { data, error } = await supabase
    .from('modules')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteModule(id) {
  const { error } = await supabase
    .from('modules')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// Mistake Types
export async function getMistakeTypes() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  
  const { data, error } = await supabase
    .from('mistake_types')
    .select('*')
    .eq('user_id', user.id)
    .order('name')
  if (error) throw error
  return data || []
}

export async function createMistakeType(mistakeType) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  const { data, error } = await supabase
    .from('mistake_types')
    .insert({ ...mistakeType, user_id: user.id })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateMistakeType(id, updates) {
  const { data, error } = await supabase
    .from('mistake_types')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteMistakeType(id) {
  const { error } = await supabase
    .from('mistake_types')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// Mistake Notes
export async function getMistakeNotes() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  
  const { data, error } = await supabase
    .from('mistake_notes')
    .select(`
      *,
      subjects(name, color),
      modules(name),
      mistake_types(name, color)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function getMistakeNote(id) {
  const { data, error } = await supabase
    .from('mistake_notes')
    .select(`
      *,
      subjects(name, color),
      modules(name),
      mistake_types(name, color)
    `)
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createMistakeNote(note) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  const { data, error } = await supabase
    .from('mistake_notes')
    .insert({ ...note, user_id: user.id })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateMistakeNote(id, updates) {
  const { data, error } = await supabase
    .from('mistake_notes')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteMistakeNote(id) {
  const { error } = await supabase
    .from('mistake_notes')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// Redo Attempts
export async function getRedoAttempts(mistakeNoteId) {
  const { data, error } = await supabase
    .from('redo_attempts')
    .select('*')
    .eq('mistake_note_id', mistakeNoteId)
    .order('attempted_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function createRedoAttempt(attempt) {
  const { data, error } = await supabase
    .from('redo_attempts')
    .insert(attempt)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateRedoAttempt(id, updates) {
  const { data, error } = await supabase
    .from('redo_attempts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteRedoAttempt(id) {
  const { error } = await supabase
    .from('redo_attempts')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// Tips
export async function getTips() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  
  const { data, error } = await supabase
    .from('tips')
    .select('*, subjects(name, color), modules(name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function createTip(tip) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  const { data, error } = await supabase
    .from('tips')
    .insert({ ...tip, user_id: user.id })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateTip(id, updates) {
  const { data, error } = await supabase
    .from('tips')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteTip(id) {
  const { error } = await supabase
    .from('tips')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// User Settings
export async function getUserSettings() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user.id)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function updateUserSettings(settings) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  const { data, error } = await supabase
    .from('user_settings')
    .upsert({ user_id: user.id, ...settings })
    .select()
    .single()
  if (error) throw error
  return data
}

// Legacy aliases for backwards compatibility
export const getMistakes = getMistakeNotes
export const createMistake = createMistakeNote
export const updateMistake = updateMistakeNote
export const deleteMistake = deleteMistakeNote