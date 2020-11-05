import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { ActionType, useAuthState } from '../context/AuthProvider'
import { userManager } from '../utils/userManager'
import { setClientAuthToken } from 'libs/application/graphql/src/lib/client'
import AuthenticationLoading from '../components/AuthenticationLoading/AuthenticationLoading'

export const Signin = () => {
  const history = useHistory()
  const [, dispatch] = useAuthState()

  useEffect(() => {
    userManager
      .signinCallback(window.location.href)
      .then(function (user) {
        dispatch({
          type: ActionType.SET_USER_FULFILLED,
          payload: user,
        })

        setClientAuthToken(user.access_token)

        history.push(user.state?.redirect ?? '/')
      })
      .catch(function (error) {
        // TODO: Handle error
        console.log('error in SIGNING', error)
      })
  }, [])

  return <AuthenticationLoading />
}
