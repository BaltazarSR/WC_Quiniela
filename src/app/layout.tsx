import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mundial 2026 — Quiniela',
  description: 'FIFA World Cup 2026 predictions pool',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full" style={{ background: '#000', color: '#fff' }}>
        {children}
      </body>
    </html>
  )
}
