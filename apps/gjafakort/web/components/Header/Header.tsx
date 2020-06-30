import React, { useContext, useEffect } from 'react'
import Link from 'next/link'
import Router from 'next/router'
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

  const switchLanguage = () => {
    // TODO: parse the routes to push to the correct one (tricky)
    switch (activeLocale) {
      case 'is':
        return locale('en')
      case 'en':
        return locale('is')
      default:
        return
    }
  }

  const language =
    activeLocale === 'is'
      ? 'English'
      : activeLocale === 'en'
      ? 'Íslenska'
      : undefined

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
        const redirect = Router.pathname.startsWith(routes.companies.home)
          ? routes.companies.home
          : routes.home
        api.logout().then(() => Router.push(redirect))
      }}
    />
  )
}

export default Header
