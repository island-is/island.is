import { useStateValue } from '../../stateProvider'
import { MockUserData, AsyncActionState } from '../../store'
import { useEffect } from 'react'
import { fetchToken } from '../../auth/utils'

export const useUserInfo = () => {
  const [{ userInfo, userInfoState }, dispatch] = useStateValue()

  const fetchUser = async () => {
    dispatch({
      type: 'fetchingUser',
    })
    const userInfo = await fetchToken()
    dispatch({
      type: 'setUser',
      payload: userInfo,
    })
  }

  useEffect(() => {
    if (!userInfo) fetchUser()
  })

  return {
    userInfo: userInfo as MockUserData | null,
    userInfoState: userInfoState as AsyncActionState,
  }
}
