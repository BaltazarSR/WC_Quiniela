import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Thinkers Cup',
  description: 'FIFA World Cup 2026 predictions pool',
  icons: { icon: '/wc26logo.webp' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
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
