import { createContext } from 'react'
import { User } from '../types'

const UserContext = createContext({
  isAuthenticated: false,
  user: null as User,
  setUser: (_: User) => undefined,
})

export default UserContext
