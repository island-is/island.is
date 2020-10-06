import React, { FC, useContext, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { Header as IslandUIHeader } from '@island.is/island-ui/core'

import { useI18n } from '@island.is/skilavottord-web/i18n'
import useRouteNames from '@island.is/skilavottord-web/i18n/useRouteNames'
import { UserContext } from '@island.is/skilavottord-web/context'
import { api } from '@island.is/skilavottord-web/services'

const mockUser = {
  name: 'Mock User',
  nationalId: '123456',
  mobile: 123456,
  role: 'developer',
}

export const Header: FC = () => {
  const router = useRouter()
  const { setUser, isAuthenticated } = useContext(UserContext)
  const { activeLocale, locale } = useI18n()
  const { makePath } = useRouteNames(activeLocale)

  const nextLanguage = activeLocale === 'is' ? 'en' : 'is'

  const switchLanguage = () => {
    locale(nextLanguage)
  }

  useEffect(() => {
    // Because every other route should not be accessible on refresh, re-route to my-cars page
    router.push(makePath('myCars'))
  }, [activeLocale])

  useEffect(() => {
    setUser(mockUser)
  }, [mockUser, setUser])

  return (
    <IslandUIHeader
      logoRender={(logo) => (
        <Link href={activeLocale === 'is' ? '/' : '/en'}>
          <a>{logo}</a>
        </Link>
      )}
      logoutText={'Log out'}
      userLogo={mockUser?.role === 'developer' ? '👑' : undefined}
      language={nextLanguage.toUpperCase()}
      switchLanguage={switchLanguage}
      userName={mockUser?.name ?? ''}
      authenticated={isAuthenticated}
      onLogout={() => {
        api.logout().then(() => router.push(makePath('home')))
      }}
    />
  )
}

export default Header
