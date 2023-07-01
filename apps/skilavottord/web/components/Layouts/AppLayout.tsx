import React, { FC, ReactNode, useState } from 'react'
import Head from 'next/head'
import { useSession } from 'next-auth/client'

import { AuthSession } from '@island.is/next-ids-auth'
import { Page, GridContainer } from '@island.is/island-ui/core'

import { UserContext } from '@island.is/skilavottord-web/context'
import { SkilavottordUser } from '@island.is/skilavottord-web/graphql/schema'
import { BASE_PATH } from '@island.is/skilavottord/consts'

import { Header } from '../../components'

interface LayoutProps {
  children: ReactNode
}

export const AppLayout: FC<React.PropsWithChildren<LayoutProps>> = ({
  children,
}) => {
  const [user, setUser] = useState<SkilavottordUser>()
  const [session] = useSession() as [AuthSession, boolean]

  return (
    <UserContext.Provider
      value={{ isAuthenticated: Boolean(session?.user), user, setUser }}
    >
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
          <link rel="manifest" href={`${BASE_PATH}/site.webmanifest`} />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />
          <meta
            name="description"
            content="Ísland.is er upplýsinga- og þjónustuveita opinberra aðila á Íslandi. Þar getur fólk og fyrirtæki fengið upplýsingar og notið margvíslegrar þjónustu hjá opinberum aðilum á einum stað í gegnum eina gátt."
          />
          <title>Ísland.is - Skilavottord</title>
        </Head>
        <GridContainer>
          <Header />
        </GridContainer>
        {children}
      </Page>
    </UserContext.Provider>
  )
}
