'use client'
import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Dialog, DialogContent, DialogClose } from '@/components/ui/Dialog'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { Select } from '@/components/ui/Select'
import { supabase } from '@/lib/supabase/client'
import type { Classe } from '@/lib/types'

const NIVEL_OPTIONS = [1,2,3,4,5,6].map(n => ({ value: String(n), label: `Nível ${n}` }))

export default function ClassesPage() {
  const [classes, setClasses] = useState<Classe[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Classe | null>(null)
  const [form, setForm] = useState({ nome: '', nivel: '1', descricao: '' })

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('classes').select('*').order('nivel')
    setClasses(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  function openCreate() {
    setEditing(null)
    setForm({ nome: '', nivel: '1', descricao: '' })
    setOpen(true)
  }

  function openEdit(c: Classe) {
    setEditing(c)
    setForm({ nome: c.nome, nivel: String(c.nivel), descricao: c.descricao ?? '' })
    setOpen(true)
  }

  async function save() {
    if (!form.nome.trim()) return
    const payload = { nome: form.nome, nivel: Number(form.nivel), descricao: form.descricao || null }
    if (editing) {
      await supabase.from('classes').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('classes').insert(payload)
    }
    setOpen(false)
    load()
  }

  async function remove(id: string) {
    if (!confirm('Excluir esta classe?')) return
    await supabase.from('classes').delete().eq('id', id)
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><BookOpen size={24} /> Classes</h1>
          <p className="text-[var(--muted)] text-sm mt-1">Níveis de progressão dos desbravadores</p>
        </div>
        <Button onClick={openCreate}><Plus size={16} /> Nova Classe</Button>
      </div>

      {loading ? (
        <p className="text-[var(--muted)]">Carregando...</p>
      ) : (
        <Table>
          <Thead><Tr><Th>Nível</Th><Th>Nome</Th><Th>Descrição</Th><Th className="w-24">Ações</Th></Tr></Thead>
          <Tbody>
            {classes.map(c => (
              <Tr key={c.id}>
                <Td><span className="font-bold text-blue-600">{c.nivel}</span></Td>
                <Td className="font-medium">{c.nome}</Td>
                <Td className="text-[var(--muted)]">{c.descricao ?? '—'}</Td>
                <Td>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(c)}><Pencil size={15} /></Button>
                    <Button size="icon" variant="ghost" onClick={() => remove(c.id)}><Trash2 size={15} className="text-red-500" /></Button>
                  </div>
                </Td>
              </Tr>
            ))}
            {classes.length === 0 && <Tr><Td colSpan={4} className="text-center text-[var(--muted)] py-8">Nenhuma classe cadastrada</Td></Tr>}
          </Tbody>
        </Table>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent title={editing ? 'Editar Classe' : 'Nova Classe'}>
          <div className="space-y-4">
            <Input label="Nome *" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Ex: Amigo" />
            <Select label="Nível" value={form.nivel} onValueChange={v => setForm(f => ({ ...f, nivel: v }))} options={NIVEL_OPTIONS} />
            <Textarea label="Descrição" value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} placeholder="Descrição da classe..." />
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
