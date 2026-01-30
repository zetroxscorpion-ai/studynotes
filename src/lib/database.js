import { supabase } from './supabase'

// Get current user
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

// Sign up
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

// Sign in
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  if (error) throw error
  return data
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Get all mistakes for current user
export async function getMistakes() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('mistakes')
    .select('*, subjects(name, color)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// Create a new mistake
export async function createMistake(mistake) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('mistakes')
    .insert([{ ...mistake, user_id: user.id }])
    .select()
    .single()

  if (error) throw error
  return data
}

// Update a mistake
export async function updateMistake(id, updates) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('mistakes')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Delete a mistake
export async function deleteMistake(id) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('mistakes')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw error
  return true
}

// Get all subjects for current user
export async function getSubjects() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('user_id', user.id)
    .order('name')

  if (error) throw error
  return data
}

// Create a new subject
export async function createSubject(subject) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('subjects')
    .insert([{ ...subject, user_id: user.id }])
    .select()
    .single()

  if (error) throw error
  return data
}

// Delete a subject
export async function deleteSubject(id) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('subjects')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw error
  return true
}

// Get user settings
export async function getUserSettings() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

// Update user settings
export async function updateUserSettings(settings) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('user_settings')
    .upsert({ ...settings, user_id: user.id })
    .select()
    .single()

  if (error) throw error
  return data
}