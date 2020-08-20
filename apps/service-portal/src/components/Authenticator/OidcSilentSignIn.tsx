import React, { FC, useEffect } from 'react'
import { useStore } from '../../store/stateProvider'

export const OidcSilentSignIn: FC = () => {
  const [{ userManager }] = useStore()

  useEffect(() => {
    userManager.signinSilentCallback().catch(function(error) {
      console.log(error)
    })
  }, [])

  return <p>loggin in..</p>
}

export default OidcSilentSignIn
