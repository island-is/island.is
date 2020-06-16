import { createContext } from 'react'

import { AuthUser } from '@island.is/gjafakort-web/graphql/schema'

export const UserContext = createContext({
  isAuthenticated: false,
  user: null as AuthUser,
  setAuth: (_1: AuthUser, _2: boolean) => {},
  loading: false,
})
