import { setClientAuthToken } from 'libs/application/graphql/src/lib/client'
import { useLocation } from 'react-router-dom'
import { ActionType, useAuthState } from '../context/AuthProvider'
import { userManager } from '../utils/userManager'

const useAuth = () => {
  const [{ userInfo, userInfoState }, dispatch] = useAuthState()
  const { pathname } = useLocation()
  async function signInUser() {
    dispatch({
      type: ActionType.SET_USER_PENDING,
    })

    try {
      const user = await userManager.signinSilent()
      setClientAuthToken(user.access_token)

      dispatch({
        type: ActionType.SET_USER_FULFILLED,
        payload: user,
      })
    } catch (exception) {
      await userManager.signinRedirect({ state: { redirect: pathname } })
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
