import { createContext, useState, ReactNode, useContext } from 'react'
import { getUserFromDecodedJson, parseAuthToken } from '../utils/helpers'

export interface User {
  ssn: string
  name: string
  token: string
}

export interface UserProps {
  children: ReactNode
}

const UserContext = createContext({
  isAuthenticated: false,
  user: null as User,
  loginUser: (_) => undefined,
  logoutUser: () => undefined,
  persistLoginUser: (_) => undefined,
  setUserNull: () => undefined,
})

const UserContextProvider = ({ children }: UserProps) => {
  const [user, setUser] = useState<User>()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  const persistLoginUser = ({ token }) => {
    try {
      const thisUser = getUserFromDecodedJson({ token: token })
      if (thisUser) {
        setUser(thisUser)
        setIsAuthenticated(true)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const loginUser = ({ token }) => {
    try {
      const decodedJson = parseAuthToken({ token: token })

      const thisUser = {
        token: token,
        ssn: decodedJson.user_ssn,
        name: decodedJson.full_name,
      }

      const body = JSON.stringify({
        token: token,
        expiry: decodedJson.exp,
      })

      const setCookie =
        typeof window !== 'undefined' &&
        fetch(`${window.location.origin}/consultation-portal/api/auth/login`, {
          method: 'POST',
          body: body,
        })

      setUser(thisUser)
      setIsAuthenticated(true)
    } catch (e) {
      console.error(e)
    }
  }

  const setUserNull = () => {
    setUser(null)
    setIsAuthenticated(false)
  }

  const logoutUser = async () => {
    const setCookie =
      typeof window !== 'undefined' &&
      (await fetch(
        `${window.location.origin}/consultation-portal/api/auth/logout`,
        {
          method: 'GET',
        },
      ))
    if (setCookie.status === 200) {
      setUserNull()
    }
  }

  return (
    <UserContext.Provider
      value={{
        isAuthenticated,
        user,
        loginUser,
        logoutUser,
        persistLoginUser,
        setUserNull,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)

export default UserContextProvider
