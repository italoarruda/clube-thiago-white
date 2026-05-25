'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Users, Search, Eye } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { StatusDesbravadorBadge } from '@/components/ui/Badge'
import { supabase } from '@/lib/supabase/client'
import { CARGO_LABELS } from '@/lib/types'
import type { Desbravador, Unidade } from '@/lib/types'

export default function DesbravadoresPage() {
  const [desbravadores, setDesbravadores] = useState<Desbravador[]>([])
  const [unidades, setUnidades] = useState<Unidade[]>([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')
  const [filterUnidade, setFilterUnidade] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const [{ data: d }, { data: u }] = await Promise.all([
      supabase.from('desbravadores').select('*, unidade:unidades(id,nome), classe:classes(id,nome,nivel)').order('nome'),
      supabase.from('unidades').select('*').order('nome'),
    ])
    setDesbravadores(d ?? [])
    setUnidades(u ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = desbravadores.filter(d => {
    const matchBusca = d.nome.toLowerCase().includes(busca.toLowerCase())
    const matchUnidade = !filterUnidade || d.unidade_id === filterUnidade
    const matchStatus = !filterStatus || d.status === filterStatus
    return matchBusca && matchUnidade && matchStatus
  })

  const unidadeOptions = [
    { value: '', label: 'Todas as unidades' },
    ...unidades.map(u => ({ value: u.id, label: u.nome })),
  ]
  const statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'ativo', label: 'Ativo' },
    { value: 'inativo', label: 'Inativo' },
    { value: 'transferido', label: 'Transferido' },
    { value: 'desligado', label: 'Desligado' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Users size={24} /> Desbravadores</h1>
          <p className="text-[var(--muted)] text-sm mt-1">{desbravadores.filter(d => d.status === 'ativo').length} ativos</p>
        </div>
        <Link href="/cadastros/desbravadores/novo">
          <Button><Plus size={16} /> Novo Desbravador</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
          <input
            placeholder="Buscar por nome..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--card-bg)] pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Select placeholder="Todas as unidades" value={filterUnidade} onValueChange={setFilterUnidade} options={unidadeOptions} />
        <Select placeholder="Todos os status" value={filterStatus} onValueChange={setFilterStatus} options={statusOptions} />
      </div>

      {loading ? (
        <p className="text-[var(--muted)]">Carregando...</p>
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Nome</Th>
              <Th>Unidade</Th>
              <Th>Classe</Th>
              <Th>Cargo</Th>
              <Th>Status</Th>
              <Th className="w-24">Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.map(d => (
              <Tr key={d.id}>
                <Td className="font-medium">{d.nome}</Td>
                <Td>{(d as Desbravador & { unidade?: { nome: string } }).unidade?.nome ?? '—'}</Td>
                <Td>{(d as Desbravador & { classe?: { nome: string } }).classe?.nome ?? '—'}</Td>
                <Td>{CARGO_LABELS[d.cargo]}</Td>
                <Td><StatusDesbravadorBadge status={d.status} /></Td>
                <Td>
                  <Link href={`/cadastros/desbravadores/${d.id}`}>
                    <Button size="icon" variant="ghost"><Eye size={15} /></Button>
                  </Link>
                </Td>
              </Tr>
            ))}
            {filtered.length === 0 && (
              <Tr><Td colSpan={6} className="text-center text-[var(--muted)] py-8">Nenhum desbravador encontrado</Td></Tr>
            )}
          </Tbody>
        </Table>
      )}
    </div>
  )
}
