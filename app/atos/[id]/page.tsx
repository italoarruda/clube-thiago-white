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
import { TIPO_ATO_LABELS } from '@/lib/types'
import type { Ato, TipoAto } from '@/lib/types'

const TIPO_OPTIONS = [
  { value: 'resolucao', label: 'Resolução' },
  { value: 'portaria', label: 'Portaria' },
  { value: 'circular', label: 'Circular' },
  { value: 'oficio', label: 'Ofício' },
]

export default function AtoPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [ato, setAto] = useState<Ato | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<Partial<Ato>>({})

  const load = useCallback(async () => {
    const { data } = await supabase.from('atos').select('*').eq('id', id).single()
    if (!data) { router.push('/atos'); return }
    setAto(data)
    setForm(data)
  }, [id, router])

  useEffect(() => { load() }, [load])

  async function save() {
    setSaving(true)
    await supabase.from('atos').update({
      data: form.data, tipo: form.tipo as TipoAto,
      assunto: form.assunto, conteudo: form.conteudo || null,
      assinante: form.assinante || null,
    }).eq('id', id)
    setSaving(false)
    load()
  }

  async function remove() {
    if (!confirm('Excluir este ato?')) return
    await supabase.from('atos').delete().eq('id', id)
    router.push('/atos')
  }

  if (!ato) return <p className="text-[var(--muted)]">Carregando...</p>

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/atos"><Button variant="ghost" size="icon"><ArrowLeft size={18} /></Button></Link>
          <div>
            <h1 className="text-2xl font-bold">Ato #{ato.numero}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="blue">{TIPO_ATO_LABELS[ato.tipo]}</Badge>
              <span className="text-sm text-[var(--muted)]">{formatDate(ato.data)}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.print()}><Printer size={15} /> Imprimir</Button>
          <Button variant="danger" size="sm" onClick={remove}><Trash2 size={15} /></Button>
        </div>
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Data" type="date" value={form.data ?? ''} onChange={e => setForm(f => ({ ...f, data: e.target.value }))} />
          <Select label="Tipo" value={form.tipo ?? 'resolucao'} onValueChange={v => setForm(f => ({ ...f, tipo: v as TipoAto }))} options={TIPO_OPTIONS} />
          <div className="col-span-2"><Input label="Assunto" value={form.assunto ?? ''} onChange={e => setForm(f => ({ ...f, assunto: e.target.value }))} /></div>
          <div className="col-span-2"><Input label="Assinante" value={form.assinante ?? ''} onChange={e => setForm(f => ({ ...f, assinante: e.target.value }))} /></div>
        </div>
        <Textarea label="Conteúdo" value={form.conteudo ?? ''} onChange={e => setForm(f => ({ ...f, conteudo: e.target.value }))} className="min-h-48" />
        <div className="flex justify-end">
          <Button onClick={save} disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</Button>
        </div>
      </div>

      <div className="hidden print:block p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">CLUBE DE DESBRAVADORES THIAGO WHITE</h1>
          <h2 className="text-xl mt-2">{TIPO_ATO_LABELS[ato.tipo].toUpperCase()} Nº {ato.numero}</h2>
          <p className="mt-1">{formatDate(ato.data)}</p>
          <p className="font-semibold mt-2">{ato.assunto}</p>
        </div>
        <div className="whitespace-pre-wrap leading-relaxed">{ato.conteudo}</div>
        {ato.assinante && (
          <div className="mt-12 text-center">
            <div className="border-t border-black w-48 mx-auto pt-2">{ato.assinante}</div>
          </div>
        )}
      </div>
    </div>
  )
}
