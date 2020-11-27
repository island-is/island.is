import React, { FC, useEffect } from 'react'
import { Header as UIHeader } from '@island.is/island-ui/core'
import { useAuthState } from '../context/AuthProvider'
import { useLocale, useNamespaces } from '@island.is/localization'
import useAuth from '../hooks/useAuth'
import { fixSvgUrls } from '../utils'
import { useLocation } from 'react-router-dom'

const Header: FC = () => {
  const [{ isAuthenticated, userInfo }] = useAuthState()
  const { signOutUser } = useAuth()
  const { lang } = useLocale()
  const { changeLanguage } = useNamespaces()
  const location = useLocation()

  useEffect(() => {
    // Fixes the island.is logo and other SVGs not appearing on
    // Mobile Safari, when a <base> tag exists in index.html.
    const url = window.location.origin + location.pathname
    location.pathname.includes('application') && fixSvgUrls(url)
  }, [location])

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
