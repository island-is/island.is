import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthenticatorLoadingScreen from './AuthenticatorLoadingScreen'
import AuthenticatorErrorScreen from './AuthenticatorErrorScreen'
import { getUserManager } from '../userManager'
import { ActionType } from './Authenticator.state'
import { useAuth } from './AuthContext'

export const OidcSignIn = () => {
  const navigate = useNavigate()
  const { dispatch: authDispatch } = useAuth()
  const [hasError, setHasError] = useState(false)

  const init = async () => {
    const userManager = getUserManager()
    try {
      const user = await userManager.signinRedirectCallback(
        window.location.href,
      )

      authDispatch({ type: ActionType.SIGNIN_SUCCESS, payload: user })

      const url = typeof user.state === 'string' ? user.state : '/'
      navigate(url, {
        replace: true,
      })
    } catch (error) {
      if (error.error === 'login_required') {
        // If trying to switch delegations and the IDS session is expired, we'll
        // see this error. So we'll try a proper signin.
        return userManager.signinRedirect({ state: error.state })
      }
      console.error('Error in oidc callback', error)
      setHasError(true)
    }
  }

  useEffect(() => {
    init()
  }, [])

  return hasError ? (
    <AuthenticatorErrorScreen />
  ) : (
    <AuthenticatorLoadingScreen />
  )
}

export default OidcSignIn
