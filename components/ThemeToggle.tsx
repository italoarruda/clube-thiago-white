'use client'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from './ThemeProvider'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg hover:bg-white/10 transition-colors"
      title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
