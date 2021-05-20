import React, { FC, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { Header as UIHeader } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useAuth } from '@island.is/auth/react'

import { fixSvgUrls } from '../utils'
import { useInfoState } from '../context/InfoProvider'

export const Header: FC = () => {
  const { isAuthenticated, userInfo, signOut } = useAuth()
  const { lang } = useLocale()
  const { changeLanguage } = useNamespaces()
  const location = useLocation()
  const { applicationName, institutionName } = useInfoState()

  const handleSwitchLanguage = () => {
    changeLanguage(lang === 'is' ? 'en' : 'is')
  }

  useEffect(() => {
    // Fixes the island.is logo and other SVGs not appearing on
    // Mobile Safari, when a <base> tag exists in index.html.
    const url = window.location.origin + location.pathname
    location.pathname.includes('umsoknir') && fixSvgUrls(url)
  }, [location])

  return (
    <UIHeader
      info={
        applicationName && institutionName
          ? {
              title: institutionName,
              description: applicationName,
            }
          : undefined
      }
      authenticated={isAuthenticated}
      userName={userInfo?.profile?.name}
      language={(lang ?? 'is') === 'is' ? 'EN' : 'IS'}
      switchLanguage={handleSwitchLanguage}
      onLogout={signOut}
    />
  )
}
