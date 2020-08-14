import { createContext } from 'react'

import { AuthUser } from '@island.is/air-discount-scheme-web/graphql/schema'

const UserContext = createContext({
  isAuthenticated: false,
  user: null as AuthUser,
  setUser: (_: AuthUser) => undefined,
})

export default UserContext
