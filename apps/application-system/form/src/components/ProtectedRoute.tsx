import React, { FC, useEffect } from 'react'
import useAuth from '../hooks/useAuth'
import { Route, RouteProps } from 'react-router-dom'
import AuthenticationLoading from './AuthenticationLoading/AuthenticationLoading'

export const ProtectedRoute: FC<RouteProps> = (props) => {
  const { userInfo, userInfoState, signInUser } = useAuth()

  useEffect(() => {
    if (userInfo === undefined && userInfoState === 'passive') {
      signInUser()
    }
  }, [userInfo, userInfoState, signInUser])

  return (
    <>
      {userInfo ? (
        <Route {...(props as RouteProps)} />
      ) : (
        <AuthenticationLoading />
      )}
    </>
  )
}

export default ProtectedRoute
