import { createContext } from 'react'
import { User } from '../types/interfaces'

const UserContext = createContext({
  isAuthenticated: false,
  user: null as User,
  userLoading: false,
})

export default UserContext
