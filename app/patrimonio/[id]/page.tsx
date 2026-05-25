'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
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

export default function PatrimonioItemPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [item, setItem] = useState<Patrimonio | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<Partial<Patrimonio>>({})

  const load = useCallback(async () => {
    const { data } = await supabase.from('patrimonio').select('*').eq('id', id).single()
    if (!data) { router.push('/patrimonio'); return }
    setItem(data)
    setForm(data)
  }, [id, router])

  useEffect(() => { load() }, [load])

  async function save() {
    setSaving(true)
    await supabase.from('patrimonio').update({
      nome: form.nome, descricao: form.descricao || null,
      numero_tombamento: form.numero_tombamento || null,
      valor_aquisicao: form.valor_aquisicao ?? null,
      data_aquisicao: form.data_aquisicao || null,
      estado: form.estado, localizacao: form.localizacao || null,
      observacoes: form.observacoes || null,
    }).eq('id', id)
    setSaving(false)
    load()
  }

  async function remove() {
    if (!confirm('Excluir este bem?')) return
    await supabase.from('patrimonio').delete().eq('id', id)
    router.push('/patrimonio')
  }

  if (!item) return <p className="text-[var(--muted)]">Carregando...</p>

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/patrimonio"><Button variant="ghost" size="icon"><ArrowLeft size={18} /></Button></Link>
          <div>
            <h1 className="text-2xl font-bold">{item.nome}</h1>
            <EstadoPatrimonioBadge estado={item.estado} />
          </div>
        </div>
        <Button variant="danger" size="sm" onClick={remove}><Trash2 size={15} /> Excluir</Button>
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><Input label="Nome" value={form.nome ?? ''} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} /></div>
          <Input label="Nº Tombamento" value={form.numero_tombamento ?? ''} onChange={e => setForm(f => ({ ...f, numero_tombamento: e.target.value }))} />
          <Select label="Estado" value={form.estado ?? 'bom'} onValueChange={v => setForm(f => ({ ...f, estado: v as EstadoPatrimonio }))} options={ESTADO_OPTIONS} />
          <Input label="Valor de Aquisição (R$)" type="number" min="0" step="0.01" value={form.valor_aquisicao ?? ''} onChange={e => setForm(f => ({ ...f, valor_aquisicao: Number(e.target.value) }))} />
          <Input label="Data de Aquisição" type="date" value={form.data_aquisicao ?? ''} onChange={e => setForm(f => ({ ...f, data_aquisicao: e.target.value }))} />
          <div className="col-span-2"><Input label="Localização" value={form.localizacao ?? ''} onChange={e => setForm(f => ({ ...f, localizacao: e.target.value }))} /></div>
          <div className="col-span-2"><Input label="Descrição" value={form.descricao ?? ''} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} /></div>
          <div className="col-span-2"><Input label="Observações" value={form.observacoes ?? ''} onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))} /></div>
        </div>
        <div className="flex justify-end pt-2">
          <Button onClick={save} disabled={saving}>{saving ? 'Salvando...' : 'Salvar Alterações'}</Button>
        </div>
      </div>
    </div>
  )
}
