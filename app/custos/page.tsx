'use client'
import { useState, useEffect, useCallback } from 'react'
import { Plus, BarChart2, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Dialog, DialogContent, DialogClose } from '@/components/ui/Dialog'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { supabase } from '@/lib/supabase/client'
import { formatCurrency, formatDate } from '@/lib/utils'
import { CATEGORIA_CUSTO_LABELS } from '@/lib/types'
import type { Custo, CategoriaCusto, StatusCusto } from '@/lib/types'

const CATEGORIA_OPTIONS = Object.entries(CATEGORIA_CUSTO_LABELS).map(([v, l]) => ({ value: v, label: l }))
const STATUS_OPTIONS = [
  { value: 'pendente', label: 'Pendente' },
  { value: 'pago', label: 'Pago' },
]

const EMPTY = { descricao: '', valor: '', data: new Date().toISOString().slice(0, 10), categoria: 'material', fornecedor: '', nota_fiscal: '', status_pagamento: 'pendente' }

export default function CustosPage() {
  const [custos, setCustos] = useState<Custo[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Custo | null>(null)
  const [form, setForm] = useState(EMPTY)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('custos').select('*').order('data', { ascending: false })
    setCustos(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const totalPendente = custos.filter(c => c.status_pagamento === 'pendente').reduce((s, c) => s + c.valor, 0)
  const totalPago = custos.filter(c => c.status_pagamento === 'pago').reduce((s, c) => s + c.valor, 0)

  function openCreate() {
    setEditing(null)
    setForm(EMPTY)
    setOpen(true)
  }

  function openEdit(c: Custo) {
    setEditing(c)
    setForm({ descricao: c.descricao, valor: String(c.valor), data: c.data, categoria: c.categoria, fornecedor: c.fornecedor ?? '', nota_fiscal: c.nota_fiscal ?? '', status_pagamento: c.status_pagamento })
    setOpen(true)
  }

  async function save() {
    if (!form.descricao.trim() || !form.valor) return
    const payload = {
      descricao: form.descricao, valor: Number(form.valor), data: form.data,
      categoria: form.categoria as CategoriaCusto, fornecedor: form.fornecedor || null,
      nota_fiscal: form.nota_fiscal || null, status_pagamento: form.status_pagamento as StatusCusto,
    }
    if (editing) {
      await supabase.from('custos').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('custos').insert(payload)
    }
    setOpen(false)
    load()
  }

  async function remove(id: string) {
    if (!confirm('Excluir este custo?')) return
    await supabase.from('custos').delete().eq('id', id)
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><BarChart2 size={24} /> Custos</h1>
          <p className="text-[var(--muted)] text-sm mt-1">Pendente: {formatCurrency(totalPendente)} · Pago: {formatCurrency(totalPago)}</p>
        </div>
        <Button onClick={openCreate}><Plus size={16} /> Novo Custo</Button>
      </div>

      {loading ? (
        <p className="text-[var(--muted)]">Carregando...</p>
      ) : (
        <Table>
          <Thead><Tr><Th>Data</Th><Th>Descrição</Th><Th>Categoria</Th><Th>Fornecedor</Th><Th>NF</Th><Th>Status</Th><Th className="text-right">Valor</Th><Th className="w-20"></Th></Tr></Thead>
          <Tbody>
            {custos.map(c => (
              <Tr key={c.id}>
                <Td>{formatDate(c.data)}</Td>
                <Td className="font-medium">{c.descricao}</Td>
                <Td>{CATEGORIA_CUSTO_LABELS[c.categoria]}</Td>
                <Td>{c.fornecedor ?? '—'}</Td>
                <Td>{c.nota_fiscal ?? '—'}</Td>
                <Td><Badge variant={c.status_pagamento === 'pago' ? 'green' : 'yellow'}>{c.status_pagamento === 'pago' ? 'Pago' : 'Pendente'}</Badge></Td>
                <Td className="text-right font-semibold">{formatCurrency(c.valor)}</Td>
                <Td>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(c)}><Pencil size={15} /></Button>
                    <Button size="icon" variant="ghost" onClick={() => remove(c.id)}><Trash2 size={15} className="text-red-500" /></Button>
                  </div>
                </Td>
              </Tr>
            ))}
            {custos.length === 0 && <Tr><Td colSpan={8} className="text-center text-[var(--muted)] py-8">Nenhum custo registrado</Td></Tr>}
          </Tbody>
        </Table>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent title={editing ? 'Editar Custo' : 'Novo Custo'}>
          <div className="space-y-4">
            <Input label="Descrição *" value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Valor (R$) *" type="number" min="0" step="0.01" value={form.valor} onChange={e => setForm(f => ({ ...f, valor: e.target.value }))} />
              <Input label="Data" type="date" value={form.data} onChange={e => setForm(f => ({ ...f, data: e.target.value }))} />
            </div>
            <Select label="Categoria" value={form.categoria} onValueChange={v => setForm(f => ({ ...f, categoria: v }))} options={CATEGORIA_OPTIONS} />
            <Input label="Fornecedor" value={form.fornecedor} onChange={e => setForm(f => ({ ...f, fornecedor: e.target.value }))} />
            <Input label="Nota Fiscal" value={form.nota_fiscal} onChange={e => setForm(f => ({ ...f, nota_fiscal: e.target.value }))} />
            <Select label="Status de Pagamento" value={form.status_pagamento} onValueChange={v => setForm(f => ({ ...f, status_pagamento: v }))} options={STATUS_OPTIONS} />
            <div className="flex justify-end gap-2 pt-2">
              <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
              <Button onClick={save}>Salvar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
