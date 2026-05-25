'use server'
import { supabase } from '../client'
import type { Especialidade } from '@/lib/types'

export async function getEspecialidades(): Promise<Especialidade[]> {
  const { data, error } = await supabase
    .from('especialidades')
    .select('*')
    .order('nome')
  if (error) throw error
  return data
}

export async function createEspecialidade(payload: Omit<Especialidade, 'id' | 'created_at'>): Promise<Especialidade> {
  const { data, error } = await supabase
    .from('especialidades')
    .insert(payload)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateEspecialidade(id: string, payload: Partial<Omit<Especialidade, 'id' | 'created_at'>>): Promise<Especialidade> {
  const { data, error } = await supabase
    .from('especialidades')
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteEspecialidade(id: string): Promise<void> {
  const { error } = await supabase.from('especialidades').delete().eq('id', id)
  if (error) throw error
}
