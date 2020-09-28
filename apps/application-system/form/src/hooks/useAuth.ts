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

      dispatch({
        type: ActionType.SET_USER_FULFILLED,
        payload: user,
      })
    } catch (exception) {
      await userManager.signinRedirect({ state: { redirect: pathname } })
    }
  }

  return {
    userInfo,
    userInfoState,
    signInUser,
  }
}

export default useAuth
