import React, { FC, useEffect } from 'react'
import AuthenticatorLoadingScreen from './AuthenticatorLoadingScreen'
import useAuth from '../../hooks/useAuth/useAuth'
const MOCK_AUTHENTICATION = true

export const Authenticator: FC = ({ children }) => {
  const { userInfo, userInfoState, signInUser, mockSignIn } = useAuth()

  useEffect(() => {
    if (
      (userInfo === null || userInfo.user === null) &&
      userInfoState === 'passive'
    ) {
      if (MOCK_AUTHENTICATION) {
        mockSignIn()
      } else {
        signInUser()
      }
    }
  }, [userInfo, userInfoState, signInUser, mockSignIn])

  return <>{userInfo?.user ? children : <AuthenticatorLoadingScreen />}</>
}

export default Authenticator
