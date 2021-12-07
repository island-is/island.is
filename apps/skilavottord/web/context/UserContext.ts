import { createContext } from 'react'

export interface UserProvider {
  isAuthenticated?: boolean
  user?: any // not good, but better than not existing type... not sure about the current structure
  setUser?: React.Dispatch<React.SetStateAction<any | undefined>>
}

const UserContext = createContext<UserProvider>({})

export default UserContext
