import { createContext, useState, ReactNode, useContext } from 'react'
import { parseAuthToken } from '../utils/helpers'

export interface User {
  ssn: string
  name: string
  token: string
}

export interface UserProps {
  children: ReactNode
  token?: string
}

const UserContext = createContext({
  isAuthenticated: false,
  user: null as User,
  loginUser: (_) => undefined,
  logoutUser: () => undefined,
})

const UserContextProvider = ({ children, token }: UserProps) => {
  const [user, setUser] = useState<User>()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  if (token && !isAuthenticated && !user) {
    const decodedJson = parseAuthToken({ token: token })
    const thisUser = {
      token: token,
      ssn: decodedJson.user_ssn,
      name: decodedJson.full_name,
    }
    setUser(thisUser)
    setIsAuthenticated(true)
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

      const setCookie = fetch('http://localhost:4200/api/auth/login', {
        method: 'POST',
        body: body,
      })

      setUser(thisUser)
      setIsAuthenticated(true)
    } catch (e) {
      console.error('error logging in user')
    }
  }

  const logoutUser = async () => {
    const setCookie = await fetch(`http://localhost:4200/api/auth/logout`, {
      method: 'GET',
    })
    if (setCookie.status === 200) {
      setUser(null)
      setIsAuthenticated(false)
      window.location.href = '/'
    }
  }

  return (
    <UserContext.Provider
      value={{
        isAuthenticated,
        user,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)

export default UserContextProvider
