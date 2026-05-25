'use server'
import { supabase } from '../client'
import type { Ato } from '@/lib/types'

export async function getAtos(): Promise<Ato[]> {
  const { data, error } = await supabase
    .from('atos')
    .select('*')
    .order('numero', { ascending: false })
  if (error) throw error
  return data
}

export async function getAto(id: string): Promise<Ato | null> {
  const { data, error } = await supabase
    .from('atos')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data
}

export async function getProximoNumeroAto(): Promise<number> {
  const { data } = await supabase
    .from('atos')
    .select('numero')
    .order('numero', { ascending: false })
    .limit(1)
    .single()
  return (data?.numero ?? 0) + 1
}

export async function createAto(payload: Omit<Ato, 'id' | 'created_at'>): Promise<Ato> {
  const { data, error } = await supabase
    .from('atos')
    .insert(payload)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateAto(id: string, payload: Partial<Omit<Ato, 'id' | 'created_at'>>): Promise<Ato> {
  const { data, error } = await supabase
    .from('atos')
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteAto(id: string): Promise<void> {
  const { error } = await supabase.from('atos').delete().eq('id', id)
  if (error) throw error
}
