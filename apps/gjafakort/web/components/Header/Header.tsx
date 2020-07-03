import React, { useContext, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'

import { Header as IslandUIHeader } from '@island.is/island-ui/core'

import { UserContext } from '../../context'
import { useI18n } from '../../i18n'
import { api } from '../../services'

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
    t: { header: t, routes, routeSwitcher },
    activeLocale,
    locale,
  } = useI18n()
  const { data } = useQuery(UserQuery)
  const user = data?.user
  useEffect(() => {
    setUser(user)
  }, [user, setUser])

  const switchLanguage = () => {
    const queryKeys = Object.keys(router.query)
    const path = queryKeys.reduce(
      (acc, key) => acc.replace(`[${key}]`, router.query[key].toString()),
      routeSwitcher[router.pathname],
    )
    router.replace(routeSwitcher[router.pathname], path)
    locale(activeLocale === 'is' ? 'en' : 'is')
  }
  const language =
    activeLocale === 'is' ? 'en' : activeLocale === 'en' ? 'is' : undefined

  return (
    <IslandUIHeader
      logoRender={(logo) => (
        <Link href={routes.home}>
          <a>{logo}</a>
        </Link>
      )}
      logoutText={t.logout}
      userLogo={user?.role === 'developer' ? '👑' : undefined}
      language={language}
      switchLanguage={switchLanguage}
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
