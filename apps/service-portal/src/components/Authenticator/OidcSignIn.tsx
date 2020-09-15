import React, { FC, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { userManager } from '../../utils/userManager'
import AuthenticatorLoadingScreen from './AuthenticatorLoadingScreen'
import { useStore } from '../../store/stateProvider'
import { ActionType } from '../../store/actions'

export const OidcSignIn: FC = () => {
  const history = useHistory()
  const [, dispatch] = useStore()

  useEffect(() => {
    userManager
      .signinRedirectCallback(window.location.href)
      .then(function(user) {
        dispatch({
          type: ActionType.SetUserFulfilled,
          payload: user,
        })

        history.push(typeof user.state === 'string' ? user.state : '/')
      })
      .catch(function(error) {
        // TODO: Handle error
        console.log('error', error)
      })
  }, [])

  return <AuthenticatorLoadingScreen />
}

export default OidcSignIn
