import { useEffect } from 'react'
import { useAuth } from '../Authenticator/AuthContext'

export const useCheckAuth = () => {
  const { userInfo, autoLogin, checkLogin } = useAuth()

  // Find existing authentication or start login flow.
  useEffect(() => {
    if (!userInfo) {
      console.log('CheckAuth useEffect checkLogin()')
      checkLogin()
    }
  }, [])

  return !!(!autoLogin || userInfo)
}
