import React, { FC, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'
import { signOut, useSession } from 'next-auth/client'

import { Header as IslandUIHeader, Link } from '@island.is/island-ui/core'
import { AuthSession } from '@island.is/next-ids-auth'

import { useI18n } from '@island.is/skilavottord-web/i18n'
import { UserContext } from '@island.is/skilavottord-web/context'
import { Locale } from '@island.is/shared/types'
import { getRoutefromLocale } from '@island.is/skilavottord-web/utils/routesMapper'
import { Query, Role } from '@island.is/skilavottord-web/graphql/schema'

export const SkilavottordUserQuery = gql`
  query skilavottordUserQuery {
    skilavottordUser {
      name
      nationalId
      role
      partnerId
    }
  }
`

export const Header: FC<React.PropsWithChildren<unknown>> = () => {
  const router = useRouter()
  const { setUser, isAuthenticated } = useContext(UserContext)
  const [session] = useSession() as [AuthSession, boolean]
  const [baseUrl, setBaseUrl] = useState<string>('island.is')
  const {
    activeLocale,
    locale,
    t: { header: t, routes },
  } = useI18n()

  const { data, client, loading } = useQuery<Query>(SkilavottordUserQuery, {
    fetchPolicy: 'network-only',
    skip: !session?.user,
  })
  const user = data?.skilavottordUser

  const nextLanguage = activeLocale === 'is' ? 'en' : 'is'

  const switchLanguage = async (toLanguage: Locale) => {
    const route = await getRoutefromLocale(
      router.pathname,
      activeLocale,
      toLanguage,
    )
    const queryKeys = Object.keys(router.query)
    const path = queryKeys.reduce(
      (acc, key) =>
        acc.replace(`[${key}]`, (router.query[key] || '').toString()),
      route,
    )
    if (route) {
      router.replace(route, path)
      locale(toLanguage)
    }
  }

  useEffect(() => {
    if (user && setUser) {
      setUser(user)
    }
  }, [user, setUser])

  const mapUserRoleToRoute = (userRole?: Role | null) => {
    if (!userRole || userRole === Role.developer) {
      return Role.citizen
    }
    return userRole
  }

  const logout = () => {
    setUser && setUser(undefined)
    sessionStorage.clear()
    client.stop()
    client.clearStore()
    signOut({
      callbackUrl: `${window.location.origin}/app/skilavottord/api/auth/logout?id_token=${session?.idToken}`,
    })
  }

  const homeRoute = routes.home[mapUserRoleToRoute(user?.role)]
  return (
    <IslandUIHeader
      logoRender={(logo) => <Link href={homeRoute!}>{logo}</Link>}
      logoutText={t.logoutText}
      userLogo={user?.role === 'developer' ? '👑' : undefined}
      language={activeLocale}
      switchLanguage={() => switchLanguage(nextLanguage)}
      userName={loading ? '' : user?.name ?? session?.user?.name ?? ''}
      authenticated={isAuthenticated}
      onLogout={logout}
    />
  )
}

export default Header
