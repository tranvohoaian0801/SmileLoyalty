import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Smile Airlines - Loyalty Program',
  description: 'Earn points, unlock exclusive benefits, and experience premium service with Smile Airlines loyalty program.',
  keywords: 'airline, loyalty program, points, travel, flights',
  openGraph: {
    title: 'Smile Airlines - Loyalty Program',
    description: 'Join millions of travelers earning points and unlocking exclusive benefits',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}