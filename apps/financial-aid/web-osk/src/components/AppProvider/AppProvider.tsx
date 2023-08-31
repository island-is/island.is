import React, { createContext, ReactNode } from 'react'

import {
  Application,
  Municipality,
  NationalRegistryData,
  User,
} from '@island.is/financial-aid/shared/lib'

import useMyApplication from '@island.is/financial-aid-web/osk/src/utils/hooks/useMyApplication'
import useUser from '@island.is/financial-aid-web/osk/src/utils/hooks/useUser'
import { ApolloError } from '@apollo/client'
import useNationalRegistry from '@island.is/financial-aid-web/osk/src/utils/hooks/useNationalRegistry'
import { useMunicipality } from '@island.is/financial-aid-web/osk/src/utils/hooks/useMunicipality'

interface AppProvider {
  myApplication?: Application
  updateApplication: React.Dispatch<
    React.SetStateAction<Application | undefined>
  >
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
  loadingMunicipality: boolean
  nationalRegistryData?: NationalRegistryData
  setNationalRegistryData: (data: NationalRegistryData) => void
}

interface Props {
  children: ReactNode
}

export const AppContext = createContext<AppProvider>({
  updateApplication: () => undefined,
  setUser: () => undefined,
  setMunicipalityById: () => Promise.resolve(undefined),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setNationalRegistryData: () => {},
  loading: false,
  loadingUser: false,
  loadingMunicipality: false,
})

const AppProvider = ({ children }: Props) => {
  const {
    municipality,
    setMunicipalityById,
    loading: loadingMunicipality,
  } = useMunicipality()

  const { isAuthenticated, user, setUser, loadingUser } = useUser()

  const { myApplication, error, loading, updateApplication } =
    useMyApplication()

  const { nationalRegistryData, setNationalRegistryData } =
    useNationalRegistry()

  return (
    <AppContext.Provider
      value={{
        myApplication,
        updateApplication,
        error,
        loading,
        municipality,
        setMunicipalityById,
        loadingMunicipality,
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
