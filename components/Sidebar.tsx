'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, BookOpen, Star, Layers,
  DollarSign, TrendingUp, Package, FileText, Gavel,
  BarChart2, Shield,
} from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { cn } from '@/lib/utils'

const NAV = [
  {
    label: 'Principal',
    items: [
      { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    ],
  },
  {
    label: 'Cadastros',
    items: [
      { href: '/cadastros/desbravadores', icon: Users, label: 'Desbravadores' },
      { href: '/cadastros/unidades', icon: Layers, label: 'Unidades' },
      { href: '/cadastros/classes', icon: BookOpen, label: 'Classes' },
      { href: '/cadastros/especialidades', icon: Star, label: 'Especialidades' },
    ],
  },
  {
    label: 'Controles',
    items: [
      { href: '/mensalidades', icon: DollarSign, label: 'Mensalidades' },
      { href: '/caixa', icon: TrendingUp, label: 'Caixa' },
      { href: '/custos', icon: BarChart2, label: 'Custos' },
      { href: '/patrimonio', icon: Package, label: 'Patrimônio' },
      { href: '/atas', icon: FileText, label: 'Atas' },
      { href: '/atos', icon: Gavel, label: 'Atos' },
    ],
  },
  {
    label: 'Relatórios',
    items: [
      { href: '/relatorios', icon: Shield, label: 'Relatórios' },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 w-60 flex flex-col bg-[var(--sidebar-bg)] text-[var(--sidebar-text)] z-40">
      <div className="p-4 border-b border-white/10">
        <div className="font-bold text-base leading-tight">
          <span className="text-blue-400">⚜</span> Clube Thiago White
        </div>
        <div className="text-xs text-white/40 mt-0.5">Desbravadores</div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-5">
        {NAV.map(group => (
          <div key={group.label}>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-white/30 px-2 mb-1">
              {group.label}
            </div>
            <ul className="space-y-0.5">
              {group.items.map(item => {
                const active = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-colors',
                        active
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-white/10 text-[var(--sidebar-text)]',
                      )}
                    >
                      <item.icon size={16} />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 flex items-center justify-between">
        <span className="text-xs text-white/30">v1.0.0</span>
        <ThemeToggle />
      </div>
    </aside>
  )
}
