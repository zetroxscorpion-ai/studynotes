import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to upload image
export async function uploadImage(file, folder = 'notes') {
  const fileExt = file.name.split('.').pop()
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  
  const { data, error } = await supabase.storage
    .from('images')
    .upload(fileName, file)
  
  if (error) throw error
  
  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(fileName)
  
  return publicUrl
}

// Helper function to delete image
export async function deleteImage(url) {
  if (!url || !url.includes('supabase')) return
  
  const path = url.split('/images/')[1]
  if (path) {
    await supabase.storage.from('images').remove([path])
  }
}