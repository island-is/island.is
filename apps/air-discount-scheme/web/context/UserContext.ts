import { createContext } from 'react'

import { User } from '@island.is/air-discount-scheme-web/graphql/schema'

const UserContext = createContext({
  isAuthenticated: false,
  user: null as User,
  setUser: (_: User) => undefined,
})

export default UserContext
