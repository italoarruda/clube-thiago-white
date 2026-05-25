'use client'
import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Dialog, DialogContent, DialogClose } from '@/components/ui/Dialog'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { supabase } from '@/lib/supabase/client'
import type { Especialidade } from '@/lib/types'

const NIVEL_OPTIONS = [
  { value: '1', label: 'Nível 1' },
  { value: '2', label: 'Nível 2' },
  { value: '3', label: 'Nível 3' },
]

const AREAS = ['Artesanato', 'Agricultura', 'Ciências', 'Recreação', 'Natureza', 'Serviço', 'Saúde', 'Mecânica', 'Outro']
const AREA_OPTIONS = AREAS.map(a => ({ value: a, label: a }))

export default function EspecialidadesPage() {
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Especialidade | null>(null)
  const [busca, setBusca] = useState('')
  const [form, setForm] = useState({ nome: '', area: 'Artesanato', nivel: '1', descricao: '', ativo: true })

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('especialidades').select('*').order('nome')
    setEspecialidades(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = especialidades.filter(e =>
    e.nome.toLowerCase().includes(busca.toLowerCase()) ||
    e.area.toLowerCase().includes(busca.toLowerCase()),
  )

  function openCreate() {
    setEditing(null)
    setForm({ nome: '', area: 'Artesanato', nivel: '1', descricao: '', ativo: true })
    setOpen(true)
  }

  function openEdit(e: Especialidade) {
    setEditing(e)
    setForm({ nome: e.nome, area: e.area, nivel: String(e.nivel), descricao: e.descricao ?? '', ativo: e.ativo })
    setOpen(true)
  }

  async function save() {
    if (!form.nome.trim()) return
    const payload = { nome: form.nome, area: form.area, nivel: Number(form.nivel), descricao: form.descricao || null, ativo: form.ativo }
    if (editing) {
      await supabase.from('especialidades').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('especialidades').insert(payload)
    }
    setOpen(false)
    load()
  }

  async function remove(id: string) {
    if (!confirm('Excluir esta especialidade?')) return
    await supabase.from('especialidades').delete().eq('id', id)
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Star size={24} /> Especialidades</h1>
          <p className="text-[var(--muted)] text-sm mt-1">{especialidades.length} especialidades cadastradas</p>
        </div>
        <Button onClick={openCreate}><Plus size={16} /> Nova Especialidade</Button>
      </div>

      <Input placeholder="Buscar por nome ou área..." value={busca} onChange={e => setBusca(e.target.value)} />

      {loading ? (
        <p className="text-[var(--muted)]">Carregando...</p>
      ) : (
        <Table>
          <Thead><Tr><Th>Nome</Th><Th>Área</Th><Th>Nível</Th><Th>Status</Th><Th className="w-24">Ações</Th></Tr></Thead>
          <Tbody>
            {filtered.map(e => (
              <Tr key={e.id}>
                <Td className="font-medium">{e.nome}</Td>
                <Td>{e.area}</Td>
                <Td><Badge variant="blue">Nível {e.nivel}</Badge></Td>
                <Td><Badge variant={e.ativo ? 'green' : 'default'}>{e.ativo ? 'Ativa' : 'Inativa'}</Badge></Td>
                <Td>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(e)}><Pencil size={15} /></Button>
                    <Button size="icon" variant="ghost" onClick={() => remove(e.id)}><Trash2 size={15} className="text-red-500" /></Button>
                  </div>
                </Td>
              </Tr>
            ))}
            {filtered.length === 0 && <Tr><Td colSpan={5} className="text-center text-[var(--muted)] py-8">Nenhuma especialidade encontrada</Td></Tr>}
          </Tbody>
        </Table>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent title={editing ? 'Editar Especialidade' : 'Nova Especialidade'}>
          <div className="space-y-4">
            <Input label="Nome *" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Ex: Culinária" />
            <Select label="Área" value={form.area} onValueChange={v => setForm(f => ({ ...f, area: v }))} options={AREA_OPTIONS} />
            <Select label="Nível" value={form.nivel} onValueChange={v => setForm(f => ({ ...f, nivel: v }))} options={NIVEL_OPTIONS} />
            <Textarea label="Descrição" value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} placeholder="Descrição da especialidade..." />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.ativo} onChange={e => setForm(f => ({ ...f, ativo: e.target.checked }))} className="rounded" />
              Especialidade ativa
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
