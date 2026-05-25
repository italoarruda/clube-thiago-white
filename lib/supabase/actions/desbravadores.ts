'use server'
import { supabase } from '../client'
import type { Desbravador, DesbravadorEspecialidade } from '@/lib/types'

export async function getDesbravadores(): Promise<Desbravador[]> {
  const { data, error } = await supabase
    .from('desbravadores')
    .select('*, unidade:unidades(id,nome), classe:classes(id,nome,nivel)')
    .order('nome')
  if (error) throw error
  return data
}

export async function getDesbravador(id: string): Promise<Desbravador | null> {
  const { data, error } = await supabase
    .from('desbravadores')
    .select('*, unidade:unidades(id,nome), classe:classes(id,nome,nivel)')
    .eq('id', id)
    .single()
  if (error) return null
  return data
}

export async function createDesbravador(payload: Omit<Desbravador, 'id' | 'created_at' | 'unidade' | 'classe'>): Promise<Desbravador> {
  const { data, error } = await supabase
    .from('desbravadores')
    .insert(payload)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateDesbravador(id: string, payload: Partial<Omit<Desbravador, 'id' | 'created_at' | 'unidade' | 'classe'>>): Promise<Desbravador> {
  const { data, error } = await supabase
    .from('desbravadores')
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteDesbravador(id: string): Promise<void> {
  const { error } = await supabase.from('desbravadores').delete().eq('id', id)
  if (error) throw error
}

export async function getEspecialidadesDesbravador(desbravadorId: string): Promise<DesbravadorEspecialidade[]> {
  const { data, error } = await supabase
    .from('desbravador_especialidades')
    .select('*, especialidade:especialidades(id,nome,area,nivel)')
    .eq('desbravador_id', desbravadorId)
  if (error) throw error
  return data
}

export async function addEspecialidadeDesbravador(
  desbravadorId: string,
  especialidadeId: string,
): Promise<DesbravadorEspecialidade> {
  const { data, error } = await supabase
    .from('desbravador_especialidades')
    .insert({ desbravador_id: desbravadorId, especialidade_id: especialidadeId })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function concluirEspecialidadeDesbravador(id: string, dataConclusao: string): Promise<void> {
  const { error } = await supabase
    .from('desbravador_especialidades')
    .update({ status: 'concluida', data_conclusao: dataConclusao })
    .eq('id', id)
  if (error) throw error
}

export async function removeEspecialidadeDesbravador(id: string): Promise<void> {
  const { error } = await supabase.from('desbravador_especialidades').delete().eq('id', id)
  if (error) throw error
}
