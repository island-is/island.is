import { useEffect } from 'react'
import { User } from 'oidc-client'
import { setClientAuthToken } from '@island.is/application/graphql'
import { useLocation } from 'react-router-dom'

import { ActionType, useAuthState } from '../context/AuthProvider'
import { userManager } from '../utils/userManager'

const useAuth = () => {
  const [{ userInfo, userInfoState }, dispatch] = useAuthState()
  const { pathname, search } = useLocation()

  async function signInUser() {
    dispatch({
      type: ActionType.SET_USER_PENDING,
    })

    try {
      const user = await userManager.verifyAuthentication()

      if (user) {
        setClientAuthToken(user.access_token)

        dispatch({
          type: ActionType.SET_USER_FULFILLED,
          payload: user,
        })
      }
    } catch {
      await userManager.signinRedirect({
        state: { redirect: `${pathname}${search}` },
      })
    }
  }

  async function signOutUser() {
    await userManager.signoutRedirect()

    dispatch({
      type: ActionType.SET_USER_LOGGED_OUT,
    })
  }

  // Watch for silent renew and update client auth token.
  useEffect(() => {
    if (userInfoState !== 'fulfilled') {
      return
    }

    const userLoaded = (user: User) => {
      setClientAuthToken(user.access_token)
    }

    userManager.events.addUserLoaded(userLoaded)
    return () => userManager.events.removeUserLoaded(userLoaded)
  }, [userInfoState])

  return {
    userInfo,
    userInfoState,
    signInUser,
    signOutUser,
  }
}

export default useAuth
