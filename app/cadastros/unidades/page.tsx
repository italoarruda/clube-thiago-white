'use client'
import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Dialog, DialogContent, DialogTrigger, DialogClose } from '@/components/ui/Dialog'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { supabase } from '@/lib/supabase/client'
import type { Unidade } from '@/lib/types'

export default function UnidadesPage() {
  const [unidades, setUnidades] = useState<Unidade[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Unidade | null>(null)
  const [form, setForm] = useState({ nome: '', lider_nome: '', lider_contato: '', ativo: true })

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('unidades').select('*').order('nome')
    setUnidades(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  function openCreate() {
    setEditing(null)
    setForm({ nome: '', lider_nome: '', lider_contato: '', ativo: true })
    setOpen(true)
  }

  function openEdit(u: Unidade) {
    setEditing(u)
    setForm({ nome: u.nome, lider_nome: u.lider_nome ?? '', lider_contato: u.lider_contato ?? '', ativo: u.ativo })
    setOpen(true)
  }

  async function save() {
    if (!form.nome.trim()) return
    if (editing) {
      await supabase.from('unidades').update({ ...form, lider_nome: form.lider_nome || null, lider_contato: form.lider_contato || null }).eq('id', editing.id)
    } else {
      await supabase.from('unidades').insert({ ...form, lider_nome: form.lider_nome || null, lider_contato: form.lider_contato || null })
    }
    setOpen(false)
    load()
  }

  async function remove(id: string) {
    if (!confirm('Excluir esta unidade?')) return
    await supabase.from('unidades').delete().eq('id', id)
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Users size={24} /> Unidades</h1>
          <p className="text-[var(--muted)] text-sm mt-1">Grupos do clube</p>
        </div>
        <Button onClick={openCreate}><Plus size={16} /> Nova Unidade</Button>
      </div>

      {loading ? (
        <p className="text-[var(--muted)]">Carregando...</p>
      ) : (
        <Table>
          <Thead><Tr><Th>Nome</Th><Th>Líder</Th><Th>Contato</Th><Th>Status</Th><Th className="w-24">Ações</Th></Tr></Thead>
          <Tbody>
            {unidades.map(u => (
              <Tr key={u.id}>
                <Td className="font-medium">{u.nome}</Td>
                <Td>{u.lider_nome ?? '—'}</Td>
                <Td>{u.lider_contato ?? '—'}</Td>
                <Td><Badge variant={u.ativo ? 'green' : 'default'}>{u.ativo ? 'Ativa' : 'Inativa'}</Badge></Td>
                <Td>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(u)}><Pencil size={15} /></Button>
                    <Button size="icon" variant="ghost" onClick={() => remove(u.id)}><Trash2 size={15} className="text-red-500" /></Button>
                  </div>
                </Td>
              </Tr>
            ))}
            {unidades.length === 0 && <Tr><Td colSpan={5} className="text-center text-[var(--muted)] py-8">Nenhuma unidade cadastrada</Td></Tr>}
          </Tbody>
        </Table>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent title={editing ? 'Editar Unidade' : 'Nova Unidade'}>
          <div className="space-y-4">
            <Input label="Nome *" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Ex: Leões" />
            <Input label="Nome do Líder" value={form.lider_nome} onChange={e => setForm(f => ({ ...f, lider_nome: e.target.value }))} placeholder="Nome completo" />
            <Input label="Contato do Líder" value={form.lider_contato} onChange={e => setForm(f => ({ ...f, lider_contato: e.target.value }))} placeholder="Telefone ou e-mail" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.ativo} onChange={e => setForm(f => ({ ...f, ativo: e.target.checked }))} className="rounded" />
              Unidade ativa
            </label>
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
