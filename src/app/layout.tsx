import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'esoteric.ai',
  description: 'Daily esoteric patterns and synchronicities',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
} 