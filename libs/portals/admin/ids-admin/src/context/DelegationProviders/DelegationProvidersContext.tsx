import { createContext, FC, PropsWithChildren, useContext } from 'react'

import {
  AuthAdminEnvironment,
  AuthAdminDelegationProvider,
} from '@island.is/api/schema'
import { useGetDelegationProvidersQuery } from './DelegationProviders.generated'

interface DelegationProvidersValues {
  getDelegationProviders(
    environment: AuthAdminEnvironment,
  ): AuthAdminDelegationProvider[]
  loading: boolean
  error: boolean
}

export const DelegationProvidersContext = createContext<
  DelegationProvidersValues | undefined
>(undefined)

export const DelegationProvidersProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const { data, loading, error } = useGetDelegationProvidersQuery()

  const getDelegationProviders = (environment: AuthAdminEnvironment) => {
    if (data) {
      return (
        data.authDelegationProviders.environments.find(
          (env) => env.environment === environment,
        )?.providers ?? []
      )
    }

    return []
  }

  return (
    <DelegationProvidersContext.Provider
      value={{ getDelegationProviders, loading, error: !!error }}
    >
      {children}
    </DelegationProvidersContext.Provider>
  )
}

export const useDelegationProviders = () => {
  const context = useContext(DelegationProvidersContext)

  if (context === undefined) {
    throw new Error(
      'useDelegationProviders must be used within a DelegationProvidersProvider',
    )
  }

  return context
}
