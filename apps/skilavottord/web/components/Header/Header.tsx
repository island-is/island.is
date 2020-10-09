import React, { FC, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Header as IslandUIHeader } from '@island.is/island-ui/core'

import { useI18n } from '@island.is/skilavottord-web/i18n'
import useRouteNames from '@island.is/skilavottord-web/i18n/useRouteNames'

const mockUser = {
  name: 'Mock User',
  nationalId: '123456',
  mobile: '0123',
  role: '',
}

export const Header: FC = () => {
  const router = useRouter()
  // const { setUser, isAuthenticated } = useContext(UserContext)
  const isAuthenticated = true
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
        router.push(makePath('home'))
      }}
    />
  )
}

export default Header
