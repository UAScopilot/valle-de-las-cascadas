import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from './components/Navbar'
import { ExperiencesProvider } from './contexts/ExperiencesContext' // 👈 Importación del contexto

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Valle de las Cascadas',
  description: 'Explora experiencias únicas en el Valle de las Cascadas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ExperiencesProvider> {/* 👈 Proveedor global */}
          <Navbar />
          {children}
        </ExperiencesProvider>
      </body>
    </html>
  )
}
