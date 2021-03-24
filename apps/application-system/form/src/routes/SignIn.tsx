import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { setClientAuthToken } from '@island.is/application/graphql'

import { ActionType, useAuthState } from '../context/AuthProvider'
import { userManager } from '../utils/userManager'
import AuthenticationLoading from '../components/AuthenticationLoading/AuthenticationLoading'

export const Signin = () => {
  const history = useHistory()
  const [, dispatch] = useAuthState()

  useEffect(() => {
    userManager
      .signinCallback(window.location.href)
      .then((user) => {
        dispatch({
          type: ActionType.SET_USER_FULFILLED,
          payload: user,
        })

        setClientAuthToken(user.access_token)

        const url =
          typeof user.state === 'string'
            ? user.state.replace(/\/umsoknir\/?/i, '/')
            : '/'

        history.push(url)
      })
      .catch((error) => {
        console.error(error)
        window.location.replace(window.location.origin)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <AuthenticationLoading />
}
