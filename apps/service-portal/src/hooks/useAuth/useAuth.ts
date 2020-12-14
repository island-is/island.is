import { useStore } from '../../store/stateProvider'
import { ActionType } from '../../store/actions'
import { userManager } from '../../utils/userManager'
import { setClientAuthToken } from '@island.is/service-portal/graphql'

const useAuth = () => {
  const [{ userInfo, userInfoState }, dispatch] = useStore()

  async function signInUser() {
    dispatch({
      type: ActionType.SetUserPending,
    })

    const user = await userManager.getUser()

    if (user) {
      dispatch({
        type: ActionType.SetUserFulfilled,
        payload: user,
      })
      setClientAuthToken(user.access_token)
    } else {
      userManager.signinRedirect({
        state: window.location.pathname,
      })
    }
  }

  async function signOutUser() {
    dispatch({
      type: ActionType.SetUserLoggingOut,
    })

    userManager.signoutRedirect()
  }

  return {
    userInfo,
    userInfoState,
    signInUser,
    signOutUser,
  }
}

export default useAuth
