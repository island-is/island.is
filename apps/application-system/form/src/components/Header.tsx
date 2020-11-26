import React, { FC } from 'react'
import { Header as UIHeader } from '@island.is/island-ui/core'
import { useAuthState } from '../context/AuthProvider'
import { useLocale, useNamespaces } from '@island.is/localization'
import useAuth from '../hooks/useAuth'

const Header: FC = () => {
  const [{ isAuthenticated, userInfo }] = useAuthState()
  const { signOutUser } = useAuth()
  const { lang } = useLocale()
  const { changeLanguage } = useNamespaces()

  return (
    <UIHeader
      authenticated={isAuthenticated}
      userName={userInfo?.profile?.name}
      language={lang || 'is'}
      switchLanguage={() => changeLanguage(lang === 'is' ? 'en' : 'is')}
      onLogout={signOutUser}
    />
  )
}

export default Header
