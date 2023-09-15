import { createContext, FC, useContext, useEffect, useState } from 'react'
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
  publishData: PublishData | null
  updatePublishData(publishData: PublishData): void
  onEnvironmentChange(environment: AuthAdminEnvironment): void
  changeEnvironment(environment: AuthAdminEnvironment): void
}

const PermissionContext = createContext<PermissionContextProps | undefined>(
  undefined,
)

export const PermissionProvider: FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const permissionResult = useLoaderData() as PermissionLoaderResult
  const actionData = useActionData() as EditPermissionResult
  const [publishData, setPublishData] = useState<PublishData | null>(null)

  const { environment: selectedPermission, updateEnvironment } =
    useEnvironmentQuery(permissionResult.environments)

  const [currentEnvironment, setCurrentEnvironment] =
    useState<AuthAdminEnvironment>(selectedPermission.environment)

  const onEnvironmentChange = (environment: AuthAdminEnvironment) => {
    const newEnvironment = updateEnvironment(environment)

    if (!newEnvironment) {
      setPublishData({
        toEnvironment: environment,
        fromEnvironment: selectedPermission.environment,
      })
    }
  }

  const changeEnvironment = (environment: AuthAdminEnvironment) => {
    setCurrentEnvironment(environment)
    updateEnvironment(environment)
  }

  const updatePublishData = (publishData: PublishData) => {
    setPublishData(publishData)
  }

  useEffect(() => {
    if (
      permissionResult &&
      selectedPermission.environment !== currentEnvironment
    ) {
      updateEnvironment(currentEnvironment)
    }
  }, [permissionResult])

  return (
    <PermissionContext.Provider
      value={{
        permission: permissionResult,
        selectedPermission,
        onEnvironmentChange,
        actionData,
        intent: actionData?.intent,
        publishData,
        updatePublishData,
        changeEnvironment,
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
