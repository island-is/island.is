import React, { FC, useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import gql from 'graphql-tag'

import { Header as IslandUIHeader, Link } from '@island.is/island-ui/core'

import { useI18n } from '@island.is/skilavottord-web/i18n'
import { UserContext } from '@island.is/skilavottord-web/context'
import { api } from '@island.is/skilavottord-web/services'
import { Locale } from '@island.is/skilavottord-web/i18n/I18n'
import { getRoutefromLocale } from '@island.is/skilavottord-web/utils/routesMapper'
import { useQuery } from '@apollo/client'
import { Role } from '@island.is/skilavottord-web/auth/utils'
import { BASE_PATH } from '../../utils/consts'

export const skilavottordUserQuery = gql`
  query skilavottordUserQuery {
    skilavottordUser {
      name
      nationalId
      mobile
      role
      partnerId
    }
  }
`

export const Header: FC = () => {
  const router = useRouter()
  const { setUser, isAuthenticated } = useContext(UserContext)
  const {
    activeLocale,
    locale,
    t: { header: t, routes },
  } = useI18n()

  const { data } = useQuery(skilavottordUserQuery)
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
      (acc, key) => acc.replace(`[${key}]`, router.query[key].toString()),
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

  const homeRoute = routes.home[user?.role as Role] ?? routes.home['citizen']

  return (
    <IslandUIHeader
      logoRender={(logo) => <Link href={homeRoute}>{logo}</Link>}
      logoutText={t.logoutText}
      userLogo={user?.role === 'developer' ? '👑' : undefined}
      language={nextLanguage.toUpperCase()}
      switchLanguage={() => switchLanguage(nextLanguage)}
      userName={user?.name ?? ''}
      authenticated={isAuthenticated}
      onLogout={() => {
        api.logout().then(() => router.push(`${BASE_PATH}${homeRoute}`))
      }}
    />
  )
}

export default Header
