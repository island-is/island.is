import React, { FC } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  ResponsiveSpace,
  GridContainer,
  Header as IslandUIHeader,
} from '@island.is/island-ui/core'

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
  const { activeLocale } = useI18n()
  const { makePath } = useRouteNames(activeLocale)

  return (
    <IslandUIHeader
      logoRender={(logo) => (
        <Link href={activeLocale === 'is' ? '/' : '/en'}>
          <a>{logo}</a>
        </Link>
      )}
      logoutText={'Log out'}
      userLogo={mockUser?.role === 'developer' ? '👑' : undefined}
      language={activeLocale.toUpperCase()}
      switchLanguage={() => {}}
      userName={mockUser?.name ?? ''}
      authenticated={isAuthenticated}
      onLogout={() => {
        router.push(makePath('home'))
      }}
    />
  )
}

export default Header
