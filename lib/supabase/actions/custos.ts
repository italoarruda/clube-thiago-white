'use server'
import { supabase } from '../client'
import type { Custo } from '@/lib/types'

export async function getCustos(dataInicio?: string, dataFim?: string): Promise<Custo[]> {
  let query = supabase
    .from('custos')
    .select('*')
    .order('data', { ascending: false })

  if (dataInicio) query = query.gte('data', dataInicio)
  if (dataFim) query = query.lte('data', dataFim)

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function createCusto(payload: Omit<Custo, 'id' | 'created_at'>): Promise<Custo> {
  const { data, error } = await supabase
    .from('custos')
    .insert(payload)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateCusto(id: string, payload: Partial<Omit<Custo, 'id' | 'created_at'>>): Promise<Custo> {
  const { data, error } = await supabase
    .from('custos')
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteCusto(id: string): Promise<void> {
  const { error } = await supabase.from('custos').delete().eq('id', id)
  if (error) throw error
}
