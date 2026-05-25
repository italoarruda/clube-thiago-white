'use client'
import { useState, useEffect } from 'react'
import { Printer, Shield } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { supabase } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import type { Desbravador } from '@/lib/types'

export default function AutorizacaoSaidaPage() {
  const [desbravadores, setDesbravadores] = useState<Desbravador[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [destino, setDestino] = useState('')
  const [dataEvento, setDataEvento] = useState(new Date().toISOString().slice(0, 10))
  const [horaSaida, setHoraSaida] = useState('')
  const [horaRetorno, setHoraRetorno] = useState('')
  const [responsavel, setResponsavel] = useState('')
  const [obs, setObs] = useState('')

  useEffect(() => {
    supabase.from('desbravadores').select('*, unidade:unidades(id,nome), classe:classes(id,nome)').eq('status', 'ativo').order('nome')
      .then(({ data }) => setDesbravadores(data ?? []))
  }, [])

  const dbv = desbravadores.find(d => d.id === selectedId)
  const dbvOptions = [
    { value: '', label: 'Selecione o desbravador...' },
    ...desbravadores.map(d => ({ value: d.id, label: d.nome })),
  ]

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between no-print">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Shield size={24} /> Autorização de Saída</h1>
          <p className="text-[var(--muted)] text-sm mt-1">Gere o formulário de autorização</p>
        </div>
        <Button onClick={() => window.print()} disabled={!selectedId || !destino}>
          <Printer size={16} /> Imprimir
        </Button>
      </div>

      <div className="no-print bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5 space-y-4">
        <h2 className="font-semibold">Dados do formulário</h2>
        <Select label="Desbravador" value={selectedId} onValueChange={setSelectedId} options={dbvOptions} />
        <Input label="Destino / Evento *" value={destino} onChange={e => setDestino(e.target.value)} placeholder="Ex: Acampamento Regional" />
        <div className="grid grid-cols-3 gap-3">
          <Input label="Data do Evento" type="date" value={dataEvento} onChange={e => setDataEvento(e.target.value)} />
          <Input label="Hora de Saída" type="time" value={horaSaida} onChange={e => setHoraSaida(e.target.value)} />
          <Input label="Hora de Retorno" type="time" value={horaRetorno} onChange={e => setHoraRetorno(e.target.value)} />
        </div>
        <Input label="Responsável (se diferente)" value={responsavel} onChange={e => setResponsavel(e.target.value)} placeholder="Nome do responsável" />
        <Input label="Observações" value={obs} onChange={e => setObs(e.target.value)} />
      </div>

      {/* Área de impressão */}
      <div className="hidden print:block">
        <div className="border-2 border-black p-8 min-h-[700px] font-serif">
          <div className="text-center mb-6 border-b-2 border-black pb-4">
            <h1 className="text-2xl font-bold uppercase">Clube de Desbravadores Thiago White</h1>
            <h2 className="text-lg font-semibold mt-1">AUTORIZAÇÃO DE SAÍDA</h2>
          </div>

          <p className="mb-6 text-base">
            Eu, <span className="font-bold underline">{responsavel || (dbv?.responsavel_nome ?? '___________________________________')}</span>,
            responsável pelo(a) desbravador(a) <span className="font-bold">{dbv?.nome ?? '___________________________'}</span>,
            autorizo sua participação no evento/atividade abaixo descrito.
          </p>

          <div className="space-y-3 mb-6">
            <div className="flex gap-2"><strong>Destino / Evento:</strong> <span>{destino || '___________________________________'}</span></div>
            <div className="flex gap-2"><strong>Data:</strong> <span>{dataEvento ? formatDate(dataEvento) : '_______________'}</span></div>
            <div className="flex gap-4">
              <div className="flex gap-2"><strong>Saída:</strong> <span>{horaSaida || '___:___'}</span></div>
              <div className="flex gap-2"><strong>Retorno:</strong> <span>{horaRetorno || '___:___'}</span></div>
            </div>
            {dbv && (
              <>
                <div className="flex gap-2"><strong>Unidade:</strong> <span>{(dbv as Desbravador & { unidade?: { nome: string } }).unidade?.nome ?? '—'}</span></div>
                <div className="flex gap-2"><strong>Classe:</strong> <span>{(dbv as Desbravador & { classe?: { nome: string } }).classe?.nome ?? '—'}</span></div>
                <div className="flex gap-2"><strong>Contato do responsável:</strong> <span>{dbv.responsavel_contato ?? '—'}</span></div>
              </>
            )}
            {obs && <div className="flex gap-2"><strong>Observações:</strong> <span>{obs}</span></div>}
          </div>

          <div className="mt-16 grid grid-cols-2 gap-8">
            <div className="text-center">
              <div className="border-t border-black pt-2 mt-8">Assinatura do Responsável</div>
            </div>
            <div className="text-center">
              <div className="border-t border-black pt-2 mt-8">Assinatura do Diretor do Clube</div>
            </div>
          </div>

          <p className="mt-8 text-xs text-center">Documento gerado pelo Sistema Clube Thiago White em {new Date().toLocaleDateString('pt-BR')}</p>
        </div>
      </div>
    </div>
  )
}
