'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { supabase } from '@/lib/supabase/client'
import type { TipoAta } from '@/lib/types'

const TIPO_OPTIONS = [
  { value: 'diretoria', label: 'Reunião de Diretoria' },
  { value: 'clube', label: 'Reunião de Clube' },
  { value: 'pais', label: 'Reunião de Pais' },
  { value: 'extraordinaria', label: 'Reunião Extraordinária' },
]

export default function NovaAtaPage() {
  const router = useRouter()
  const [numero, setNumero] = useState(1)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ data: new Date().toISOString().slice(0, 10), tipo: 'clube', local: '', pauta: '', conteudo: '' })

  useEffect(() => {
    supabase.from('atas').select('numero').order('numero', { ascending: false }).limit(1).single()
      .then(({ data }) => setNumero((data?.numero ?? 0) + 1))
  }, [])

  async function save() {
    if (!form.conteudo.trim()) return alert('Conteúdo da ata é obrigatório')
    setSaving(true)
    const { error } = await supabase.from('atas').insert({
      numero, data: form.data, tipo: form.tipo as TipoAta,
      local: form.local || null, pauta: form.pauta || null,
      conteudo: form.conteudo, aprovada: false,
    })
    setSaving(false)
    if (error) return alert('Erro: ' + error.message)
    router.push('/atas')
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/atas"><Button variant="ghost" size="icon"><ArrowLeft size={18} /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold">Nova Ata #{numero}</h1>
          <p className="text-[var(--muted)] text-sm">Registre a reunião</p>
        </div>
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Data *" type="date" value={form.data} onChange={e => setForm(f => ({ ...f, data: e.target.value }))} />
          <Select label="Tipo *" value={form.tipo} onValueChange={v => setForm(f => ({ ...f, tipo: v }))} options={TIPO_OPTIONS} />
          <div className="col-span-2">
            <Input label="Local" value={form.local} onChange={e => setForm(f => ({ ...f, local: e.target.value }))} placeholder="Ex: Sede do clube" />
          </div>
        </div>
        <Textarea label="Pauta" value={form.pauta} onChange={e => setForm(f => ({ ...f, pauta: e.target.value }))} placeholder="Itens da pauta..." />
        <Textarea label="Conteúdo da Ata *" value={form.conteudo} onChange={e => setForm(f => ({ ...f, conteudo: e.target.value }))} placeholder="Registre aqui o conteúdo completo da reunião..." className="min-h-48" />
      </div>

      <div className="flex justify-end gap-3">
        <Link href="/atas"><Button variant="outline">Cancelar</Button></Link>
        <Button onClick={save} disabled={saving}>{saving ? 'Salvando...' : 'Registrar Ata'}</Button>
      </div>
    </div>
  )
}
