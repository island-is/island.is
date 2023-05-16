import { createContext, FC, useContext, useState } from 'react'
import { useLoaderData } from 'react-router-dom'

import { AuthAdminEnvironment } from '@island.is/api/schema'

import { PermissionLoaderResult } from './Permission.loader'

type PermissionContextProps = {
  permission: PermissionLoaderResult
  selectedPermission: PermissionLoaderResult['environments'][0]
  onEnvironmentChange(environment: AuthAdminEnvironment): void
}

const PermissionContext = createContext<PermissionContextProps | undefined>(
  undefined,
)

export const PermissionProvider: FC = ({ children }) => {
  const permissionResult = useLoaderData() as PermissionLoaderResult

  const [selectedPermission, setSelectedPermission] = useState(
    permissionResult.environments.find(
      ({ environment }) =>
        environment === permissionResult.defaultEnvironment.name,
    ) ?? permissionResult.environments[0],
  )

  const onEnvironmentChange = (environment: AuthAdminEnvironment) => {
    console.log(`TDOO open modal`, environment)
  }

  return (
    <PermissionContext.Provider
      value={{
        permission: permissionResult,
        selectedPermission,
        onEnvironmentChange,
      }}
    >
      {children}
    </PermissionContext.Provider>
  )
}

export const usePermission = () => {
  const context = useContext(PermissionContext)

  if (!context) {
    throw new Error('usePermission must be used within a PermissionProvider')
  }

  return context
}
