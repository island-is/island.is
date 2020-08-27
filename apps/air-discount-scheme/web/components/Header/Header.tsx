import React, { useContext, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'

import { Header as IslandUIHeader } from '@island.is/island-ui/core'

import { UserContext } from '../../context'
import { api } from '../../services'
import { useI18n, Routes } from '../../i18n'

interface PropTypes {
  routeKey: keyof Routes
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

function Header({ routeKey }: PropTypes) {
  const router = useRouter()
  const { setUser, isAuthenticated } = useContext(UserContext)
  const { data } = useQuery(UserQuery, { ssr: false })
  const user = data?.user
  useEffect(() => {
    setUser(user)
  }, [user, setUser])
  const { toRoute, activeLocale } = useI18n()

  const language = activeLocale === 'is' ? 'en' : 'is'
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
      language={language.toUpperCase()}
      switchLanguage={() => {
        router.push(toRoute(routeKey, language))
      }}
      userName={user?.name ?? ''}
      authenticated={isAuthenticated}
      onLogout={() => {
        api.logout().then(() => router.push(toRoute('home')))
      }}
    />
  )
}

export default Header
