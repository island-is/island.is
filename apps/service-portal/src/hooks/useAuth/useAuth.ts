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
      userManager.signinRedirect()
    }
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
    mockSignIn,
  }
}

export default useAuth
