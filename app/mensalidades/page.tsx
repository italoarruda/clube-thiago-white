'use client'
import { useState, useEffect, useCallback } from 'react'
import { DollarSign, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { supabase } from '@/lib/supabase/client'
import { MESES, STATUS_MENSALIDADE_LABELS } from '@/lib/types'
import { formatCurrency, monthKey, currentYear, getMonthsOfYear } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Desbravador, Mensalidade, StatusMensalidade, Unidade } from '@/lib/types'

const VALOR_PADRAO = 30

export default function MensalidadesPage() {
  const [ano, setAno] = useState(currentYear())
  const [desbravadores, setDesbravadores] = useState<Pick<Desbravador, 'id' | 'nome' | 'unidade_id' | 'status'>[]>([])
  const [unidades, setUnidades] = useState<Unidade[]>([])
  const [mensalidades, setMensalidades] = useState<Mensalidade[]>([])
  const [filterUnidade, setFilterUnidade] = useState('')
  const [loading, setLoading] = useState(true)

  const meses = getMonthsOfYear(ano)

  const load = useCallback(async () => {
    setLoading(true)
    const [{ data: d }, { data: u }, { data: m }] = await Promise.all([
      supabase.from('desbravadores').select('id,nome,unidade_id,status').eq('status', 'ativo').order('nome'),
      supabase.from('unidades').select('*').order('nome'),
      supabase.from('mensalidades').select('*').gte('mes_referencia', `${ano}-01-01`).lte('mes_referencia', `${ano}-12-31`),
    ])
    setDesbravadores(d ?? [])
    setUnidades(u ?? [])
    setMensalidades(m ?? [])
    setLoading(false)
  }, [ano])

  useEffect(() => { load() }, [load])

  function getMensalidade(desbravadorId: string, mes: string): Mensalidade | undefined {
    return mensalidades.find(m => m.desbravador_id === desbravadorId && m.mes_referencia === mes)
  }

  async function toggle(desbravadorId: string, mes: string) {
    const existing = getMensalidade(desbravadorId, mes)
    const currentStatus = existing?.status ?? 'pendente'
    const newStatus: StatusMensalidade = currentStatus === 'pago' ? 'pendente' : 'pago'
    const dataPagamento = newStatus === 'pago' ? new Date().toISOString().slice(0, 10) : null

    await supabase.from('mensalidades').upsert({
      desbravador_id: desbravadorId,
      mes_referencia: mes,
      valor: VALOR_PADRAO,
      status: newStatus,
      data_pagamento: dataPagamento,
    }, { onConflict: 'desbravador_id,mes_referencia' })
    load()
  }

  const filtered = desbravadores.filter(d => !filterUnidade || d.unidade_id === filterUnidade)

  const pago = (mes: string) => filtered.filter(d => getMensalidade(d.id, mes)?.status === 'pago').length
  const total = filtered.length
  const arrecadado = mensalidades.filter(m => m.status === 'pago').reduce((acc, m) => acc + m.valor, 0)

  const anoOptions = Array.from({ length: 5 }, (_, i) => {
    const y = currentYear() - 2 + i
    return { value: String(y), label: String(y) }
  })

  const unidadeOptions = [
    { value: '', label: 'Todos' },
    ...unidades.map(u => ({ value: u.id, label: u.nome })),
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><DollarSign size={24} /> Mensalidades</h1>
          <p className="text-[var(--muted)] text-sm mt-1">Total arrecadado em {ano}: {formatCurrency(arrecadado)}</p>
        </div>
        <div className="flex gap-3 items-center">
          <Select value={filterUnidade} onValueChange={setFilterUnidade} options={unidadeOptions} />
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => setAno(a => a - 1)}><ChevronLeft size={18} /></Button>
            <span className="text-sm font-semibold w-10 text-center">{ano}</span>
            <Button variant="ghost" size="icon" onClick={() => setAno(a => a + 1)}><ChevronRight size={18} /></Button>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-[var(--muted)]">Carregando...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-[var(--muted)] text-xs uppercase tracking-wide">
                <th className="px-4 py-3 text-left font-semibold sticky left-0 bg-slate-50 dark:bg-slate-800/50 min-w-36">Desbravador</th>
                {meses.map((mes, i) => (
                  <th key={mes} className="px-2 py-3 text-center font-semibold min-w-16">
                    <div>{MESES[i].slice(0, 3)}</div>
                    <div className="text-[10px] font-normal">{pago(mes)}/{total}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.map(dbv => (
                <tr key={dbv.id} className="bg-[var(--card-bg)] hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="px-4 py-2 font-medium sticky left-0 bg-[var(--card-bg)]">{dbv.nome}</td>
                  {meses.map(mes => {
                    const m = getMensalidade(dbv.id, mes)
                    const status = m?.status ?? 'pendente'
                    return (
                      <td key={mes} className="px-2 py-2 text-center">
                        <button
                          onClick={() => toggle(dbv.id, mes)}
                          title={STATUS_MENSALIDADE_LABELS[status]}
                          className={cn(
                            'w-8 h-8 rounded-full text-xs font-bold transition-colors mx-auto flex items-center justify-center',
                            status === 'pago' && 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
                            status === 'pendente' && 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200',
                            status === 'atrasado' && 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
                            status === 'isento' && 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
                          )}
                        >
                          {status === 'pago' ? '✓' : status === 'isento' ? 'I' : status === 'atrasado' ? '!' : '—'}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={13} className="text-center text-[var(--muted)] py-8">Nenhum desbravador ativo</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex gap-4 text-xs text-[var(--muted)]">
        <span className="flex items-center gap-1"><span className="w-4 h-4 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px]">✓</span> Pago</span>
        <span className="flex items-center gap-1"><span className="w-4 h-4 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px]">—</span> Pendente</span>
        <span className="flex items-center gap-1"><span className="w-4 h-4 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-[10px]">!</span> Atrasado</span>
        <span className="flex items-center gap-1"><span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px]">I</span> Isento</span>
      </div>
    </div>
  )
}
