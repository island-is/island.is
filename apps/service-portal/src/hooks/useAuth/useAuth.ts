import { useStore } from '../../store/stateProvider'
import { ActionType } from '../../store/actions'
import { userManager } from '../../utils/userManager'

const useAuth = () => {
  const [{ userInfo, userInfoState }, dispatch] = useStore()

  async function signInUser() {
    dispatch({
      type: ActionType.SetUserPending,
    })

    userManager.signinRedirect({
      state: window.location.pathname,
    })
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
