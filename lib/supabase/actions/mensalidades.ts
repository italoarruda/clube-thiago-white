'use server'
import { supabase } from '../client'
import type { Mensalidade, StatusMensalidade } from '@/lib/types'

export async function getMensalidades(ano?: number): Promise<Mensalidade[]> {
  let query = supabase
    .from('mensalidades')
    .select('*, desbravador:desbravadores(id,nome,unidade_id)')
    .order('mes_referencia')
    .order('desbravador_id')

  if (ano) {
    query = query
      .gte('mes_referencia', `${ano}-01-01`)
      .lte('mes_referencia', `${ano}-12-31`)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function upsertMensalidade(
  desbravadorId: string,
  mesReferencia: string,
  valor: number,
  status: StatusMensalidade,
  dataPagamento?: string,
  observacao?: string,
): Promise<Mensalidade> {
  const { data, error } = await supabase
    .from('mensalidades')
    .upsert(
      {
        desbravador_id: desbravadorId,
        mes_referencia: mesReferencia,
        valor,
        status,
        data_pagamento: dataPagamento ?? null,
        observacao: observacao ?? null,
      },
      { onConflict: 'desbravador_id,mes_referencia' },
    )
    .select()
    .single()
  if (error) throw error
  return data
}

export async function toggleMensalidade(
  desbravadorId: string,
  mesReferencia: string,
  valor: number,
): Promise<Mensalidade> {
  const { data: existing } = await supabase
    .from('mensalidades')
    .select()
    .eq('desbravador_id', desbravadorId)
    .eq('mes_referencia', mesReferencia)
    .single()

  const currentStatus = existing?.status ?? 'pendente'
  const newStatus: StatusMensalidade = currentStatus === 'pago' ? 'pendente' : 'pago'
  const dataPagamento = newStatus === 'pago' ? new Date().toISOString().slice(0, 10) : null

  return upsertMensalidade(desbravadorId, mesReferencia, valor, newStatus, dataPagamento ?? undefined)
}

export async function deleteMensalidade(id: string): Promise<void> {
  const { error } = await supabase.from('mensalidades').delete().eq('id', id)
  if (error) throw error
}
