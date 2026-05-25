'use client'
import { useState, useEffect } from 'react'
import { Printer, Package } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { EstadoPatrimonioBadge } from '@/components/ui/Badge'
import { supabase } from '@/lib/supabase/client'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Patrimonio } from '@/lib/types'

export default function RelatorioPatrimonioPage() {
  const [itens, setItens] = useState<Patrimonio[]>([])

  useEffect(() => {
    supabase.from('patrimonio').select('*').order('numero_tombamento').then(({ data }) => setItens(data ?? []))
  }, [])

  const ativos = itens.filter(i => i.estado !== 'baixado')
  const total = ativos.reduce((s, i) => s + (i.valor_aquisicao ?? 0), 0)

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between no-print">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Package size={24} /> Relatório de Patrimônio</h1>
        <Button onClick={() => window.print()}><Printer size={16} /> Imprimir</Button>
      </div>

      <div className="hidden print:block text-center mb-6">
        <h1 className="text-xl font-bold">CLUBE DE DESBRAVADORES THIAGO WHITE</h1>
        <h2 className="text-lg">RELATÓRIO DE PATRIMÔNIO</h2>
        <p>Emitido em {new Date().toLocaleDateString('pt-BR')}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 no-print">
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-4 text-center">
          <p className="text-sm text-[var(--muted)]">Total de Bens</p>
          <p className="text-2xl font-bold">{ativos.length}</p>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-4 text-center">
          <p className="text-sm text-[var(--muted)]">Baixados</p>
          <p className="text-2xl font-bold">{itens.filter(i => i.estado === 'baixado').length}</p>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-4 text-center">
          <p className="text-sm text-[var(--muted)]">Valor Total</p>
          <p className="text-2xl font-bold">{formatCurrency(total)}</p>
        </div>
      </div>

      <Table>
        <Thead>
          <Tr>
            <Th>Tombamento</Th><Th>Nome</Th><Th>Localização</Th><Th>Estado</Th>
            <Th>Data Aquisição</Th><Th className="text-right">Valor</Th>
          </Tr>
        </Thead>
        <Tbody>
          {itens.map(i => (
            <Tr key={i.id}>
              <Td className="font-mono text-xs">{i.numero_tombamento ?? '—'}</Td>
              <Td className="font-medium">{i.nome}</Td>
              <Td>{i.localizacao ?? '—'}</Td>
              <Td><EstadoPatrimonioBadge estado={i.estado} /></Td>
              <Td>{formatDate(i.data_aquisicao)}</Td>
              <Td className="text-right">{i.valor_aquisicao ? formatCurrency(i.valor_aquisicao) : '—'}</Td>
            </Tr>
          ))}
          <Tr>
            <Td colSpan={5} className="text-right font-bold">TOTAL (bens ativos)</Td>
            <Td className="text-right font-bold text-lg">{formatCurrency(total)}</Td>
          </Tr>
        </Tbody>
      </Table>
    </div>
  )
}
