import { useStateValue } from '../../stateProvider'
import { MockUserData, AsyncActionState } from '../../store'
import { useEffect } from 'react'
import { fetchToken } from '../../auth/utils'
import jwtDecode from 'jwt-decode'

interface Subject {
  accountType: string
  email: string
  name: string
  nationalId: string
  phone: string
  scope: string[]
}

interface DecodedJwtToken {
  user: string
  availableSubjects: Subject[]
  id: number
  nationalId: string
}

export const usePersistUserInfo = () => {
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
