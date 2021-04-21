import { useEffect } from 'react'
import { User } from 'oidc-client'
import { setClientAuthToken } from '@island.is/service-portal/graphql'
import { useStore } from '../../store/stateProvider'
import { ActionType } from '../../store/actions'
import { userManager } from '../../utils/userManager'

const useAuth = () => {
  const [{ userInfo, userInfoState }, dispatch] = useStore()

  async function signInUser() {
    dispatch({
      type: ActionType.SetUserPending,
    })

    const user = await userManager.verifyAuthentication()

    if (user) {
      setClientAuthToken(user.access_token)
      dispatch({
        type: ActionType.SetUserFulfilled,
        payload: user,
      })
    } else {
      userManager.signinRedirect({
        state: window.location.pathname,
      })
    }
  }

  async function signOutUser() {
    await userManager.signoutRedirect()
    dispatch({
      type: ActionType.SetUserLoggingOut,
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
