import { useSession } from 'next-auth/client'
import Head from 'next/head'
import React, { FC, ReactNode, useState } from 'react'

import { GridContainer, Page } from '@island.is/island-ui/core'
import { AuthSession } from '@island.is/next-ids-auth'

import { UserContext } from '@island.is/skilavottord-web/context'
import {
  Query,
  Role,
  SkilavottordUser,
} from '@island.is/skilavottord-web/graphql/schema'
import { BASE_PATH } from '@island.is/skilavottord/consts'

import { useQuery } from '@apollo/client'
import { SkilavottordRecyclingPartnerActive } from '@island.is/skilavottord-web/graphql'
import { Header } from '../../components'

interface LayoutProps {
  children: ReactNode
}

export const AppLayout: FC<React.PropsWithChildren<LayoutProps>> = ({
  children,
}) => {
  const [user, setUser] = useState<SkilavottordUser>()
  const [session] = useSession() as [AuthSession, boolean]

  const { data } = useQuery<Query>(SkilavottordRecyclingPartnerActive, {
    variables: { input: { companyId: user?.partnerId } },
    ssr: false,
    skip: !user?.partnerId,
  })

  // To prevent flickering on page loading the session and data is grouped together
  let isAuthenticated = Boolean(
    session?.user && data?.skilavottordRecyclingPartnerActive,
  )

  if (user?.role === Role.developer || user?.role === Role.recyclingFund) {
    isAuthenticated = Boolean(session?.user)
  }

  return (
    <UserContext.Provider
      value={{ isAuthenticated: isAuthenticated, user, setUser }}
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
