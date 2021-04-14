import { useStore } from '../../store/stateProvider'
import { ActionType } from '../../store/actions'
import { userManager } from '../../utils/userManager'
import { setClientAuthToken } from '../../graphql/client'

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

  return {
    userInfo,
    userInfoState,
    signInUser,
    signOutUser,
  }
}

export default useAuth
