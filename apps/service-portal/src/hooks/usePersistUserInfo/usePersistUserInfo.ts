import { useStore } from '../../stateProvider'
import { MockUserData, AsyncActionState } from '../../store'
import { useEffect } from 'react'
import { fetchToken } from '../../auth/utils'
import jwtDecode from 'jwt-decode'

export const usePersistUserInfo = () => {
  const [{ userInfo, userInfoState }, dispatch] = useStore()

  useEffect(() => {
    if (!userInfo) {
      const fetchUserInfo = async () => {
        dispatch({
          type: 'fetchingUser',
        })
        const userInfo = await fetchToken()
        dispatch({
          type: 'setUser',
          payload: jwtDecode(userInfo.token),
        })
      }
      fetchUserInfo()
    }
  }, [userInfo, dispatch])

  return {
    userInfo: userInfo as MockUserData | null,
    userInfoState: userInfoState as AsyncActionState,
  }
}
