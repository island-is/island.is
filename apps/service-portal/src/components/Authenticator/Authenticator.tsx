import React, { FC, useEffect } from 'react'
import AuthenticatorLoadingScreen from './AuthenticatorLoadingScreen'
import useAuth from '../../hooks/useAuth/useAuth'
const MOCK_AUTHENTICATION = false

export const Authenticator: FC = ({ children }) => {
  const { userInfo, userInfoState, signInUser, mockSignIn } = useAuth()

  useEffect(() => {
    if (
      (userInfo === null || userInfo.user === null) &&
      userInfoState === 'passive'
    ) {
      MOCK_AUTHENTICATION ? mockSignIn() : signInUser()
    }
  }, [userInfo, userInfoState, signInUser, mockSignIn])

  return <>{userInfo?.user ? children : <AuthenticatorLoadingScreen />}</>
}

export default Authenticator
