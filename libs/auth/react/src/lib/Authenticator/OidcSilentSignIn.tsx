import { useEffect } from 'react'
import { getUserManager } from '../userManager'

// Note: This route gets mounted as an iframe to silently log the user in
// For further optimization it can be minimized into a barebones html file
export const OidcSilentSignIn = (): null => {
  useEffect(() => {
    const userManager = getUserManager()
    userManager.signinSilentCallback().catch(function (error) {
      // TODO: Handle error
      console.log(error)
    })
  }, [])

  return null
}

export default OidcSilentSignIn
