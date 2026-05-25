'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Trash2, Printer } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { supabase } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import { TIPO_ATA_LABELS } from '@/lib/types'
import type { Ata, TipoAta } from '@/lib/types'

const TIPO_OPTIONS = [
  { value: 'diretoria', label: 'Reunião de Diretoria' },
  { value: 'clube', label: 'Reunião de Clube' },
  { value: 'pais', label: 'Reunião de Pais' },
  { value: 'extraordinaria', label: 'Reunião Extraordinária' },
]

export default function AtaPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [ata, setAta] = useState<Ata | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<Partial<Ata>>({})

  const load = useCallback(async () => {
    const { data } = await supabase.from('atas').select('*').eq('id', id).single()
    if (!data) { router.push('/atas'); return }
    setAta(data)
    setForm(data)
  }, [id, router])

  useEffect(() => { load() }, [load])

  async function save() {
    setSaving(true)
    await supabase.from('atas').update({
      data: form.data, tipo: form.tipo as TipoAta,
      local: form.local || null, pauta: form.pauta || null,
      conteudo: form.conteudo || null,
    }).eq('id', id)
    setSaving(false)
    load()
  }

  async function aprovar() {
    await supabase.from('atas').update({ aprovada: true, data_aprovacao: new Date().toISOString().slice(0, 10) }).eq('id', id)
    load()
  }

  async function remove() {
    if (!confirm('Excluir esta ata?')) return
    await supabase.from('atas').delete().eq('id', id)
    router.push('/atas')
  }

  if (!ata) return <p className="text-[var(--muted)]">Carregando...</p>

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/atas"><Button variant="ghost" size="icon"><ArrowLeft size={18} /></Button></Link>
          <div>
            <h1 className="text-2xl font-bold">Ata #{ata.numero}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-[var(--muted)]">{formatDate(ata.data)} · {TIPO_ATA_LABELS[ata.tipo]}</span>
              <Badge variant={ata.aprovada ? 'green' : 'yellow'}>{ata.aprovada ? 'Aprovada' : 'Pendente'}</Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.print()}><Printer size={15} /> Imprimir</Button>
          {!ata.aprovada && <Button variant="secondary" size="sm" onClick={aprovar}>Aprovar</Button>}
          <Button variant="danger" size="sm" onClick={remove}><Trash2 size={15} /></Button>
        </div>
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Data" type="date" value={form.data ?? ''} onChange={e => setForm(f => ({ ...f, data: e.target.value }))} />
          <Select label="Tipo" value={form.tipo ?? 'clube'} onValueChange={v => setForm(f => ({ ...f, tipo: v as TipoAta }))} options={TIPO_OPTIONS} />
          <div className="col-span-2"><Input label="Local" value={form.local ?? ''} onChange={e => setForm(f => ({ ...f, local: e.target.value }))} /></div>
        </div>
        <Textarea label="Pauta" value={form.pauta ?? ''} onChange={e => setForm(f => ({ ...f, pauta: e.target.value }))} />
        <Textarea label="Conteúdo" value={form.conteudo ?? ''} onChange={e => setForm(f => ({ ...f, conteudo: e.target.value }))} className="min-h-48" />
        <div className="flex justify-end">
          <Button onClick={save} disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</Button>
        </div>
      </div>

      {/* Print area */}
      <div className="hidden print:block p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">CLUBE DE DESBRAVADORES THIAGO WHITE</h1>
          <h2 className="text-xl mt-2">ATA {TIPO_ATA_LABELS[ata.tipo].toUpperCase()} Nº {ata.numero}</h2>
          <p className="mt-1">Data: {formatDate(ata.data)} · Local: {ata.local ?? '—'}</p>
        </div>
        {ata.pauta && <div className="mb-6"><strong>Pauta:</strong><p>{ata.pauta}</p></div>}
        <div className="whitespace-pre-wrap leading-relaxed">{ata.conteudo}</div>
        {ata.aprovada && <p className="mt-8 text-sm">Aprovada em {formatDate(ata.data_aprovacao)}</p>}
      </div>
    </div>
  )
}
