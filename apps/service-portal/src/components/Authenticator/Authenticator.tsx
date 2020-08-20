import React, { FC, useEffect } from 'react'
import AuthenticatorLoadingScreen from './AuthenticatorLoadingScreen'
import useAuth from '../../hooks/useAuth/useAuth'

export const Authenticator: FC = ({ children }) => {
  const { userInfo, userInfoState, signInUser } = useAuth()

  useEffect(() => {
    if (userInfo === null && userInfoState === 'passive') signInUser()
  }, [userInfo, userInfoState, signInUser])

  return <>{userInfo ? children : <AuthenticatorLoadingScreen />}</>
}

export default Authenticator
