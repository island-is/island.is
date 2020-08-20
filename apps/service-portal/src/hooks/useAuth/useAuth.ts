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

  return {
    userInfo,
    userInfoState,
    signInUser,
  }
}

export default useAuth
