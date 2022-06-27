import { createContext } from 'react'

import { SkilavottordUser } from '@island.is/skilavottord-web/graphql/schema'

export interface UserProvider {
  isAuthenticated?: boolean
  user?: SkilavottordUser
  setUser?: React.Dispatch<React.SetStateAction<SkilavottordUser | undefined>>
}

const UserContext = createContext<UserProvider>({})

export default UserContext
