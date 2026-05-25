'use server'
import { supabase } from '../client'
import type { Patrimonio } from '@/lib/types'

export async function getPatrimonio(): Promise<Patrimonio[]> {
  const { data, error } = await supabase
    .from('patrimonio')
    .select('*')
    .order('nome')
  if (error) throw error
  return data
}

export async function getPatrimonioById(id: string): Promise<Patrimonio | null> {
  const { data, error } = await supabase
    .from('patrimonio')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data
}

export async function createPatrimonio(payload: Omit<Patrimonio, 'id' | 'created_at'>): Promise<Patrimonio> {
  const { data, error } = await supabase
    .from('patrimonio')
    .insert(payload)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updatePatrimonio(id: string, payload: Partial<Omit<Patrimonio, 'id' | 'created_at'>>): Promise<Patrimonio> {
  const { data, error } = await supabase
    .from('patrimonio')
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deletePatrimonio(id: string): Promise<void> {
  const { error } = await supabase.from('patrimonio').delete().eq('id', id)
  if (error) throw error
}

export async function getTotalPatrimonio(): Promise<number> {
  const { data, error } = await supabase
    .from('patrimonio')
    .select('valor_aquisicao')
    .neq('estado', 'baixado')
  if (error) throw error
  return (data ?? []).reduce((acc, p) => acc + (p.valor_aquisicao ?? 0), 0)
}
