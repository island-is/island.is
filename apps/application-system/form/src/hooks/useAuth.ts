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

    const user = await userManager.getUser()
    if (user) {
      setClientAuthToken(user.access_token)
      dispatch({
        type: ActionType.SET_USER_FULFILLED,
        payload: user,
      })
    } else {
      try {
        const userSilentlySignedIn = await userManager.signinSilent()
        setClientAuthToken(userSilentlySignedIn.access_token)
        dispatch({
          type: ActionType.SET_USER_FULFILLED,
          payload: userSilentlySignedIn,
        })
      } catch (exception) {
        await userManager.signinRedirect({
          state: { redirect: `${pathname}${search}` },
        })
      }
    }
  }

  async function signOutUser() {
    await userManager.signoutRedirect()

    dispatch({
      type: ActionType.SET_USER_LOGGED_OUT,
    })
  }

  return {
    userInfo,
    userInfoState,
    signInUser,
    signOutUser,
  }
}

export default useAuth
