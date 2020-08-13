import React, { FC } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { isAuthenticated } from '../../auth/utils'
import { UserManager } from 'oidc-client'

export interface AuthenticatorProps {
  userManager?: UserManager
}

export const Authenticator: FC<AuthenticatorProps> = ({
  userManager,
  children,
  ...rest
}) => {
  if(isAuthenticated(userManager)) {
    userManager.signinRedirect()
  }
  return (
  <h1>forsíða</h1>
  )
}

export default Authenticator
