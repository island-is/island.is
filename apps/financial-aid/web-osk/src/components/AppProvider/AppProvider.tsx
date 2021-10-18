import React, { createContext, ReactNode } from 'react'

import {
  Application,
  Municipality,
  User,
} from '@island.is/financial-aid/shared/lib'

import { useMunicipality } from '@island.is/financial-aid/shared/components'
import useMyApplication from '@island.is/financial-aid-web/osk/src/utils/hooks/useMyApplication'
import useUser from '@island.is/financial-aid-web/osk/src/utils/hooks/useUser'
import { ServiceCenter } from '@island.is/financial-aid/shared/data'
import { ApolloError } from 'apollo-client'

interface AppProvider {
  myApplication?: Application
  loading: boolean
  error?: ApolloError
  municipality?: Municipality
  setMunicipality: (municipalityId: string) => Promise<void>
  isAuthenticated?: boolean
  user?: User
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>
  userServiceCenter?: ServiceCenter
}

interface Props {
  children: ReactNode
}

export const AppContext = createContext<AppProvider>({
  loading: true,
  setUser: () => undefined,
  setMunicipality: () => Promise.resolve(),
})

const AppProvider = ({ children }: Props) => {
  const { municipality, setMunicipality } = useMunicipality()

  const { myApplication, error, loading } = useMyApplication()

  const { isAuthenticated, user, setUser, userServiceCenter } = useUser()

  return (
    <AppContext.Provider
      value={{
        myApplication,
        error,
        loading,
        municipality,
        setMunicipality,
        isAuthenticated,
        user,
        setUser,
        userServiceCenter,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export default AppProvider
