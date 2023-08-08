import { AuthSession } from '@island.is/next-ids-auth'
import { useSession } from 'next-auth/client'
import { useEffect, useState } from 'react'
import { User } from '../types/interfaces'
import useLogIn from './useLogin'

export const useUser = () => {
  const [user, setUser] = useState<User>()
  const [session, loading] = useSession() as [AuthSession, boolean]
  const [firstRun, setFirstRun] = useState(true)
  const LogIn = useLogIn()

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    Boolean(session?.user),
  )

  const keyExists = ({ keyBegin }) => {
    if (typeof window !== 'undefined') {
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith(keyBegin)) {
          const item = sessionStorage.getItem(key)
          const item_json = JSON.parse(item)
          const currDate = Math.floor(new Date().getTime() / 1000)
          if (item_json.expires_at > currDate) {
            LogIn()
          }
        }
      })
    }
    setFirstRun(false)
  }

  useEffect(() => {
    if (!user && !session?.user && firstRun) {
      keyExists({ keyBegin: 'sp.user:' })
    }

    if (!user && session?.user) {
      setUser(session?.user)
      setIsAuthenticated(Boolean(session?.user))
    }
  }, [setUser, session, user])

  return {
    isAuthenticated,
    setIsAuthenticated,
    user,
    setUser,
    userLoading: loading,
  }
}

export default useUser
