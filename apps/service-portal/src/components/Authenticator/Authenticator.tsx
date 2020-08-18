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

  return (
    <Route
    {...rest}
    render={({ location }) =>
      !userInfo ? (
        userManager.signinRedirect()
      ) : (
        children
      )
    }
  />
  )
}

export default Authenticator
