import React, { createContext, ReactNode } from 'react'

import {
  Application,
  Municipality,
  User,
} from '@island.is/financial-aid/shared/lib'

import { ApolloError } from 'apollo-client'

import useMuncipality from '@island.is/financial-aid-web/osk/src/utils/hooks/useMuncipality'
import useMyApplication from '@island.is/financial-aid-web/osk/src/utils/hooks/useMyApplication'
import useUser from '@island.is/financial-aid-web/osk/src/utils/hooks/useUser'
import { ServiceCenter } from '@island.is/financial-aid/shared/data'

interface AppProvider {
  myApplication?: Application
  loading?: boolean
  error?: ApolloError
  municipality?: Municipality
  isAuthenticated?: boolean
  user?: User
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>
  userServiceCenter?: ServiceCenter
  loadingUser?: boolean
}

interface Props {
  children: ReactNode
}

export const AppContext = createContext<AppProvider>({
  setUser: () => undefined,
})

const AppProvider = ({ children }: Props) => {
  const municipality = useMuncipality()

  const { myApplication, error, loading } = useMyApplication()

  const {
    isAuthenticated,
    user,
    setUser,
    loadingUser,
    userServiceCenter,
  } = useUser()

  return (
    <AppContext.Provider
      value={{
        myApplication,
        error,
        loading,
        municipality,
        isAuthenticated,
        user,
        setUser,
        userServiceCenter,
        loadingUser,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export default AppProvider
