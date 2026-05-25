import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Sidebar } from '@/components/Sidebar'

export const metadata: Metadata = {
  title: 'Clube Thiago White — Desbravadores',
  description: 'Sistema de Gerenciamento do Clube de Desbravadores Thiago White',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full" suppressHydrationWarning>
      <body className="h-full antialiased">
        <ThemeProvider>
          <div className="flex h-full">
            <Sidebar />
            <main className="flex-1 ml-60 min-h-screen bg-[var(--background)] overflow-auto">
              <div className="p-6 max-w-7xl mx-auto">{children}</div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
