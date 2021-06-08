import React, { FC, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import {
  Box,
  GridContainer,
  Header as UIHeader,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useAuth } from '@island.is/auth/react'
import { useHeaderInfo } from '@island.is/application/ui-shell'

import { fixSvgUrls } from '../../utils'

export const Header: FC = () => {
  const { isAuthenticated, userInfo, signOut } = useAuth()
  const { lang } = useLocale()
  const { changeLanguage } = useNamespaces()
  const location = useLocation()
  const { info } = useHeaderInfo()

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
    <Box background="white">
      <GridContainer>
        <UIHeader
          info={
            info.applicationName && info.institutionName
              ? {
                  title: info.institutionName,
                  description: info.applicationName,
                }
              : undefined
          }
          authenticated={isAuthenticated}
          userName={userInfo?.profile?.name}
          userAsDropdown={true}
          language={lang}
          switchLanguage={handleSwitchLanguage}
          onLogout={signOut}
        />
      </GridContainer>
    </Box>
  )
}
