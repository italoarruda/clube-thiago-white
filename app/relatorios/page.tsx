import Link from 'next/link'
import { FileText, TrendingUp, Package, BookOpen, DollarSign, Users, Shield } from 'lucide-react'

const RELATORIOS = [
  {
    href: '/relatorios/autorizacao-saida',
    icon: Shield,
    title: 'Autorização de Saída',
    description: 'Formulário de autorização para o responsável',
    color: 'blue',
  },
  {
    href: '/relatorios/fluxo-caixa',
    icon: TrendingUp,
    title: 'Fluxo de Caixa',
    description: 'Entradas, saídas e saldo por período',
    color: 'green',
  },
  {
    href: '/relatorios/patrimonio',
    icon: Package,
    title: 'Patrimônio',
    description: 'Lista completa de bens com valores',
    color: 'purple',
  },
  {
    href: '/relatorios/livro-ata-atos',
    icon: BookOpen,
    title: 'Livro Ata e Atos',
    description: 'Atas e atos em formato de livro numerado',
    color: 'orange',
  },
  {
    href: '/relatorios/mensalidade',
    icon: DollarSign,
    title: 'Mensalidades',
    description: 'Status de pagamento por mês',
    color: 'yellow',
  },
  {
    href: '/relatorios/cadastros',
    icon: Users,
    title: 'Cadastros',
    description: 'Unidades, classes, especialidades e desbravadores',
    color: 'red',
  },
]

const colorMap: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
}

export default function RelatoriosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><FileText size={24} /> Relatórios</h1>
        <p className="text-[var(--muted)] text-sm mt-1">Selecione um relatório para visualizar e imprimir</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {RELATORIOS.map(r => (
          <Link
            key={r.href}
            href={r.href}
            className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition-all flex items-start gap-4"
          >
            <div className={`p-3 rounded-xl ${colorMap[r.color]}`}>
              <r.icon size={22} />
            </div>
            <div>
              <h2 className="font-semibold">{r.title}</h2>
              <p className="text-sm text-[var(--muted)] mt-0.5">{r.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
