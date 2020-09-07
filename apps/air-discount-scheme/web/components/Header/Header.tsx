import React, { useContext, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'

import { Header as IslandUIHeader } from '@island.is/island-ui/core'

import { UserContext } from '../../context'
import { api } from '../../services'
import { REDIRECT_KEY } from '../../consts'
import { useI18n } from '../../i18n'
import { Routes } from '../../types'

interface PropTypes {
  routeKey: keyof Routes
  localeKey: string
}

export const UserQuery = gql`
  query UserQuery {
    user {
      name
      nationalId
      mobile
      role
    }
  }
`

function Header({ routeKey, localeKey }: PropTypes) {
  const router = useRouter()
  const { setUser, isAuthenticated } = useContext(UserContext)
  const { data } = useQuery(UserQuery, { ssr: false })
  const user = data?.user
  useEffect(() => {
    setUser(user)
  }, [user, setUser])
  const { toRoute, activeLocale, switchLanguage } = useI18n()

  const nextLanguage = activeLocale === 'is' ? 'en' : 'is'
  // TODO: get text from cms and pass down to Header
  const logoutText = activeLocale === 'is' ? 'Útskrá' : 'Logout'

  return (
    <IslandUIHeader
      logoRender={(logo) => (
        <Link href={activeLocale === 'is' ? '/' : '/en'}>
          <a>{logo}</a>
        </Link>
      )}
      logoutText={logoutText}
      userLogo={user?.role === 'developer' ? '👑' : undefined}
      language={nextLanguage.toUpperCase()}
      switchLanguage={() => {
        const route = localeKey && toRoute(routeKey, nextLanguage)
        switchLanguage(route, nextLanguage)
      }}
      userName={user?.name ?? ''}
      authenticated={isAuthenticated}
      onLogout={() => {
        api.logout().then(() => {
          localStorage.removeItem(REDIRECT_KEY)
          router.push(toRoute('home'))
        })
      }}
    />
  )
}

export default Header
