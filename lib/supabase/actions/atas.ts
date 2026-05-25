'use server'
import { supabase } from '../client'
import type { Ata } from '@/lib/types'

export async function getAtas(): Promise<Ata[]> {
  const { data, error } = await supabase
    .from('atas')
    .select('*')
    .order('numero', { ascending: false })
  if (error) throw error
  return data
}

export async function getAta(id: string): Promise<Ata | null> {
  const { data, error } = await supabase
    .from('atas')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data
}

export async function getProximoNumeroAta(): Promise<number> {
  const { data } = await supabase
    .from('atas')
    .select('numero')
    .order('numero', { ascending: false })
    .limit(1)
    .single()
  return (data?.numero ?? 0) + 1
}

export async function createAta(payload: Omit<Ata, 'id' | 'created_at'>): Promise<Ata> {
  const { data, error } = await supabase
    .from('atas')
    .insert(payload)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateAta(id: string, payload: Partial<Omit<Ata, 'id' | 'created_at'>>): Promise<Ata> {
  const { data, error } = await supabase
    .from('atas')
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteAta(id: string): Promise<void> {
  const { error } = await supabase.from('atas').delete().eq('id', id)
  if (error) throw error
}
