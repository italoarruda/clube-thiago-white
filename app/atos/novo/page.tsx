'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { supabase } from '@/lib/supabase/client'
import type { TipoAto } from '@/lib/types'

const TIPO_OPTIONS = [
  { value: 'resolucao', label: 'Resolução' },
  { value: 'portaria', label: 'Portaria' },
  { value: 'circular', label: 'Circular' },
  { value: 'oficio', label: 'Ofício' },
]

export default function NovoAtoPage() {
  const router = useRouter()
  const [numero, setNumero] = useState(1)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ data: new Date().toISOString().slice(0, 10), tipo: 'resolucao', assunto: '', conteudo: '', assinante: '' })

  useEffect(() => {
    supabase.from('atos').select('numero').order('numero', { ascending: false }).limit(1).single()
      .then(({ data }) => setNumero((data?.numero ?? 0) + 1))
  }, [])

  async function save() {
    if (!form.assunto.trim()) return alert('Assunto é obrigatório')
    setSaving(true)
    const { error } = await supabase.from('atos').insert({
      numero, data: form.data, tipo: form.tipo as TipoAto,
      assunto: form.assunto, conteudo: form.conteudo || null,
      assinante: form.assinante || null,
    })
    setSaving(false)
    if (error) return alert('Erro: ' + error.message)
    router.push('/atos')
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/atos"><Button variant="ghost" size="icon"><ArrowLeft size={18} /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold">Novo Ato #{numero}</h1>
          <p className="text-[var(--muted)] text-sm">Registre o ato oficial</p>
        </div>
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Data *" type="date" value={form.data} onChange={e => setForm(f => ({ ...f, data: e.target.value }))} />
          <Select label="Tipo *" value={form.tipo} onValueChange={v => setForm(f => ({ ...f, tipo: v }))} options={TIPO_OPTIONS} />
          <div className="col-span-2"><Input label="Assunto *" value={form.assunto} onChange={e => setForm(f => ({ ...f, assunto: e.target.value }))} placeholder="Descreva o assunto do ato" /></div>
          <div className="col-span-2"><Input label="Assinante" value={form.assinante} onChange={e => setForm(f => ({ ...f, assinante: e.target.value }))} placeholder="Nome do diretor ou responsável" /></div>
        </div>
        <Textarea label="Conteúdo" value={form.conteudo} onChange={e => setForm(f => ({ ...f, conteudo: e.target.value }))} placeholder="Texto completo do ato..." className="min-h-48" />
      </div>

      <div className="flex justify-end gap-3">
        <Link href="/atos"><Button variant="outline">Cancelar</Button></Link>
        <Button onClick={save} disabled={saving}>{saving ? 'Salvando...' : 'Registrar Ato'}</Button>
      </div>
    </div>
  )
}
