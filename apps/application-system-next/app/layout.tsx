import type { Metadata } from 'next'
import { GlobalStylesProvider } from '../components/GlobalStylesProvider'
import { Providers } from '../components/Providers'
import { HeaderInfoProvider } from '../components/HeaderInfoProvider'
import { AppHeader } from '../components/AppHeader'
import { AppBffProvider } from '../components/AppBffProvider'
import { AppUserProfileLocale } from '../components/AppUserProfileLocale'
import './globals.css'

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
          <Providers>
            <AppBffProvider>
              <AppUserProfileLocale />
              <HeaderInfoProvider>
                <AppHeader />
                {children}
              </HeaderInfoProvider>
            </AppBffProvider>
          </Providers>
        </GlobalStylesProvider>
      </body>
    </html>
  )
}
