'use client'
import { useState, useEffect } from 'react'
import { Printer, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { supabase } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import { TIPO_ATA_LABELS, TIPO_ATO_LABELS } from '@/lib/types'
import type { Ata, Ato } from '@/lib/types'

export default function LivroAtaAtosPage() {
  const [atas, setAtas] = useState<Ata[]>([])
  const [atos, setAtos] = useState<Ato[]>([])
  const [dataInicio, setDataInicio] = useState(`${new Date().getFullYear()}-01-01`)
  const [dataFim, setDataFim] = useState(new Date().toISOString().slice(0, 10))
  const [tipo, setTipo] = useState<'atas' | 'atos' | 'ambos'>('ambos')

  useEffect(() => {
    Promise.all([
      supabase.from('atas').select('*').gte('data', dataInicio).lte('data', dataFim).order('numero'),
      supabase.from('atos').select('*').gte('data', dataInicio).lte('data', dataFim).order('numero'),
    ]).then(([{ data: a }, { data: at }]) => {
      setAtas(a ?? [])
      setAtos(at ?? [])
    })
  }, [dataInicio, dataFim])

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between no-print">
        <h1 className="text-2xl font-bold flex items-center gap-2"><BookOpen size={24} /> Livro Ata e Atos</h1>
        <Button onClick={() => window.print()}><Printer size={16} /> Imprimir</Button>
      </div>

      <div className="no-print flex gap-4 items-end flex-wrap">
        <Input label="De" type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} className="w-40" />
        <Input label="Até" type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} className="w-40" />
        <div className="flex gap-2">
          {(['ambos', 'atas', 'atos'] as const).map(t => (
            <button key={t} onClick={() => setTipo(t)} className={`px-3 py-1.5 rounded-lg text-sm border ${tipo === t ? 'bg-blue-600 text-white border-blue-600' : 'border-[var(--border)] hover:bg-[var(--border)]'}`}>
              {t === 'ambos' ? 'Atas e Atos' : t === 'atas' ? 'Só Atas' : 'Só Atos'}
            </button>
          ))}
        </div>
      </div>

      <div className="print:pt-8">
        <div className="hidden print:block text-center mb-10 border-b-2 border-black pb-4">
          <h1 className="text-2xl font-bold">CLUBE DE DESBRAVADORES THIAGO WHITE</h1>
          <h2 className="text-xl">LIVRO DE ATAS E ATOS</h2>
          <p>Período: {formatDate(dataInicio)} a {formatDate(dataFim)}</p>
        </div>

        {(tipo === 'atas' || tipo === 'ambos') && atas.length > 0 && (
          <div className="space-y-8 mb-10">
            <h2 className="text-xl font-bold border-b pb-2 no-print">Atas ({atas.length})</h2>
            <h2 className="hidden print:block text-xl font-bold border-b-2 border-black pb-2 mb-6">SEÇÃO I — ATAS</h2>
            {atas.map(a => (
              <div key={a.id} className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6 print:border-none print:rounded-none print:page-break-inside-avoid">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold">Ata Nº {a.numero}</h3>
                    <p className="text-sm text-[var(--muted)]">{TIPO_ATA_LABELS[a.tipo]} · {formatDate(a.data)}{a.local ? ` · ${a.local}` : ''}</p>
                  </div>
                  {a.aprovada && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Aprovada</span>}
                </div>
                {a.pauta && <div className="mb-3"><strong>Pauta:</strong> <p className="text-sm mt-1">{a.pauta}</p></div>}
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{a.conteudo}</div>
              </div>
            ))}
          </div>
        )}

        {(tipo === 'atos' || tipo === 'ambos') && atos.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold border-b pb-2 no-print">Atos ({atos.length})</h2>
            <h2 className="hidden print:block text-xl font-bold border-b-2 border-black pb-2 mb-6">SEÇÃO II — ATOS</h2>
            {atos.map(a => (
              <div key={a.id} className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6 print:border-none print:rounded-none print:page-break-inside-avoid">
                <div className="mb-4">
                  <h3 className="text-lg font-bold">{TIPO_ATO_LABELS[a.tipo]} Nº {a.numero}</h3>
                  <p className="text-sm text-[var(--muted)]">{formatDate(a.data)}</p>
                  <p className="font-semibold mt-1">{a.assunto}</p>
                </div>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{a.conteudo}</div>
                {a.assinante && <div className="mt-6 border-t pt-2 text-sm"><strong>Assinante:</strong> {a.assinante}</div>}
              </div>
            ))}
          </div>
        )}

        {atas.length === 0 && atos.length === 0 && (
          <p className="text-[var(--muted)] text-center py-8">Nenhum registro encontrado no período</p>
        )}
      </div>
    </div>
  )
}
