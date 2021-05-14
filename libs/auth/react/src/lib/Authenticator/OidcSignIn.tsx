import React, { ReactElement, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import AuthenticatorLoadingScreen from './AuthenticatorLoadingScreen'
import { getUserManager } from '../userManager'
import { ActionType, AuthDispatch } from './Authenticator.state'

interface Props {
  authDispatch: AuthDispatch
}

export const OidcSignIn = ({ authDispatch }: Props): ReactElement => {
  const history = useHistory()

  const init = async function init() {
    const userManager = getUserManager()
    try {
      const user = await userManager.signinRedirectCallback(
        window.location.href,
      )

      authDispatch({ type: ActionType.SIGNIN_SUCCESS, payload: user })

      const url = typeof user.state === 'string' ? user.state : '/'
      history.push(url)
    } catch (error) {
      console.error(error)
      window.location.replace(window.location.origin)
    }
  }

  useEffect(() => {
    init()
  }, [])

  return <AuthenticatorLoadingScreen />
}

export default OidcSignIn
