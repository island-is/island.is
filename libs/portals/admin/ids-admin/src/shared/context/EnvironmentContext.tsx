import { createContext, FC } from 'react'

import { AuthAdminEnvironment } from '@island.is/api/schema'

interface EnvironmentContextValues {
  /**
   * Selected environment
   */
  selectedEnvironment: AuthAdminEnvironment
}

export const EnvironmentContext = createContext<
  EnvironmentContextValues | undefined
>(undefined)

type EnvironmentProviderProps = EnvironmentContextValues

export const EnvironmentProvider: FC<EnvironmentProviderProps> = ({
  selectedEnvironment,
  children,
}) => (
  <EnvironmentContext.Provider
    value={{
      selectedEnvironment,
    }}
  >
    {children}
  </EnvironmentContext.Provider>
)
