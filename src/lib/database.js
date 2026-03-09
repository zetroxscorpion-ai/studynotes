import { supabase } from './supabase'

// Subjects
export async function getSubjects() {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .order('sort_order')
  if (error) throw error
  return data
}

export async function createSubject(subject) {
  const { data: { user } } = await supabase.auth.getUser()
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
  const { error } = await supabase.from('subjects').delete().eq('id', id)
  if (error) throw error
}

// Modules
export async function getModules(subjectId) {
  let query = supabase.from('modules').select('*').order('sort_order')
  if (subjectId) query = query.eq('subject_id', subjectId)
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function createModule(module) {
  const { data: { user } } = await supabase.auth.getUser()
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
  const { error } = await supabase.from('modules').delete().eq('id', id)
  if (error) throw error
}

// Mistake Notes
export async function getMistakeNotes(moduleId, subjectId) {
  let query = supabase
    .from('mistake_notes')
    .select(`
      *,
      redo_attempts (*)
    `)
    .order('sort_order')
  
  if (moduleId) query = query.eq('module_id', moduleId)
  if (subjectId) query = query.eq('subject_id', subjectId)
  
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function createMistakeNote(note) {
  const { data: { user } } = await supabase.auth.getUser()
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
  const { error } = await supabase.from('mistake_notes').delete().eq('id', id)
  if (error) throw error
}

// Redo Attempts
export async function createRedoAttempt(attempt) {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('redo_attempts')
    .insert({ ...attempt, user_id: user.id })
    .select()
    .single()
  if (error) throw error
  return data
}

// Tips
export async function getTips(moduleId, subjectId) {
  let query = supabase.from('tips').select('*').order('sort_order')
  if (moduleId) query = query.eq('module_id', moduleId)
  if (subjectId) query = query.eq('subject_id', subjectId)
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function createTip(tip) {
  const { data: { user } } = await supabase.auth.getUser()
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
  const { error } = await supabase.from('tips').delete().eq('id', id)
  if (error) throw error
}

// Mistake Types
export async function getMistakeTypes() {
  const { data, error } = await supabase
    .from('mistake_types')
    .select('*')
    .order('name')
  if (error) throw error
  return data
}

export async function createMistakeType(name) {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('mistake_types')
    .insert({ name, user_id: user.id })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteMistakeType(id) {
  const { error } = await supabase.from('mistake_types').delete().eq('id', id)
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
  const { data, error } = await supabase
    .from('user_settings')
    .upsert({ user_id: user.id, ...settings })
    .select()
    .single()
  if (error) throw error
  return data
}

// Scheduled Mistakes
export async function getScheduledMistakes() {
  const { data, error } = await supabase
    .from('mistake_notes')
    .select(`
      *,
      subjects (name, icon),
      modules (name)
    `)
    .not('scheduled_redo', 'is', null)
    .order('scheduled_redo')
  if (error) throw error
  return data
}