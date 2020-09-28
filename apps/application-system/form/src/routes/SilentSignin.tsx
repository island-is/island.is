import React, { FC, useEffect } from 'react'
import { userManager } from '../utils/userManager'
import Loading from '../components/Loading'

// TODO: This route gets mounted as an iframe to silently log the user in
// For further optimization it can be minimized into a barebones html file
export const SilentSignIn: FC = () => {
  useEffect(() => {
    userManager.signinSilentCallback().catch(function(error) {
      // TODO: Handle error
      console.log(error)
    })
  }, [])

  return <Loading />
}
