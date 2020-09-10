import { useStore } from '../../store/stateProvider'
import { ActionType } from '../../store/actions'
import { userManager } from '../../utils/userManager'

const useAuth = () => {
  const [{ userInfo, userInfoState }, dispatch] = useStore()

  async function signInUser() {
    dispatch({
      type: ActionType.SetUserPending,
    })

    try {
      const user = await userManager.signinSilent()
      dispatch({
        type: ActionType.SetUserFulfilled,
        payload: user,
      })
    } catch (exception) {
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

  async function mockSignIn() {
    dispatch({
      type: ActionType.SetUserPending,
    })
    try {
      const res = await fetch('/mock/authenticate')
      const json = await res.json()
      dispatch({
        type: ActionType.SetUserFulfilled,
        payload: json,
      })
    } catch (exception) {
      console.warn(`Error mocking login. ${exception}`)
    }
  }

  return {
    userInfo,
    userInfoState,
    signInUser,
    signOutUser,
    mockSignIn,
  }
}

export default useAuth
