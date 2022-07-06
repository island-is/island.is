import { createContext } from 'react'

import { User } from '@island.is/air-discount-scheme-web/graphql/schema'

const UserContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: (_: boolean) => undefined,
  user: null as User,
  setUser: (_: User) => undefined,
  loadingUser: false,
})

export default UserContext
