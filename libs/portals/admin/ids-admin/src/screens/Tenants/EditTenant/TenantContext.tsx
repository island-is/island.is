import React, { createContext, FC, useContext, useState } from 'react'
import { useActionData, useLoaderData } from 'react-router-dom'

import { AuthAdminEnvironment } from '@island.is/api/schema'

import { useEnvironmentQuery } from '../../../hooks/useEnvironmentQuery'
import { PublishData } from '../../../types/publishData'
import type { EditTenantActionResult } from './EditTenant.action'
import type {
  EditTenantLoaderResult,
  EditTenantEnvironment,
} from './EditTenant.loader'

export type TenantContextType = {
  tenant: EditTenantLoaderResult
  selectedEnvironment: EditTenantEnvironment
  availableEnvironments: AuthAdminEnvironment[]
  /**
   * Result of the edit tenant action – exposed so individual FormCards can
   * surface field-level errors mirroring the client context.
   */
  actionData: EditTenantActionResult | undefined
  publishData: PublishData | null
  updatePublishData(publishData: PublishData): void
  onEnvironmentChange(environment: AuthAdminEnvironment): void
  changeEnvironment(environment: AuthAdminEnvironment): void
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export const TenantProvider: FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const tenant = useLoaderData() as EditTenantLoaderResult
  const actionData = useActionData() as EditTenantActionResult | undefined
  const [publishData, setPublishData] = useState<PublishData | null>(null)
  const { environment: selectedEnvironment, updateEnvironment } =
    useEnvironmentQuery(tenant.environments)

  const onEnvironmentChange = (environment: AuthAdminEnvironment) => {
    const newEnvironment = updateEnvironment(environment)

    if (!newEnvironment) {
      // The selected env does not exist yet – prompt the publish flow so the
      // super admin can copy from a populated env.
      setPublishData({
        toEnvironment: environment,
        fromEnvironment: selectedEnvironment.environment,
      })
    }
  }

  const changeEnvironment = (environment: AuthAdminEnvironment) => {
    updateEnvironment(environment)
  }

  const updatePublishData = (publishData: PublishData) => {
    setPublishData(publishData)
  }

  return (
    <TenantContext.Provider
      value={{
        tenant,
        selectedEnvironment,
        availableEnvironments: tenant.availableEnvironments,
        actionData,
        publishData,
        onEnvironmentChange,
        changeEnvironment,
        updatePublishData,
      }}
    >
      {children}
    </TenantContext.Provider>
  )
}

export const useTenant = () => {
  const context = useContext(TenantContext)

  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider')
  }

  return context
}
