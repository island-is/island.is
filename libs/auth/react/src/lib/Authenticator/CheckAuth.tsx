import React, { FC, useEffect } from 'react'

import { getAuthSettings } from '../userManager'
import { useAuth } from './AuthContext'
import AuthenticatorLoadingScreen from './AuthenticatorLoadingScreen'
import { CheckIdpSession } from './CheckIdpSession'

interface Props {
  autoLogin: boolean
  checkLogin: () => void
}

export const CheckAuth: FC<Props> = ({ autoLogin, checkLogin, children }) => {
  const { userInfo } = useAuth()
  const authSettings = getAuthSettings()

  // Find existing authentication or start login flow.
  useEffect(() => {
    if (!userInfo) {
      checkLogin()
    }
  }, [])

  const renderChildren = !autoLogin || userInfo
  return renderChildren ? (
    <>
      {!authSettings.scope?.includes('offline_access') && <CheckIdpSession />}
      {children}
    </>
  ) : (
    <AuthenticatorLoadingScreen />
  )
}
