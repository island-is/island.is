import React, { FC, useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import AuthenticationLoading from './AuthenticationLoading/AuthenticationLoading'

export const Authenticator: FC = ({ children }) => {
  const { userInfo, userInfoState, signInUser } = useAuth()
  const [pendingAuthentication, setPending] = useState(false)

  useEffect(() => {
    if (
      !pendingAuthentication &&
      userInfo === undefined &&
      userInfoState === 'passive'
    ) {
      setPending(true)
      signInUser()
        .then(() => {
          setPending(false)
        })
        .catch(() => {
          setPending(false)
        })
    }
  }, [pendingAuthentication, userInfo, userInfoState, signInUser])

  return <>{userInfo ? children : <AuthenticationLoading />}</>
}

export default Authenticator
