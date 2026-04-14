import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ísland.is - Umsóknir',
  description: 'Application System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="is">
      <body>{children}</body>
    </html>
  )
}
