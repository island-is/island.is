import React, { FC, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { userManager } from '../../utils/userManager'
import AuthenticatorLoadingScreen from './AuthenticatorLoadingScreen'
import { useStore } from '../../store/stateProvider'
import { ActionType } from '../../store/actions'
import { setClientAuthToken } from '@island.is/service-portal/graphql'

export const OidcSignIn: FC = () => {
  const history = useHistory()
  const [, dispatch] = useStore()

  useEffect(() => {
    userManager
      .signinRedirectCallback(window.location.href)
      .then(function (user) {
        dispatch({
          type: ActionType.SetUserFulfilled,
          payload: user,
        })

        setClientAuthToken(user.access_token)
        const isRootState =
          user.state === '/minarsidur' || user.state === '/minarsidur/'

        history.push(
          typeof user.state === 'string' && !isRootState ? user.state : '/',
        )
      })
      .catch(function (error) {
        console.error(error)
        window.location.replace(window.location.origin)
      })
  }, [])

  return <AuthenticatorLoadingScreen />
}

export default OidcSignIn
