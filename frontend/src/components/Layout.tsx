import { ReactNode } from 'react'
import { Header } from './Header'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <Header />
      <main className="px-12 py-8">
        {children}
      </main>
    </div>
  )
}
