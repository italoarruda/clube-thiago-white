'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Trash2, Plus, Check } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Dialog, DialogContent, DialogClose } from '@/components/ui/Dialog'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { supabase } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import { CARGO_LABELS } from '@/lib/types'
import type { Desbravador, Unidade, Classe, Especialidade, DesbravadorEspecialidade } from '@/lib/types'

const CARGO_OPTIONS = ['desbravador','conselheiro','instrutor','aspirante','diretor'].map(v => ({ value: v, label: CARGO_LABELS[v as keyof typeof CARGO_LABELS] }))

export default function DesbravadorPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [dbv, setDbv] = useState<Desbravador | null>(null)
  const [unidades, setUnidades] = useState<Unidade[]>([])
  const [classes, setClasses] = useState<Classe[]>([])
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([])
  const [especialidadesDbv, setEspecialidadesDbv] = useState<DesbravadorEspecialidade[]>([])
  const [saving, setSaving] = useState(false)
  const [openEsp, setOpenEsp] = useState(false)
  const [selectedEsp, setSelectedEsp] = useState('')
  const [form, setForm] = useState<Partial<Desbravador>>({})

  const load = useCallback(async () => {
    const [{ data: d }, { data: u }, { data: c }, { data: e }, { data: de }] = await Promise.all([
      supabase.from('desbravadores').select('*, unidade:unidades(id,nome), classe:classes(id,nome,nivel)').eq('id', id).single(),
      supabase.from('unidades').select('*').order('nome'),
      supabase.from('classes').select('*').order('nivel'),
      supabase.from('especialidades').select('*').eq('ativo', true).order('nome'),
      supabase.from('desbravador_especialidades').select('*, especialidade:especialidades(id,nome,area,nivel)').eq('desbravador_id', id),
    ])
    if (!d) { router.push('/cadastros/desbravadores'); return }
    setDbv(d)
    setForm({ ...d })
    setUnidades(u ?? [])
    setClasses(c ?? [])
    setEspecialidades(e ?? [])
    setEspecialidadesDbv(de ?? [])
  }, [id, router])

  useEffect(() => { load() }, [load])

  const f = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }))

  async function save() {
    if (!form.nome?.trim()) return
    setSaving(true)
    await supabase.from('desbravadores').update({
      nome: form.nome, cpf: form.cpf || null, rg: form.rg || null,
      data_nascimento: form.data_nascimento || null, sexo: form.sexo || null,
      data_ingresso: form.data_ingresso, unidade_id: form.unidade_id || null,
      classe_id: form.classe_id || null, cargo: form.cargo, status: form.status,
      responsavel_nome: form.responsavel_nome || null, responsavel_cpf: form.responsavel_cpf || null,
      responsavel_contato: form.responsavel_contato || null, endereco: form.endereco || null,
      observacoes: form.observacoes || null,
    }).eq('id', id)
    setSaving(false)
    load()
  }

  async function remove() {
    if (!confirm('Excluir este desbravador?')) return
    await supabase.from('desbravadores').delete().eq('id', id)
    router.push('/cadastros/desbravadores')
  }

  async function addEsp() {
    if (!selectedEsp) return
    await supabase.from('desbravador_especialidades').insert({ desbravador_id: id, especialidade_id: selectedEsp })
    setOpenEsp(false)
    load()
  }

  async function concluirEsp(espId: string) {
    const hoje = new Date().toISOString().slice(0, 10)
    await supabase.from('desbravador_especialidades').update({ status: 'concluida', data_conclusao: hoje }).eq('id', espId)
    load()
  }

  async function removeEsp(espId: string) {
    await supabase.from('desbravador_especialidades').delete().eq('id', espId)
    load()
  }

  if (!dbv) return <p className="text-[var(--muted)]">Carregando...</p>

  const jaVinculadas = new Set(especialidadesDbv.map(e => e.especialidade_id))
  const disponíveis = especialidades.filter(e => !jaVinculadas.has(e.id))

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/cadastros/desbravadores"><Button variant="ghost" size="icon"><ArrowLeft size={18} /></Button></Link>
          <h1 className="text-2xl font-bold">{dbv.nome}</h1>
        </div>
        <Button variant="danger" size="sm" onClick={remove}><Trash2 size={15} /> Excluir</Button>
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6 space-y-4">
        <h2 className="font-semibold">Dados Pessoais</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><Input label="Nome completo" value={form.nome ?? ''} onChange={e => f('nome', e.target.value)} /></div>
          <Input label="CPF" value={form.cpf ?? ''} onChange={e => f('cpf', e.target.value)} />
          <Input label="RG" value={form.rg ?? ''} onChange={e => f('rg', e.target.value)} />
          <Input label="Data de Nascimento" type="date" value={form.data_nascimento ?? ''} onChange={e => f('data_nascimento', e.target.value)} />
          <Select label="Sexo" value={form.sexo ?? 'masculino'} onValueChange={v => f('sexo', v)} options={[{ value: 'masculino', label: 'Masculino' }, { value: 'feminino', label: 'Feminino' }]} />
          <Input label="Data de Ingresso" type="date" value={form.data_ingresso ?? ''} onChange={e => f('data_ingresso', e.target.value)} />
        </div>

        <h2 className="font-semibold pt-2">Clube</h2>
        <div className="grid grid-cols-2 gap-4">
          <Select label="Unidade" value={form.unidade_id ?? ''} onValueChange={v => f('unidade_id', v)} options={[{ value: '', label: 'Sem unidade' }, ...unidades.map(u => ({ value: u.id, label: u.nome }))]} />
          <Select label="Classe" value={form.classe_id ?? ''} onValueChange={v => f('classe_id', v)} options={[{ value: '', label: 'Sem classe' }, ...classes.map(c => ({ value: c.id, label: c.nome }))]} />
          <Select label="Cargo" value={form.cargo ?? 'desbravador'} onValueChange={v => f('cargo', v)} options={CARGO_OPTIONS} />
          <Select label="Status" value={form.status ?? 'ativo'} onValueChange={v => f('status', v)} options={[
            { value: 'ativo', label: 'Ativo' }, { value: 'inativo', label: 'Inativo' },
            { value: 'transferido', label: 'Transferido' }, { value: 'desligado', label: 'Desligado' },
          ]} />
        </div>

        <h2 className="font-semibold pt-2">Responsável</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><Input label="Nome" value={form.responsavel_nome ?? ''} onChange={e => f('responsavel_nome', e.target.value)} /></div>
          <Input label="CPF" value={form.responsavel_cpf ?? ''} onChange={e => f('responsavel_cpf', e.target.value)} />
          <Input label="Contato" value={form.responsavel_contato ?? ''} onChange={e => f('responsavel_contato', e.target.value)} />
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={save} disabled={saving}>{saving ? 'Salvando...' : 'Salvar Alterações'}</Button>
        </div>
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Especialidades</h2>
          <Button size="sm" onClick={() => setOpenEsp(true)}><Plus size={15} /> Vincular</Button>
        </div>
        <Table>
          <Thead><Tr><Th>Especialidade</Th><Th>Área</Th><Th>Status</Th><Th>Conclusão</Th><Th className="w-24">Ações</Th></Tr></Thead>
          <Tbody>
            {especialidadesDbv.map(de => (
              <Tr key={de.id}>
                <Td className="font-medium">{(de as DesbravadorEspecialidade & { especialidade?: Especialidade }).especialidade?.nome}</Td>
                <Td>{(de as DesbravadorEspecialidade & { especialidade?: Especialidade }).especialidade?.area}</Td>
                <Td><Badge variant={de.status === 'concluida' ? 'green' : 'yellow'}>{de.status === 'concluida' ? 'Concluída' : 'Em andamento'}</Badge></Td>
                <Td>{formatDate(de.data_conclusao)}</Td>
                <Td>
                  <div className="flex gap-1">
                    {de.status !== 'concluida' && <Button size="icon" variant="ghost" title="Concluir" onClick={() => concluirEsp(de.id)}><Check size={15} className="text-green-500" /></Button>}
                    <Button size="icon" variant="ghost" onClick={() => removeEsp(de.id)}><Trash2 size={15} className="text-red-500" /></Button>
                  </div>
                </Td>
              </Tr>
            ))}
            {especialidadesDbv.length === 0 && <Tr><Td colSpan={5} className="text-center text-[var(--muted)] py-4">Nenhuma especialidade vinculada</Td></Tr>}
          </Tbody>
        </Table>
      </div>

      <Dialog open={openEsp} onOpenChange={setOpenEsp}>
        <DialogContent title="Vincular Especialidade">
          <div className="space-y-4">
            <Select label="Especialidade" value={selectedEsp} onValueChange={setSelectedEsp} options={[{ value: '', label: 'Selecione...' }, ...disponíveis.map(e => ({ value: e.id, label: `${e.nome} (${e.area})` }))]} />
            <div className="flex justify-end gap-2">
              <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
              <Button onClick={addEsp}>Vincular</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
