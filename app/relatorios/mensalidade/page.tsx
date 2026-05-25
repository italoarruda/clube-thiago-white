'use client'
import { useState, useEffect } from 'react'
import { Printer, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { StatusMensalidadeBadge } from '@/components/ui/Badge'
import { supabase } from '@/lib/supabase/client'
import { formatCurrency, formatDate, monthKey, currentYear, getMonthsOfYear } from '@/lib/utils'
import { MESES } from '@/lib/types'
import type { Desbravador, Mensalidade } from '@/lib/types'

export default function RelatorioMensalidadePage() {
  const [desbravadores, setDesbravadores] = useState<Pick<Desbravador, 'id' | 'nome' | 'unidade_id'>[]>([])
  const [mensalidades, setMensalidades] = useState<Mensalidade[]>([])
  const [mesSelecionado, setMesSelecionado] = useState(monthKey(currentYear(), new Date().getMonth() + 1))

  const mesOptions = getMonthsOfYear(currentYear()).map((m, i) => ({ value: m, label: MESES[i] + ' ' + currentYear() }))

  useEffect(() => {
    Promise.all([
      supabase.from('desbravadores').select('id,nome,unidade_id').eq('status', 'ativo').order('nome'),
      supabase.from('mensalidades').select('*').eq('mes_referencia', mesSelecionado),
    ]).then(([{ data: d }, { data: m }]) => {
      setDesbravadores(d ?? [])
      setMensalidades(m ?? [])
    })
  }, [mesSelecionado])

  const getMensalidade = (id: string) => mensalidades.find(m => m.desbravador_id === id)

  const pagos = desbravadores.filter(d => getMensalidade(d.id)?.status === 'pago').length
  const pendentes = desbravadores.filter(d => !getMensalidade(d.id) || getMensalidade(d.id)?.status === 'pendente').length
  const arrecadado = mensalidades.filter(m => m.status === 'pago').reduce((s, m) => s + m.valor, 0)
  const mesLabel = MESES[Number(mesSelecionado.slice(5, 7)) - 1]

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between no-print">
        <h1 className="text-2xl font-bold flex items-center gap-2"><DollarSign size={24} /> Relatório de Mensalidade</h1>
        <Button onClick={() => window.print()}><Printer size={16} /> Imprimir</Button>
      </div>

      <div className="no-print">
        <Select value={mesSelecionado} onValueChange={setMesSelecionado} options={mesOptions} />
      </div>

      <div className="hidden print:block text-center mb-6">
        <h1 className="text-xl font-bold">CLUBE DE DESBRAVADORES THIAGO WHITE</h1>
        <h2 className="text-lg">RELATÓRIO DE MENSALIDADE — {mesLabel.toUpperCase()} {currentYear()}</h2>
        <p>Emitido em {new Date().toLocaleDateString('pt-BR')}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 no-print">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center">
          <p className="text-sm text-green-700 dark:text-green-400">Pagaram</p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-400">{pagos}</p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-center">
          <p className="text-sm text-yellow-700 dark:text-yellow-400">Pendente</p>
          <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">{pendentes}</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-center">
          <p className="text-sm text-blue-700 dark:text-blue-400">Arrecadado</p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{formatCurrency(arrecadado)}</p>
        </div>
      </div>

      <Table>
        <Thead><Tr><Th>Desbravador</Th><Th>Status</Th><Th>Data Pagamento</Th><Th className="text-right">Valor</Th></Tr></Thead>
        <Tbody>
          {desbravadores.map(d => {
            const m = getMensalidade(d.id)
            return (
              <Tr key={d.id}>
                <Td className="font-medium">{d.nome}</Td>
                <Td><StatusMensalidadeBadge status={m?.status ?? 'pendente'} /></Td>
                <Td>{m?.data_pagamento ? formatDate(m.data_pagamento) : '—'}</Td>
                <Td className="text-right">{m?.valor ? formatCurrency(m.valor) : '—'}</Td>
              </Tr>
            )
          })}
          <Tr>
            <Td colSpan={3} className="text-right font-bold">TOTAL ARRECADADO</Td>
            <Td className="text-right font-bold text-green-600">{formatCurrency(arrecadado)}</Td>
          </Tr>
        </Tbody>
      </Table>
    </div>
  )
}
