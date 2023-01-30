import { useEffect } from 'react'

import { getAuthSettings } from '../userManager'
import { useAuth } from './AuthContext'
import AuthenticatorLoadingScreen from './AuthenticatorLoadingScreen'
import { CheckIdpSession } from './CheckIdpSession'
import { Outlet } from 'react-router-dom'

export const CheckAuth = () => {
  const { userInfo, autoLogin, checkLogin } = useAuth()
  const authSettings = getAuthSettings()
  const monitorUserSession = !authSettings.scope?.includes('offline_access')

  // Find existing authentication or start login flow.
  useEffect(() => {
    if (!userInfo) {
      checkLogin()
    }
  }, [])

  if (!autoLogin || userInfo) {
    return (
      <>
        {monitorUserSession && <CheckIdpSession />}
        <Outlet />
      </>
    )
  }

  return <AuthenticatorLoadingScreen />
}
