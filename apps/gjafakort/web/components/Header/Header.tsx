import React, { useContext, useEffect } from 'react'
import Link from 'next/link'
import Router from 'next/router'
import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'

import { Header as IslandUIHeader } from '@island.is/island-ui/core'

import { UserContext } from '../../context/UserContext'
import { useI18n } from '../../i18n'
import { api } from '../../services'

export const UserQuery = gql`
  query UserQuery {
    user {
      name
      ssn
      mobile
    }
  }
`

function Header() {
  const { setAuth, isAuthenticated } = useContext(UserContext)
  const {
    t: { header: t, routes },
  } = useI18n()
  const { data, loading } = useQuery(UserQuery)
  const user = data?.user

  useEffect(() => {
    setAuth(user, loading)
  }, [user, loading])

  return (
    <IslandUIHeader
      logoRender={(logo) => (
        <Link href={routes.home}>
          <a>{logo}</a>
        </Link>
      )}
      logoutText={t.logout}
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
