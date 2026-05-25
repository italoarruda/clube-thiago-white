'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Plus, FileText, Eye } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { supabase } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import { TIPO_ATA_LABELS } from '@/lib/types'
import type { Ata } from '@/lib/types'

export default function AtasPage() {
  const [atas, setAtas] = useState<Ata[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('atas').select('*').order('numero', { ascending: false })
    setAtas(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><FileText size={24} /> Atas</h1>
          <p className="text-[var(--muted)] text-sm mt-1">{atas.length} atas registradas</p>
        </div>
        <Link href="/atas/nova">
          <Button><Plus size={16} /> Nova Ata</Button>
        </Link>
      </div>

      {loading ? (
        <p className="text-[var(--muted)]">Carregando...</p>
      ) : (
        <Table>
          <Thead>
            <Tr><Th>Nº</Th><Th>Data</Th><Th>Tipo</Th><Th>Local</Th><Th>Aprovada</Th><Th className="w-16"></Th></Tr>
          </Thead>
          <Tbody>
            {atas.map(a => (
              <Tr key={a.id}>
                <Td className="font-bold">#{a.numero}</Td>
                <Td>{formatDate(a.data)}</Td>
                <Td>{TIPO_ATA_LABELS[a.tipo]}</Td>
                <Td>{a.local ?? '—'}</Td>
                <Td>
                  <Badge variant={a.aprovada ? 'green' : 'yellow'}>{a.aprovada ? 'Aprovada' : 'Pendente'}</Badge>
                </Td>
                <Td>
                  <Link href={`/atas/${a.id}`}>
                    <Button size="icon" variant="ghost"><Eye size={15} /></Button>
                  </Link>
                </Td>
              </Tr>
            ))}
            {atas.length === 0 && <Tr><Td colSpan={6} className="text-center text-[var(--muted)] py-8">Nenhuma ata registrada</Td></Tr>}
          </Tbody>
        </Table>
      )}
    </div>
  )
}
