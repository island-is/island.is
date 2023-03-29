import { createContext } from 'react'

export type User = {
  __typename?: 'User'
  name: string
}

const UserContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: (_: boolean) => undefined,
  user: null as User,
  setUser: (_: User) => undefined,
  loadingUser: false,
})

export default UserContext
