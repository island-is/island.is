import type { Metadata } from 'next'
import { GlobalStylesProvider } from '../components/GlobalStylesProvider'
import { AppHeader } from '../components/AppHeader'

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
      <body>
        <GlobalStylesProvider>
          <AppHeader
            institutionName="Stafrænt Ísland"
            applicationName="Example Inputs"
          />
          {children}
        </GlobalStylesProvider>
      </body>
    </html>
  )
}
