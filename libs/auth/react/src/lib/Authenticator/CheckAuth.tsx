import React, { FC, useEffect } from 'react'

import { useAuth } from './AuthContext'
import AuthenticatorLoadingScreen from './AuthenticatorLoadingScreen'

interface Props {
  autoLogin: boolean
  checkLogin: () => {}
}

export const CheckAuth: FC<Props> = ({ autoLogin, checkLogin, children }) => {
  const { userInfo } = useAuth()

  // Find existing authentication or start login flow.
  useEffect(() => {
    if (!userInfo) {
      checkLogin()
    }
  }, [])

  const renderChildren = !autoLogin || userInfo
  return <>{renderChildren ? children : <AuthenticatorLoadingScreen />}</>
}
