import { supabase } from './supabase'

export async function getNotes() {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching notes:', error)
    return []
  }
  return data
}

export async function addNote(title, content, subject = 'General') {
  const { error } = await supabase
    .from('notes')
    .insert([{ title, content, subject }])

  if (error) {
    console.error('Error adding note:', error)
  }
}

export async function updateNote(id, title, content, subject) {
  const { error } = await supabase
    .from('notes')
    .update({ title, content, subject })
    .eq('id', id)

  if (error) {
    console.error('Error updating note:', error)
  }
}

export async function deleteNote(id) {
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting note:', error)
  }
}