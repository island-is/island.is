import { createContext } from 'react'

import { AuthUser } from '@island.is/gjafakort-web/graphql/schema'

const UserContext = createContext({
  isAuthenticated: false,
  user: null as AuthUser,
  setUser: (_: AuthUser) => {},
})

export default UserContext
