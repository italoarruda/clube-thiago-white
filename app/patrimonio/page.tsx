'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Package, Eye } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Dialog, DialogContent, DialogClose } from '@/components/ui/Dialog'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { EstadoPatrimonioBadge } from '@/components/ui/Badge'
import { supabase } from '@/lib/supabase/client'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Patrimonio, EstadoPatrimonio } from '@/lib/types'

const ESTADO_OPTIONS = [
  { value: 'otimo', label: 'Ótimo' },
  { value: 'bom', label: 'Bom' },
  { value: 'regular', label: 'Regular' },
  { value: 'ruim', label: 'Ruim' },
  { value: 'baixado', label: 'Baixado' },
]

const EMPTY = { nome: '', descricao: '', numero_tombamento: '', valor_aquisicao: '', data_aquisicao: '', estado: 'bom', localizacao: '', observacoes: '' }

export default function PatrimonioPage() {
  const [itens, setItens] = useState<Patrimonio[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('patrimonio').select('*').order('nome')
    setItens(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const total = itens.filter(i => i.estado !== 'baixado').reduce((s, i) => s + (i.valor_aquisicao ?? 0), 0)

  async function save() {
    if (!form.nome.trim()) return
    await supabase.from('patrimonio').insert({
      nome: form.nome, descricao: form.descricao || null,
      numero_tombamento: form.numero_tombamento || null,
      valor_aquisicao: form.valor_aquisicao ? Number(form.valor_aquisicao) : null,
      data_aquisicao: form.data_aquisicao || null,
      estado: form.estado as EstadoPatrimonio,
      localizacao: form.localizacao || null,
      observacoes: form.observacoes || null,
    })
    setOpen(false)
    setForm(EMPTY)
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Package size={24} /> Patrimônio</h1>
          <p className="text-[var(--muted)] text-sm mt-1">{itens.filter(i => i.estado !== 'baixado').length} bens · Valor total: {formatCurrency(total)}</p>
        </div>
        <Button onClick={() => { setForm(EMPTY); setOpen(true) }}><Plus size={16} /> Novo Bem</Button>
      </div>

      {loading ? (
        <p className="text-[var(--muted)]">Carregando...</p>
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Tombamento</Th><Th>Nome</Th><Th>Localização</Th><Th>Estado</Th>
              <Th>Aquisição</Th><Th className="text-right">Valor</Th><Th className="w-16"></Th>
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
                <Td>
                  <Link href={`/patrimonio/${i.id}`}>
                    <Button size="icon" variant="ghost"><Eye size={15} /></Button>
                  </Link>
                </Td>
              </Tr>
            ))}
            {itens.length === 0 && <Tr><Td colSpan={7} className="text-center text-[var(--muted)] py-8">Nenhum bem cadastrado</Td></Tr>}
          </Tbody>
        </Table>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent title="Novo Bem">
          <div className="space-y-4">
            <Input label="Nome *" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Ex: Projetor" />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Nº Tombamento" value={form.numero_tombamento} onChange={e => setForm(f => ({ ...f, numero_tombamento: e.target.value }))} />
              <Select label="Estado" value={form.estado} onValueChange={v => setForm(f => ({ ...f, estado: v }))} options={ESTADO_OPTIONS} />
              <Input label="Valor de Aquisição (R$)" type="number" min="0" step="0.01" value={form.valor_aquisicao} onChange={e => setForm(f => ({ ...f, valor_aquisicao: e.target.value }))} />
              <Input label="Data de Aquisição" type="date" value={form.data_aquisicao} onChange={e => setForm(f => ({ ...f, data_aquisicao: e.target.value }))} />
            </div>
            <Input label="Localização" value={form.localizacao} onChange={e => setForm(f => ({ ...f, localizacao: e.target.value }))} />
            <Input label="Descrição" value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} />
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
