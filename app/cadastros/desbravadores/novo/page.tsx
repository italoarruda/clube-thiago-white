'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { supabase } from '@/lib/supabase/client'
import type { Unidade, Classe } from '@/lib/types'

const CARGO_OPTIONS = [
  { value: 'desbravador', label: 'Desbravador' },
  { value: 'conselheiro', label: 'Conselheiro' },
  { value: 'instrutor', label: 'Instrutor' },
  { value: 'aspirante', label: 'Aspirante' },
  { value: 'diretor', label: 'Diretor' },
]
const SEXO_OPTIONS = [
  { value: 'masculino', label: 'Masculino' },
  { value: 'feminino', label: 'Feminino' },
]

export default function NovoDesbravadorPage() {
  const router = useRouter()
  const [unidades, setUnidades] = useState<Unidade[]>([])
  const [classes, setClasses] = useState<Classe[]>([])
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    nome: '', cpf: '', rg: '', data_nascimento: '', sexo: 'masculino',
    data_ingresso: new Date().toISOString().slice(0, 10),
    unidade_id: '', classe_id: '', cargo: 'desbravador', status: 'ativo',
    responsavel_nome: '', responsavel_cpf: '', responsavel_contato: '', endereco: '', observacoes: '',
  })

  useEffect(() => {
    Promise.all([
      supabase.from('unidades').select('*').order('nome'),
      supabase.from('classes').select('*').order('nivel'),
    ]).then(([{ data: u }, { data: c }]) => {
      setUnidades(u ?? [])
      setClasses(c ?? [])
    })
  }, [])

  async function save() {
    if (!form.nome.trim()) return alert('Nome é obrigatório')
    setSaving(true)
    const payload = {
      ...form,
      cpf: form.cpf || null,
      rg: form.rg || null,
      data_nascimento: form.data_nascimento || null,
      unidade_id: form.unidade_id || null,
      classe_id: form.classe_id || null,
      responsavel_nome: form.responsavel_nome || null,
      responsavel_cpf: form.responsavel_cpf || null,
      responsavel_contato: form.responsavel_contato || null,
      endereco: form.endereco || null,
      observacoes: form.observacoes || null,
    }
    const { error } = await supabase.from('desbravadores').insert(payload)
    setSaving(false)
    if (error) return alert('Erro ao salvar: ' + error.message)
    router.push('/cadastros/desbravadores')
  }

  const f = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }))

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/cadastros/desbravadores"><Button variant="ghost" size="icon"><ArrowLeft size={18} /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold">Novo Desbravador</h1>
          <p className="text-[var(--muted)] text-sm">Preencha os dados do membro</p>
        </div>
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6 space-y-6">
        <div>
          <h2 className="font-semibold mb-4">Dados Pessoais</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><Input label="Nome completo *" value={form.nome} onChange={e => f('nome', e.target.value)} /></div>
            <Input label="CPF" value={form.cpf} onChange={e => f('cpf', e.target.value)} placeholder="000.000.000-00" />
            <Input label="RG" value={form.rg} onChange={e => f('rg', e.target.value)} />
            <Input label="Data de Nascimento" type="date" value={form.data_nascimento} onChange={e => f('data_nascimento', e.target.value)} />
            <Select label="Sexo" value={form.sexo} onValueChange={v => f('sexo', v)} options={SEXO_OPTIONS} />
            <Input label="Data de Ingresso" type="date" value={form.data_ingresso} onChange={e => f('data_ingresso', e.target.value)} />
            <Input label="Endereço" value={form.endereco} onChange={e => f('endereco', e.target.value)} className="col-span-2" />
          </div>
        </div>

        <div>
          <h2 className="font-semibold mb-4">Clube</h2>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Unidade" value={form.unidade_id} onValueChange={v => f('unidade_id', v)} options={[{ value: '', label: 'Sem unidade' }, ...unidades.map(u => ({ value: u.id, label: u.nome }))]} />
            <Select label="Classe" value={form.classe_id} onValueChange={v => f('classe_id', v)} options={[{ value: '', label: 'Sem classe' }, ...classes.map(c => ({ value: c.id, label: c.nome }))]} />
            <Select label="Cargo" value={form.cargo} onValueChange={v => f('cargo', v)} options={CARGO_OPTIONS} />
            <Select label="Status" value={form.status} onValueChange={v => f('status', v)} options={[
              { value: 'ativo', label: 'Ativo' }, { value: 'inativo', label: 'Inativo' },
              { value: 'transferido', label: 'Transferido' }, { value: 'desligado', label: 'Desligado' },
            ]} />
          </div>
        </div>

        <div>
          <h2 className="font-semibold mb-4">Responsável</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><Input label="Nome do responsável" value={form.responsavel_nome} onChange={e => f('responsavel_nome', e.target.value)} /></div>
            <Input label="CPF do responsável" value={form.responsavel_cpf} onChange={e => f('responsavel_cpf', e.target.value)} />
            <Input label="Contato do responsável" value={form.responsavel_contato} onChange={e => f('responsavel_contato', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Link href="/cadastros/desbravadores"><Button variant="outline">Cancelar</Button></Link>
        <Button onClick={save} disabled={saving}>{saving ? 'Salvando...' : 'Cadastrar Desbravador'}</Button>
      </div>
    </div>
  )
}
