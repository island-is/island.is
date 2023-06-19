import { createContext, FC, useContext, useState } from 'react'
import { useActionData, useLoaderData } from 'react-router-dom'

import { AuthAdminEnvironment } from '@island.is/api/schema'

import { useEnvironmentQuery } from '../../hooks/useEnvironmentQuery'
import { PermissionLoaderResult } from './Permission.loader'
import { EditPermissionResult } from './EditPermission.action'
import { PermissionFormTypes } from './EditPermission.schema'
import { PublishData } from '../../types/publishData'

type PermissionContextProps = {
  /**
   * Permission result loader query
   */
  permission: PermissionLoaderResult
  /**
   * Selected environment
   */
  selectedPermission: PermissionLoaderResult['environments'][0]
  /**
   * This is the result of the permission action
   */
  actionData: EditPermissionResult | undefined
  /**
   * This is the intent of the permission action, i.e. specific section of the form
   */
  intent: keyof typeof PermissionFormTypes
  onEnvironmentChange(environment: AuthAdminEnvironment): void
  publishData: PublishData
}

const PermissionContext = createContext<PermissionContextProps | undefined>(
  undefined,
)

export const PermissionProvider: FC = ({ children }) => {
  const permissionResult = useLoaderData() as PermissionLoaderResult
  const actionData = useActionData() as EditPermissionResult
  const [publishData, setPublishData] = useState<PublishData>({
    toEnvironment: null,
    fromEnvironment: null,
  })
  const {
    environment: selectedPermission,
    updateEnvironment,
  } = useEnvironmentQuery(permissionResult.environments)

  const onEnvironmentChange = (environment: AuthAdminEnvironment) => {
    const toEnvironment = updateEnvironment(environment)

    if (!toEnvironment) {
      setPublishData({
        toEnvironment: selectedPermission.environment,
        fromEnvironment: environment,
      })
    }
  }

  return (
    <PermissionContext.Provider
      value={{
        permission: permissionResult,
        selectedPermission,
        onEnvironmentChange,
        actionData,
        intent: actionData?.intent,
        publishData,
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
