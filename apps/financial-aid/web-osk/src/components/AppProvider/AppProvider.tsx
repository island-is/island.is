import React, { createContext, ReactNode } from 'react'

import {
  Application,
  Municipality,
  NationalRegistryData,
  ServiceCenter,
  User,
} from '@island.is/financial-aid/shared/lib'

import { useMunicipality } from '@island.is/financial-aid/shared/components'
import useMyApplication from '@island.is/financial-aid-web/osk/src/utils/hooks/useMyApplication'
import useUser from '@island.is/financial-aid-web/osk/src/utils/hooks/useUser'
import { ApolloError } from 'apollo-client'
import useNationalRegistry from '@island.is/financial-aid-web/osk/src/utils/hooks/useNationalRegistry'

interface AppProvider {
  myApplication?: Application
  loading: boolean
  error?: ApolloError
  municipality?: Municipality
  setMunicipalityById: (
    municipalityId: string,
  ) => Promise<Municipality | undefined>
  isAuthenticated?: boolean
  user?: User
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>
  loadingUser: boolean
  nationalRegistryData?: NationalRegistryData
  setNationalRegistryData: (data: NationalRegistryData) => void
}

interface Props {
  children: ReactNode
}

export const AppContext = createContext<AppProvider>({
  setUser: () => undefined,
  setMunicipalityById: () => Promise.resolve(undefined),
  setNationalRegistryData: () => {},
  loading: false,
  loadingUser: false,
})

const AppProvider = ({ children }: Props) => {
  const { municipality, setMunicipalityById } = useMunicipality()

  const { isAuthenticated, user, setUser, loadingUser } = useUser()

  const { myApplication, error, loading } = useMyApplication()

  const {
    nationalRegistryData,
    setNationalRegistryData,
  } = useNationalRegistry()

  return (
    <AppContext.Provider
      value={{
        myApplication,
        error,
        loading,
        municipality,
        setMunicipalityById,
        isAuthenticated,
        user,
        loadingUser,
        setUser,
        nationalRegistryData,
        setNationalRegistryData,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export default AppProvider
