import { supabase } from './supabase'

// Get current user ID helper
const getUserId = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id
}

// SUBJECTS
export async function getSubjects() {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .order('sort_order')
  if (error) throw error
  return data
}

export async function createSubject(subject) {
  const user_id = await getUserId()
  const { data, error } = await supabase
    .from('subjects')
    .insert([{ ...subject, user_id }])
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

// MODULES
export async function getModules(subjectId) {
  const { data, error } = await supabase
    .from('modules')
    .select('*')
    .eq('subject_id', subjectId)
    .order('sort_order')
  if (error) throw error
  return data
}

export async function createModule(module) {
  const user_id = await getUserId()
  const { data, error } = await supabase
    .from('modules')
    .insert([{ ...module, user_id }])
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

// MISTAKE NOTES
export async function getMistakeNotes(moduleId, subjectId) {
  let query = supabase.from('mistake_notes').select('*, redo_attempts(*)')
  
  if (moduleId) query = query.eq('module_id', moduleId)
  if (subjectId) query = query.eq('subject_id', subjectId)
  
  const { data, error } = await query.order('sort_order')
  if (error) throw error
  return data
}

export async function createMistakeNote(note) {
  const user_id = await getUserId()
  const { data, error } = await supabase
    .from('mistake_notes')
    .insert([{ ...note, user_id }])
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

export async function getScheduledMistakes() {
  const { data, error } = await supabase
    .from('mistake_notes')
    .select('*, subjects(*), modules(*)')
    .not('scheduled_redo', 'is', null)
    .order('scheduled_redo')
  if (error) throw error
  return data
}

// REDO ATTEMPTS
export async function createRedoAttempt(attempt) {
  const user_id = await getUserId()
  const { data, error } = await supabase
    .from('redo_attempts')
    .insert([{ ...attempt, user_id }])
    .select()
    .single()
  if (error) throw error
  return data
}

// TIPS
export async function getTips(moduleId, subjectId) {
  let query = supabase.from('tips').select('*')
  
  if (moduleId) query = query.eq('module_id', moduleId)
  if (subjectId) query = query.eq('subject_id', subjectId)
  
  const { data, error } = await query.order('sort_order')
  if (error) throw error
  return data
}

export async function createTip(tip) {
  const user_id = await getUserId()
  const { data, error } = await supabase
    .from('tips')
    .insert([{ ...tip, user_id }])
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

// MISTAKE TYPES
export async function getMistakeTypes() {
  const { data, error } = await supabase
    .from('mistake_types')
    .select('*')
    .order('created_at')
  if (error) throw error
  return data
}

export async function createMistakeType(name) {
  const user_id = await getUserId()
  const { data, error } = await supabase
    .from('mistake_types')
    .insert([{ name, user_id }])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteMistakeType(id) {
  const { error } = await supabase.from('mistake_types').delete().eq('id', id)
  if (error) throw error
}

// USER SETTINGS
export async function getUserSettings() {
  const user_id = await getUserId()
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user_id)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function updateUserSettings(settings) {
  const user_id = await getUserId()
  const { data, error } = await supabase
    .from('user_settings')
    .upsert([{ ...settings, user_id }], { onConflict: 'user_id' })
    .select()
    .single()
  if (error) throw error
  return data
}