'use client'
import { useState, useEffect } from 'react'
import { Printer, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { supabase } from '@/lib/supabase/client'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { CaixaTransacao } from '@/lib/types'

export default function FluxoCaixaPage() {
  const [transacoes, setTransacoes] = useState<CaixaTransacao[]>([])
  const [dataInicio, setDataInicio] = useState(`${new Date().getFullYear()}-01-01`)
  const [dataFim, setDataFim] = useState(new Date().toISOString().slice(0, 10))

  useEffect(() => {
    supabase.from('caixa_transacoes').select('*').gte('data', dataInicio).lte('data', dataFim).order('data')
      .then(({ data }) => setTransacoes(data ?? []))
  }, [dataInicio, dataFim])

  const entradas = transacoes.filter(t => t.tipo === 'entrada').reduce((s, t) => s + t.valor, 0)
  const saidas = transacoes.filter(t => t.tipo === 'saida').reduce((s, t) => s + t.valor, 0)
  const saldo = entradas - saidas

  // Agrupado por mês para gráfico
  const porMes: Record<string, { entradas: number; saidas: number }> = {}
  transacoes.forEach(t => {
    const mes = t.data.slice(0, 7)
    if (!porMes[mes]) porMes[mes] = { entradas: 0, saidas: 0 }
    if (t.tipo === 'entrada') porMes[mes].entradas += t.valor
    else porMes[mes].saidas += t.valor
  })
  const chartData = Object.entries(porMes).map(([mes, v]) => ({
    mes: mes.slice(5) + '/' + mes.slice(2, 4),
    Entradas: v.entradas,
    Saídas: v.saidas,
  }))

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between no-print">
        <h1 className="text-2xl font-bold flex items-center gap-2"><TrendingUp size={24} /> Fluxo de Caixa</h1>
        <Button onClick={() => window.print()}><Printer size={16} /> Imprimir</Button>
      </div>

      <div className="no-print flex gap-4 items-end">
        <Input label="De" type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} className="w-40" />
        <Input label="Até" type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} className="w-40" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center">
          <p className="text-sm text-green-700 dark:text-green-400">Total Entradas</p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(entradas)}</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-center">
          <p className="text-sm text-red-700 dark:text-red-400">Total Saídas</p>
          <p className="text-2xl font-bold text-red-700 dark:text-red-400 mt-1">{formatCurrency(saidas)}</p>
        </div>
        <div className={`${saldo >= 0 ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'} border rounded-xl p-4 text-center`}>
          <p className="text-sm text-[var(--muted)]">Saldo</p>
          <p className={`text-2xl font-bold mt-1 ${saldo >= 0 ? 'text-blue-700 dark:text-blue-400' : 'text-red-700 dark:text-red-400'}`}>{formatCurrency(saldo)}</p>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5 no-print">
          <h2 className="font-semibold mb-4">Evolução por Mês</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              <Bar dataKey="Entradas" fill="#16a34a" radius={[3,3,0,0]} />
              <Bar dataKey="Saídas" fill="#dc2626" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="print:mt-8">
        <div className="hidden print:block text-center mb-6">
          <h1 className="text-xl font-bold">CLUBE DE DESBRAVADORES THIAGO WHITE</h1>
          <h2 className="text-lg">RELATÓRIO DE FLUXO DE CAIXA</h2>
          <p>Período: {formatDate(dataInicio)} a {formatDate(dataFim)}</p>
        </div>
        <Table>
          <Thead><Tr><Th>Data</Th><Th>Descrição</Th><Th>Categoria</Th><Th>Tipo</Th><Th className="text-right">Valor</Th></Tr></Thead>
          <Tbody>
            {transacoes.map(t => (
              <Tr key={t.id}>
                <Td>{formatDate(t.data)}</Td>
                <Td>{t.descricao}</Td>
                <Td>{t.categoria}</Td>
                <Td><Badge variant={t.tipo === 'entrada' ? 'green' : 'red'}>{t.tipo === 'entrada' ? 'Entrada' : 'Saída'}</Badge></Td>
                <Td className={`text-right font-semibold ${t.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.tipo === 'entrada' ? '+' : '-'}{formatCurrency(t.valor)}
                </Td>
              </Tr>
            ))}
            <Tr>
              <Td colSpan={4} className="text-right font-bold">SALDO FINAL</Td>
              <Td className={`text-right font-bold text-lg ${saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(saldo)}</Td>
            </Tr>
          </Tbody>
        </Table>
      </div>
    </div>
  )
}
