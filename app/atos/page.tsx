'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Gavel, Eye } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { supabase } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import { TIPO_ATO_LABELS } from '@/lib/types'
import type { Ato } from '@/lib/types'

export default function AtosPage() {
  const [atos, setAtos] = useState<Ato[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('atos').select('*').order('numero', { ascending: false })
    setAtos(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Gavel size={24} /> Atos</h1>
          <p className="text-[var(--muted)] text-sm mt-1">{atos.length} atos registrados</p>
        </div>
        <Link href="/atos/novo">
          <Button><Plus size={16} /> Novo Ato</Button>
        </Link>
      </div>

      {loading ? (
        <p className="text-[var(--muted)]">Carregando...</p>
      ) : (
        <Table>
          <Thead>
            <Tr><Th>Nº</Th><Th>Data</Th><Th>Tipo</Th><Th>Assunto</Th><Th>Assinante</Th><Th className="w-16"></Th></Tr>
          </Thead>
          <Tbody>
            {atos.map(a => (
              <Tr key={a.id}>
                <Td className="font-bold">#{a.numero}</Td>
                <Td>{formatDate(a.data)}</Td>
                <Td><Badge variant="blue">{TIPO_ATO_LABELS[a.tipo]}</Badge></Td>
                <Td className="font-medium">{a.assunto}</Td>
                <Td>{a.assinante ?? '—'}</Td>
                <Td>
                  <Link href={`/atos/${a.id}`}>
                    <Button size="icon" variant="ghost"><Eye size={15} /></Button>
                  </Link>
                </Td>
              </Tr>
            ))}
            {atos.length === 0 && <Tr><Td colSpan={6} className="text-center text-[var(--muted)] py-8">Nenhum ato registrado</Td></Tr>}
          </Tbody>
        </Table>
      )}
    </div>
  )
}
