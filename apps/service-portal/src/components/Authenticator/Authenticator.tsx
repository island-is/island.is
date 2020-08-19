import React, { FC, useEffect, useState } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { isAuthenticated } from '../../auth/utils'
import { UserManager } from 'oidc-client'
import { userNameContainer } from 'libs/island-ui/core/src/lib/Header/Header.treat'
import useUserInfo from '../../hooks/useUserInfo/useUserInfo'
import { useStore } from '../../store/stateProvider'

export interface AuthenticatorProps {
  userManager?: UserManager
}

export const Authenticator: FC<AuthenticatorProps> = ({
  userManager,
  children,
  ...rest
}) => {
  const [{ userInfo }] = useStore()

  const isAuthenticated = !!userInfo
  console.log('Authenticator')
  if(!isAuthenticated) {
    //userManager.signinRedirect()
    console.log('is not authenteds')
    userManager.signinSilent()
  }

  return (
    <Route
    {...rest}
    render={({ location }) =>
      isAuthenticated ? (
        <h1>herro {userInfo.profile.name}</h1>
      ) : (
      //children
      <h1>is not rogged in</h1>
      )
    }
  />
  )
}

export default Authenticator
