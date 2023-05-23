import { createContext, FC, useContext, useState } from 'react'
import { useActionData, useLoaderData } from 'react-router-dom'

import { AuthAdminEnvironment } from '@island.is/api/schema'

import { PermissionLoaderResult } from '../../screens/PermissionScreen/Permission.loader'
import {
  PermissionFormTypes,
  UpdatePermissionResult,
} from '../forms/EditPermission/EditPermission.action'

type PermissionContextProps = {
  /**
   * Permission result loader query
   */
  permission: PermissionLoaderResult
  /**
   * Selected environment
   */
  selectedPermission: PermissionLoaderResult['environments'][0]
  onEnvironmentChange(environment: AuthAdminEnvironment): void
  /**
   * This is the result of the permission action
   */
  actionData: UpdatePermissionResult | undefined
  /**
   * This is the intent of the permission action, i.e. specific section of the form
   */
  intent: keyof typeof PermissionFormTypes
}

const PermissionContext = createContext<PermissionContextProps | undefined>(
  undefined,
)

export const PermissionProvider: FC = ({ children }) => {
  const permissionResult = useLoaderData() as PermissionLoaderResult
  const actionData = useActionData() as UpdatePermissionResult
  const [selectedPermission, setSelectedPermission] = useState(
    permissionResult.environments.find(
      ({ environment }) =>
        environment === permissionResult.defaultEnvironment.name,
    ) ?? permissionResult.environments[0],
  )

  const onEnvironmentChange = (env: AuthAdminEnvironment) => {
    const newSelectedPermission = permissionResult.environments.find(
      ({ environment }) => environment === env,
    )

    if (newSelectedPermission) {
      setSelectedPermission(newSelectedPermission)
    }
  }

  return (
    <PermissionContext.Provider
      value={{
        permission: permissionResult,
        selectedPermission,
        onEnvironmentChange,
        actionData,
        intent: actionData?.intent ?? PermissionFormTypes.NONE,
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
