import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badge = cva('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', {
  variants: {
    variant: {
      default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
      blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
      green: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
      red: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
      yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
      purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
      orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    },
  },
  defaultVariants: { variant: 'default' },
})

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badge> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badge({ variant }), className)} {...props} />
}

// Helpers de status
import type { StatusDesbravador, StatusMensalidade, EstadoPatrimonio } from '@/lib/types'

export function StatusDesbravadorBadge({ status }: { status: StatusDesbravador }) {
  const map: Record<StatusDesbravador, { variant: BadgeProps['variant']; label: string }> = {
    ativo: { variant: 'green', label: 'Ativo' },
    inativo: { variant: 'default', label: 'Inativo' },
    transferido: { variant: 'blue', label: 'Transferido' },
    desligado: { variant: 'red', label: 'Desligado' },
  }
  const { variant, label } = map[status]
  return <Badge variant={variant}>{label}</Badge>
}

export function StatusMensalidadeBadge({ status }: { status: StatusMensalidade }) {
  const map: Record<StatusMensalidade, { variant: BadgeProps['variant']; label: string }> = {
    pago: { variant: 'green', label: 'Pago' },
    pendente: { variant: 'yellow', label: 'Pendente' },
    atrasado: { variant: 'red', label: 'Atrasado' },
    isento: { variant: 'blue', label: 'Isento' },
  }
  const { variant, label } = map[status]
  return <Badge variant={variant}>{label}</Badge>
}

export function EstadoPatrimonioBadge({ estado }: { estado: EstadoPatrimonio }) {
  const map: Record<EstadoPatrimonio, { variant: BadgeProps['variant']; label: string }> = {
    otimo: { variant: 'green', label: 'Ótimo' },
    bom: { variant: 'blue', label: 'Bom' },
    regular: { variant: 'yellow', label: 'Regular' },
    ruim: { variant: 'red', label: 'Ruim' },
    baixado: { variant: 'default', label: 'Baixado' },
  }
  const { variant, label } = map[estado]
  return <Badge variant={variant}>{label}</Badge>
}
