import { createContext } from 'react'
import { User } from '../types'

export interface UserProvider {
  isAuthenticated?: boolean
  user?: User
  setUser?: React.Dispatch<React.SetStateAction<User | undefined>>
}

const UserContext = createContext<UserProvider>({})

export default UserContext
