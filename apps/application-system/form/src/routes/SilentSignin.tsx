import React, { FC, useEffect } from 'react'
import AuthenticationLoading from '../components/AuthenticationLoading/AuthenticationLoading'
import { userManager } from '../utils/userManager'

// TODO: This route gets mounted as an iframe to silently log the user in
// For further optimization it can be minimized into a barebones html file
export const SilentSignIn: FC = () => {
  useEffect(() => {
    userManager.signinSilentCallback().catch(function (error) {
      // TODO: Handle error
      console.log(error)
    })
  }, [])

  return <AuthenticationLoading />
}
