'use client'
import { useState, useEffect, useCallback } from 'react'
import { Plus, TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Dialog, DialogContent, DialogClose } from '@/components/ui/Dialog'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { StatCard } from '@/components/StatCard'
import { supabase } from '@/lib/supabase/client'
import { formatCurrency, formatDate } from '@/lib/utils'
import { CATEGORIA_CAIXA_LABELS } from '@/lib/types'
import type { CaixaTransacao, TipoTransacao, CategoriacCaixa } from '@/lib/types'

const TIPO_OPTIONS = [
  { value: 'entrada', label: 'Entrada' },
  { value: 'saida', label: 'Saída' },
]
const CATEGORIA_OPTIONS = Object.entries(CATEGORIA_CAIXA_LABELS).map(([v, l]) => ({ value: v, label: l }))

export default function CaixaPage() {
  const [transacoes, setTransacoes] = useState<CaixaTransacao[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [filterTipo, setFilterTipo] = useState('')
  const [form, setForm] = useState({ tipo: 'entrada', descricao: '', valor: '', data: new Date().toISOString().slice(0, 10), categoria: 'outro', referencia: '' })

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('caixa_transacoes').select('*').order('data', { ascending: false }).order('created_at', { ascending: false })
    setTransacoes(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const entradas = transacoes.filter(t => t.tipo === 'entrada').reduce((s, t) => s + t.valor, 0)
  const saidas = transacoes.filter(t => t.tipo === 'saida').reduce((s, t) => s + t.valor, 0)
  const saldo = entradas - saidas

  const filtered = transacoes.filter(t => !filterTipo || t.tipo === filterTipo)

  async function save() {
    if (!form.descricao.trim() || !form.valor) return
    await supabase.from('caixa_transacoes').insert({
      tipo: form.tipo as TipoTransacao,
      descricao: form.descricao,
      valor: Number(form.valor),
      data: form.data,
      categoria: form.categoria as CategoriacCaixa,
      referencia: form.referencia || null,
    })
    setOpen(false)
    setForm({ tipo: 'entrada', descricao: '', valor: '', data: new Date().toISOString().slice(0, 10), categoria: 'outro', referencia: '' })
    load()
  }

  async function remove(id: string) {
    if (!confirm('Excluir este lançamento?')) return
    await supabase.from('caixa_transacoes').delete().eq('id', id)
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Wallet size={24} /> Caixa</h1>
          <p className="text-[var(--muted)] text-sm mt-1">Controle de entradas e saídas</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus size={16} /> Novo Lançamento</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard title="Entradas" value={formatCurrency(entradas)} icon={TrendingUp} color="green" />
        <StatCard title="Saídas" value={formatCurrency(saidas)} icon={TrendingDown} color="red" />
        <StatCard title="Saldo" value={formatCurrency(saldo)} icon={Wallet} color={saldo >= 0 ? 'blue' : 'red'} />
      </div>

      <div className="flex gap-3">
        <Select value={filterTipo} onValueChange={setFilterTipo} options={[{ value: '', label: 'Todos' }, ...TIPO_OPTIONS]} />
      </div>

      {loading ? (
        <p className="text-[var(--muted)]">Carregando...</p>
      ) : (
        <Table>
          <Thead><Tr><Th>Data</Th><Th>Descrição</Th><Th>Categoria</Th><Th>Tipo</Th><Th className="text-right">Valor</Th><Th className="w-16"></Th></Tr></Thead>
          <Tbody>
            {filtered.map(t => (
              <Tr key={t.id}>
                <Td>{formatDate(t.data)}</Td>
                <Td className="font-medium">{t.descricao}</Td>
                <Td>{CATEGORIA_CAIXA_LABELS[t.categoria]}</Td>
                <Td><Badge variant={t.tipo === 'entrada' ? 'green' : 'red'}>{t.tipo === 'entrada' ? 'Entrada' : 'Saída'}</Badge></Td>
                <Td className={`text-right font-semibold ${t.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.tipo === 'entrada' ? '+' : '-'}{formatCurrency(t.valor)}
                </Td>
                <Td>
                  <Button size="sm" variant="ghost" onClick={() => remove(t.id)} className="text-red-500 text-xs">Excluir</Button>
                </Td>
              </Tr>
            ))}
            {filtered.length === 0 && <Tr><Td colSpan={6} className="text-center text-[var(--muted)] py-8">Nenhum lançamento</Td></Tr>}
          </Tbody>
        </Table>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent title="Novo Lançamento">
          <div className="space-y-4">
            <Select label="Tipo *" value={form.tipo} onValueChange={v => setForm(f => ({ ...f, tipo: v }))} options={TIPO_OPTIONS} />
            <Input label="Descrição *" value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} placeholder="Descreva o lançamento" />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Valor (R$) *" type="number" min="0" step="0.01" value={form.valor} onChange={e => setForm(f => ({ ...f, valor: e.target.value }))} />
              <Input label="Data" type="date" value={form.data} onChange={e => setForm(f => ({ ...f, data: e.target.value }))} />
            </div>
            <Select label="Categoria" value={form.categoria} onValueChange={v => setForm(f => ({ ...f, categoria: v }))} options={CATEGORIA_OPTIONS} />
            <Input label="Referência" value={form.referencia} onChange={e => setForm(f => ({ ...f, referencia: e.target.value }))} placeholder="Ex: Evento, Nome do desbravador..." />
            <div className="flex justify-end gap-2 pt-2">
              <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
              <Button onClick={save}>Lançar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
