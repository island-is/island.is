import { useStore } from '../../stateProvider'
import { setUserToken } from '../../auth/utils'
import jwtDecode from 'jwt-decode'

const useUserInfo = () => {
  const [{ userInfo, userInfoState }, dispatch] = useStore()

  const setUser = async (
    actorNationalId?: string,
    subjectNationalId?: string,
  ) => {
    async function fetchUserInfo() {
      dispatch({
        type: 'setUserPending',
      })

      const updatedInfo = await setUserToken(
        actorNationalId || userInfo?.actor?.nationalId,
        subjectNationalId,
      )

      dispatch({
        type: 'setUserFulfilled',
        payload: jwtDecode(updatedInfo.token),
      })
    }

    return fetchUserInfo()
  }

  return {
    userInfo,
    userInfoState,
    setUser,
  }
}

export default useUserInfo
