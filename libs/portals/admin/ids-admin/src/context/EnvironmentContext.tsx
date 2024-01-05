import { createContext, FC, useContext } from 'react'

import { AuthAdminEnvironment } from '@island.is/api/schema'

interface EnvironmentContextValues {
  selectedEnvironment: AuthAdminEnvironment
  availableEnvironments: AuthAdminEnvironment[]
}

export const EnvironmentContext = createContext<
  EnvironmentContextValues | undefined
>(undefined)

export const EnvironmentProvider: FC<
  React.PropsWithChildren<EnvironmentContextValues>
> = ({ availableEnvironments, selectedEnvironment, children }) => {
  return (
    <EnvironmentContext.Provider
      value={{
        selectedEnvironment,
        availableEnvironments,
      }}
    >
      {children}
    </EnvironmentContext.Provider>
  )
}

export const useEnvironment = () => {
  const context = useContext(EnvironmentContext)

  if (context === undefined) {
    throw new Error('useEnvironment must be used within a EnvironmentProvider')
  }

  return context
}
