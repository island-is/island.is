import React, { FC, useEffect } from 'react'
import { userManager } from '../../utils/userManager'
import AuthenticatorLoadingScreen from './AuthenticatorLoadingScreen'

// TODO: This route gets mounted as an iframe to silently log the user in
// For further optimization it can be minimized into a barebones html file
export const OidcSilentSignIn: FC = () => {
  useEffect(() => {
    userManager.signinSilentCallback().catch(function(error) {
      // TODO: Handle error
      console.log(error)
    })
  }, [])

  return <AuthenticatorLoadingScreen />
}

export default OidcSilentSignIn
