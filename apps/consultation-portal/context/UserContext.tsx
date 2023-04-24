import { createContext } from 'react'
import { User } from '../types/interfaces'

const UserContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: (_: boolean) => undefined,
  user: null as User,
  setUser: (_: User) => undefined,
  userLoading: false,
})

export default UserContext
