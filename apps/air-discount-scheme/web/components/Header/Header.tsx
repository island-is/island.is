import React, { useContext, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'

import { Header as IslandUIHeader } from '@island.is/island-ui/core'

import { UserContext } from '../../context'
import { useI18n } from '../../i18n'
import { api } from '../../services'
import { getRoutefromLocale } from '@island.is/air-discount-scheme-web/utils'
import { Locale } from '@island.is/air-discount-scheme-web/i18n/I18n'

export const UserQuery = gql`
  query UserQuery {
    user {
      name
      ssn
      mobile
      role
    }
  }
`

function Header() {
  const router = useRouter()
  const { setUser, isAuthenticated } = useContext(UserContext)
  const {
    t: { header: t, routes },
    activeLocale,
    locale,
  } = useI18n()
  const { data } = useQuery(UserQuery)
  const user = data?.user
  useEffect(() => {
    setUser(user)
  }, [user, setUser])

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
  const language = activeLocale === 'is' ? 'en' : 'is'

  return (
    <IslandUIHeader
      logoRender={(logo) => (
        <Link href={routes.home}>
          <a href="/">{logo}</a>
        </Link>
      )}
      logoutText={t.logout}
      userLogo={user?.role === 'developer' ? '👑' : undefined}
      language={language.toUpperCase()}
      switchLanguage={() => {
        switchLanguage(language)
      }}
      userName={user?.name ?? ''}
      authenticated={isAuthenticated}
      onLogout={() => {
        const redirect = router.pathname.startsWith(routes.companies.home)
          ? routes.companies.home
          : routes.home
        api.logout().then(() => router.push(redirect))
      }}
    />
  )
}

export default Header
