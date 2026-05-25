'use client'
import { useState, useEffect } from 'react'
import { Printer, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { Badge, StatusDesbravadorBadge } from '@/components/ui/Badge'
import { supabase } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import { CARGO_LABELS } from '@/lib/types'
import type { Desbravador, Unidade, Classe, Especialidade } from '@/lib/types'

type Tab = 'desbravadores' | 'unidades' | 'classes' | 'especialidades'

export default function RelatorioCadastrosPage() {
  const [activeTab, setActiveTab] = useState<Tab>('desbravadores')
  const [desbravadores, setDesbravadores] = useState<Desbravador[]>([])
  const [unidades, setUnidades] = useState<Unidade[]>([])
  const [classes, setClasses] = useState<Classe[]>([])
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([])

  useEffect(() => {
    Promise.all([
      supabase.from('desbravadores').select('*, unidade:unidades(id,nome), classe:classes(id,nome)').order('nome'),
      supabase.from('unidades').select('*').order('nome'),
      supabase.from('classes').select('*').order('nivel'),
      supabase.from('especialidades').select('*').order('nome'),
    ]).then(([{ data: d }, { data: u }, { data: c }, { data: e }]) => {
      setDesbravadores(d ?? [])
      setUnidades(u ?? [])
      setClasses(c ?? [])
      setEspecialidades(e ?? [])
    })
  }, [])

  const TABS: { id: Tab; label: string }[] = [
    { id: 'desbravadores', label: `Desbravadores (${desbravadores.length})` },
    { id: 'unidades', label: `Unidades (${unidades.length})` },
    { id: 'classes', label: `Classes (${classes.length})` },
    { id: 'especialidades', label: `Especialidades (${especialidades.length})` },
  ]

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between no-print">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Users size={24} /> Relatório de Cadastros</h1>
        <Button onClick={() => window.print()}><Printer size={16} /> Imprimir</Button>
      </div>

      <div className="no-print flex gap-2 border-b border-[var(--border)]">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-[var(--muted)] hover:text-[var(--foreground)]'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="hidden print:block text-center mb-6">
        <h1 className="text-xl font-bold">CLUBE DE DESBRAVADORES THIAGO WHITE</h1>
        <h2 className="text-lg">RELATÓRIO DE CADASTROS</h2>
        <p>Emitido em {new Date().toLocaleDateString('pt-BR')}</p>
      </div>

      {/* Desbravadores */}
      {(activeTab === 'desbravadores') && (
        <Table>
          <Thead><Tr><Th>Nome</Th><Th>CPF</Th><Th>Unidade</Th><Th>Classe</Th><Th>Cargo</Th><Th>Ingresso</Th><Th>Status</Th></Tr></Thead>
          <Tbody>
            {desbravadores.map(d => (
              <Tr key={d.id}>
                <Td className="font-medium">{d.nome}</Td>
                <Td className="font-mono text-xs">{d.cpf ?? '—'}</Td>
                <Td>{(d as Desbravador & { unidade?: { nome: string } }).unidade?.nome ?? '—'}</Td>
                <Td>{(d as Desbravador & { classe?: { nome: string } }).classe?.nome ?? '—'}</Td>
                <Td>{CARGO_LABELS[d.cargo]}</Td>
                <Td>{formatDate(d.data_ingresso)}</Td>
                <Td><StatusDesbravadorBadge status={d.status} /></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      {/* Unidades */}
      {(activeTab === 'unidades') && (
        <Table>
          <Thead><Tr><Th>Nome</Th><Th>Líder</Th><Th>Contato</Th><Th>Status</Th></Tr></Thead>
          <Tbody>
            {unidades.map(u => (
              <Tr key={u.id}>
                <Td className="font-medium">{u.nome}</Td>
                <Td>{u.lider_nome ?? '—'}</Td>
                <Td>{u.lider_contato ?? '—'}</Td>
                <Td><Badge variant={u.ativo ? 'green' : 'default'}>{u.ativo ? 'Ativa' : 'Inativa'}</Badge></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      {/* Classes */}
      {(activeTab === 'classes') && (
        <Table>
          <Thead><Tr><Th>Nível</Th><Th>Nome</Th><Th>Descrição</Th></Tr></Thead>
          <Tbody>
            {classes.map(c => (
              <Tr key={c.id}>
                <Td className="font-bold text-blue-600">{c.nivel}</Td>
                <Td className="font-medium">{c.nome}</Td>
                <Td className="text-[var(--muted)]">{c.descricao ?? '—'}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      {/* Especialidades */}
      {(activeTab === 'especialidades') && (
        <Table>
          <Thead><Tr><Th>Nome</Th><Th>Área</Th><Th>Nível</Th><Th>Status</Th></Tr></Thead>
          <Tbody>
            {especialidades.map(e => (
              <Tr key={e.id}>
                <Td className="font-medium">{e.nome}</Td>
                <Td>{e.area}</Td>
                <Td><Badge variant="blue">Nível {e.nivel}</Badge></Td>
                <Td><Badge variant={e.ativo ? 'green' : 'default'}>{e.ativo ? 'Ativa' : 'Inativa'}</Badge></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </div>
  )
}
