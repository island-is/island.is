import { createContext } from 'react'
import { MockUser } from '../types'

const UserContext = createContext({
  isAuthenticated: false,
  user: null as MockUser,
  setUser: (_: MockUser) => undefined,
})

export default UserContext
