import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { ActionType, useAuthState } from '../context/AuthProvider'
import { userManager } from '../utils/userManager'
import Loading from '../components/Loading'

export const Signin = () => {
  const history = useHistory()
  const [, dispatch] = useAuthState()

  console.log({ userManager })

  useEffect(() => {
    userManager
      .signinCallback(window.location.href)
      .then(function(user) {
        dispatch({
          type: ActionType.SET_USER_FULFILLED,
          payload: user,
        })

        history.push(user.state?.redirect ?? '/')
      })
      .catch(function(error) {
        // TODO: Handle error
        console.log('error in SIGNING', error)
      })
  }, [])

  return <Loading />
}
