import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useActionData, useLoaderData } from 'react-router-dom'

import { AuthAdminEnvironment } from '@island.is/api/schema'

import { AuthAdminClient, AuthAdminClientEnvironment } from './Client.loader'
import { useEnvironmentQuery } from '../../hooks/useEnvironmentQuery'
import { EditClientResult } from './EditClient.action'
import { PublishData } from '../../types/publishData'

export type ClientContextType = {
  client: AuthAdminClient
  selectedEnvironment: AuthAdminClientEnvironment
  availableEnvironments: AuthAdminEnvironment[] | null
  /**
   * This is the result of the client action
   */
  actionData: EditClientResult | undefined
  publishData: PublishData | null
  updatePublishData(publishData: PublishData): void
  onEnvironmentChange(environment: AuthAdminEnvironment): void
  changeEnvironment(environment: AuthAdminEnvironment): void
}

const ClientContext = createContext<ClientContextType | undefined>(undefined)

export const ClientProvider: FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const clientResult = useLoaderData() as AuthAdminClient
  const actionData = useActionData() as EditClientResult
  const [publishData, setPublishData] = useState<PublishData | null>(null)
  const { environment: selectedEnvironment, updateEnvironment } =
    useEnvironmentQuery(clientResult.environments)

  const [currentEnvironment, setCurrentEnvironment] =
    useState<AuthAdminEnvironment>(selectedEnvironment.environment)

  const onEnvironmentChange = (environment: AuthAdminEnvironment) => {
    const newEnvironment = updateEnvironment(environment)

    if (!newEnvironment) {
      setPublishData({
        toEnvironment: environment,
        fromEnvironment: selectedEnvironment.environment,
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
      clientResult &&
      selectedEnvironment.environment !== currentEnvironment
    ) {
      updateEnvironment(currentEnvironment)
    }
  }, [clientResult])

  return (
    <ClientContext.Provider
      value={{
        client: clientResult,
        selectedEnvironment,
        publishData,
        onEnvironmentChange,
        availableEnvironments: clientResult.availableEnvironments,
        actionData,
        updatePublishData,
        changeEnvironment,
      }}
    >
      {children}
    </ClientContext.Provider>
  )
}

export const useClient = () => {
  const context = useContext(ClientContext)

  if (context === undefined) {
    throw new Error('useClient must be used within a ClientProvider')
  }

  return context
}
