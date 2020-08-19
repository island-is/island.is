import React, { FC, useEffect } from 'react'
import { useStore } from '../../store/stateProvider'

export const OidcSignIn: FC = () => {
  const [{ userManager }] = useStore()

  useEffect(() => {
    userManager.signinSilentCallback().catch(function(error) {
      console.log(error)
    })
  }, [])

  return <p>redirect</p>
}

export default OidcSignIn
