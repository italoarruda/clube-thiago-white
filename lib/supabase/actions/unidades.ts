'use server'
import { supabase } from '../client'
import type { Unidade } from '@/lib/types'

export async function getUnidades(): Promise<Unidade[]> {
  const { data, error } = await supabase
    .from('unidades')
    .select('*')
    .order('nome')
  if (error) throw error
  return data
}

export async function createUnidade(payload: Omit<Unidade, 'id' | 'created_at'>): Promise<Unidade> {
  const { data, error } = await supabase
    .from('unidades')
    .insert(payload)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateUnidade(id: string, payload: Partial<Omit<Unidade, 'id' | 'created_at'>>): Promise<Unidade> {
  const { data, error } = await supabase
    .from('unidades')
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteUnidade(id: string): Promise<void> {
  const { error } = await supabase.from('unidades').delete().eq('id', id)
  if (error) throw error
}
