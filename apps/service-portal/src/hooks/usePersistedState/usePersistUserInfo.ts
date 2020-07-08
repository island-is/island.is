import { useStateValue } from '../../stateProvider'
import { MockUserData, AsyncActionState } from '../../store'
import { useEffect } from 'react'
import { fetchToken } from '../../auth/utils'

export const usePersistedState = () => {
  const [{ userInfo, userInfoState }, dispatch] = useStateValue()

  useEffect(() => {
    if (!userInfo) {
      const fetchUserInfo = async () => {
        dispatch({
          type: 'fetchingUser',
        })
        const userInfo = await fetchToken()
        dispatch({
          type: 'setUser',
          payload: userInfo,
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
