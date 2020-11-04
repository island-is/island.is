import { createContext } from 'react'
import { User } from '@island.is/judicial-system/types'

const userContext = createContext({
  isAuthenticated: (): boolean => false,
  user: null as User,
  setUser: (_: User) => undefined,
})

export { userContext }
