import React, { FC, ReactNode } from 'react'
import Head from 'next/head'
import { Header } from '../../components'

import { Page, Footer } from '@island.is/island-ui/core'

interface LayoutProps {
  children: ReactNode
}

export const MainLayout: FC<LayoutProps> = ({ children }) => (
  <Page>
    <Head>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#da532c" />
      <meta name="theme-color" content="#ffffff" />
      <meta
        name="description"
        content="Ísland.is er upplýsinga- og þjónustuveita opinberra aðila á Íslandi. Þar getur fólk og fyrirtæki fengið upplýsingar og notið margvíslegrar þjónustu hjá opinberum aðilum á einum stað í gegnum eina gátt."
      />
      <title>Ísland.is - Skilavottord</title>
    </Head>
    <Header />
    {children}
    <Footer />
  </Page>
)
