'use server'
import { supabase } from '../client'
import type { Classe } from '@/lib/types'

export async function getClasses(): Promise<Classe[]> {
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .order('nivel')
  if (error) throw error
  return data
}

export async function createClasse(payload: Omit<Classe, 'id' | 'created_at'>): Promise<Classe> {
  const { data, error } = await supabase
    .from('classes')
    .insert(payload)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateClasse(id: string, payload: Partial<Omit<Classe, 'id' | 'created_at'>>): Promise<Classe> {
  const { data, error } = await supabase
    .from('classes')
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteClasse(id: string): Promise<void> {
  const { error } = await supabase.from('classes').delete().eq('id', id)
  if (error) throw error
}
