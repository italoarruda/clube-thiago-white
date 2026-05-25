'use client'
import { useState, useEffect } from 'react'
import { Users, DollarSign, Package, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { StatCard } from '@/components/StatCard'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { supabase } from '@/lib/supabase/client'
import { formatCurrency, formatDate, currentYear, getMonthsOfYear } from '@/lib/utils'
import { MESES } from '@/lib/types'
import type { CaixaTransacao } from '@/lib/types'

interface DashboardStats {
  totalDesbravadores: number
  inadimplentes: number
  saldoCaixa: number
  totalPatrimonio: number
}

const PIE_COLORS = ['#2563eb', '#16a34a', '#d97706', '#dc2626', '#7c3aed', '#0891b2']

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({ totalDesbravadores: 0, inadimplentes: 0, saldoCaixa: 0, totalPatrimonio: 0 })
  const [mensalidadesPorMes, setMensalidadesPorMes] = useState<{ mes: string; pago: number; pendente: number }[]>([])
  const [unidadeDist, setUnidadeDist] = useState<{ name: string; value: number }[]>([])
  const [ultimasTransacoes, setUltimasTransacoes] = useState<CaixaTransacao[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const ano = currentYear()
      const meses = getMonthsOfYear(ano)

      const [
        { data: desbravadores },
        { data: mensalidades },
        { data: transacoes },
        { data: patrimonio },
        { data: unidades },
      ] = await Promise.all([
        supabase.from('desbravadores').select('id,status,unidade_id').eq('status', 'ativo'),
        supabase.from('mensalidades').select('desbravador_id,mes_referencia,status,valor').gte('mes_referencia', `${ano}-01-01`).lte('mes_referencia', `${ano}-12-31`),
        supabase.from('caixa_transacoes').select('*').order('data', { ascending: false }).limit(10),
        supabase.from('patrimonio').select('valor_aquisicao,estado').neq('estado', 'baixado'),
        supabase.from('unidades').select('id,nome'),
      ])

      const d = desbravadores ?? []
      const m = mensalidades ?? []
      const t = transacoes ?? []
      const p = patrimonio ?? []
      const u = unidades ?? []

      // Saldo caixa
      const saldo = (t ?? []).reduce((acc: number, tx: CaixaTransacao) => acc + (tx.tipo === 'entrada' ? tx.valor : -tx.valor), 0)

      // Inadimplentes: ativos sem mensalidade paga no mês atual
      const mesAtual = meses[new Date().getMonth()]
      const pagouEssMes = new Set(m.filter(ms => ms.mes_referencia === mesAtual && ms.status === 'pago').map(ms => ms.desbravador_id))
      const inadimplentes = d.filter(dbv => !pagouEssMes.has(dbv.id)).length

      // Patrimônio total
      const totalPat = p.reduce((acc, item) => acc + (item.valor_aquisicao ?? 0), 0)

      // Mensalidades por mês
      const porMes = meses.map((mes, i) => {
        const pago = m.filter(ms => ms.mes_referencia === mes && ms.status === 'pago').length
        const pendente = d.length - pago
        return { mes: MESES[i].slice(0, 3), pago, pendente: Math.max(0, pendente) }
      })

      // Distribuição por unidade
      const unidadeMap: Record<string, number> = {}
      d.forEach(dbv => {
        if (dbv.unidade_id) {
          unidadeMap[dbv.unidade_id] = (unidadeMap[dbv.unidade_id] ?? 0) + 1
        }
      })
      const dist = u.map(un => ({ name: un.nome, value: unidadeMap[un.id] ?? 0 })).filter(un => un.value > 0)

      setStats({ totalDesbravadores: d.length, inadimplentes, saldoCaixa: saldo, totalPatrimonio: totalPat })
      setMensalidadesPorMes(porMes)
      setUnidadeDist(dist)
      setUltimasTransacoes(t)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <p className="text-[var(--muted)]">Carregando dashboard...</p>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-[var(--muted)] text-sm mt-1">Clube de Desbravadores Thiago White</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Desbravadores Ativos" value={stats.totalDesbravadores} icon={Users} color="blue" />
        <StatCard title="Inadimplentes (mês atual)" value={stats.inadimplentes} icon={AlertCircle} color="red" />
        <StatCard title="Saldo de Caixa" value={formatCurrency(stats.saldoCaixa)} icon={stats.saldoCaixa >= 0 ? TrendingUp : TrendingDown} color={stats.saldoCaixa >= 0 ? 'green' : 'red'} />
        <StatCard title="Patrimônio Total" value={formatCurrency(stats.totalPatrimonio)} icon={Package} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5">
          <h2 className="font-semibold mb-4">Mensalidades por Mês ({currentYear()})</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={mensalidadesPorMes} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="pago" fill="#16a34a" name="Pago" radius={[3, 3, 0, 0]} />
              <Bar dataKey="pendente" fill="#e2e8f0" name="Pendente" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5">
          <h2 className="font-semibold mb-4">Distribuição por Unidade</h2>
          {unidadeDist.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={unidadeDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={false} labelLine={false} fontSize={11}>
                  {unidadeDist.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-[var(--muted)] text-sm text-center pt-10">Nenhuma unidade com desbravadores</p>
          )}
        </div>
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5">
        <h2 className="font-semibold mb-4 flex items-center gap-2"><DollarSign size={18} /> Últimas Transações de Caixa</h2>
        <Table>
          <Thead><Tr><Th>Data</Th><Th>Descrição</Th><Th>Tipo</Th><Th className="text-right">Valor</Th></Tr></Thead>
          <Tbody>
            {ultimasTransacoes.slice(0, 8).map(t => (
              <Tr key={t.id}>
                <Td>{formatDate(t.data)}</Td>
                <Td>{t.descricao}</Td>
                <Td><Badge variant={t.tipo === 'entrada' ? 'green' : 'red'}>{t.tipo === 'entrada' ? 'Entrada' : 'Saída'}</Badge></Td>
                <Td className={`text-right font-semibold ${t.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.tipo === 'entrada' ? '+' : '-'}{formatCurrency(t.valor)}
                </Td>
              </Tr>
            ))}
            {ultimasTransacoes.length === 0 && <Tr><Td colSpan={4} className="text-center text-[var(--muted)] py-6">Nenhuma transação</Td></Tr>}
          </Tbody>
        </Table>
      </div>
    </div>
  )
}
