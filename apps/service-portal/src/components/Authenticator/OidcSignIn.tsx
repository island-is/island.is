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
      .signinCallback(window.location.href)
      .then(function(user) {
        dispatch({
          type: ActionType.SetUserFulfilled,
          payload: user,
        })

        // TODO: Send the user back to the route he was attempting to access
        // instead of redirecting him to the frontpage every time
        history.push('/')
      })
      .catch(function(error) {
        // TODO: Handle error
        console.log('error', error)
      })
  }, [])

  return <AuthenticatorLoadingScreen />
}

export default OidcSignIn
