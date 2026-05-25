'use server'
import { supabase } from '../client'
import type { CaixaTransacao } from '@/lib/types'

export async function getCaixaTransacoes(dataInicio?: string, dataFim?: string): Promise<CaixaTransacao[]> {
  let query = supabase
    .from('caixa_transacoes')
    .select('*')
    .order('data', { ascending: false })

  if (dataInicio) query = query.gte('data', dataInicio)
  if (dataFim) query = query.lte('data', dataFim)

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function createTransacao(payload: Omit<CaixaTransacao, 'id' | 'created_at'>): Promise<CaixaTransacao> {
  const { data, error } = await supabase
    .from('caixa_transacoes')
    .insert(payload)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateTransacao(id: string, payload: Partial<Omit<CaixaTransacao, 'id' | 'created_at'>>): Promise<CaixaTransacao> {
  const { data, error } = await supabase
    .from('caixa_transacoes')
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteTransacao(id: string): Promise<void> {
  const { error } = await supabase.from('caixa_transacoes').delete().eq('id', id)
  if (error) throw error
}

export async function getSaldoCaixa(): Promise<number> {
  const { data, error } = await supabase
    .from('caixa_transacoes')
    .select('tipo, valor')
  if (error) throw error
  return (data ?? []).reduce((acc, t) => {
    return acc + (t.tipo === 'entrada' ? t.valor : -t.valor)
  }, 0)
}
