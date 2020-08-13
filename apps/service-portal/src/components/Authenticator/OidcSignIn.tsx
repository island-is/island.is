import React, { FC } from 'react'
import { useHistory } from 'react-router-dom'
import { UserManager } from 'oidc-client'

export interface OidcSignInProps  {
  userManager?: UserManager
}

export const OidcSignIn: FC<OidcSignInProps> = ({
  userManager,
  children,
  ...rest
}) => {
  const history = useHistory();
  var user = userManager.signinCallback(window.location.href).then(function(user) {
    console.log(user)
  }).catch(function(error) {
    console.log(error)
  });
  return (
  <h1>Callback</h1>
  )
}

export default OidcSignIn
