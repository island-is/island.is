import React, {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useState,
} from 'react'
import {
  useActionData,
  useLoaderData,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'

import { AuthAdminEnvironment } from '@island.is/api/schema'
import { replaceParams } from '@island.is/react-spa/shared'

import { AuthAdminClient, AuthAdminClientEnvironment } from './Client.loader'
import { useEnvironmentQuery } from '../../hooks/useEnvironmentQuery'
import { IDSAdminPaths } from '../../lib/paths'
import { EditClientResult } from './EditClient.action'
import { PublishData } from '../../types/publishData'

export type ClientContextType = {
  client: AuthAdminClient
  selectedEnvironment: AuthAdminClientEnvironment
  availableEnvironments: AuthAdminEnvironment[] | null
  publishData: PublishData
  setPublishData: Dispatch<SetStateAction<PublishData>>
  onEnvironmentChange(environment: AuthAdminEnvironment): void
  /**
   * This is the result of the client action
   */
  actionData: EditClientResult | undefined
}

const ClientContext = createContext<ClientContextType | undefined>(undefined)

export const ClientProvider: FC = ({ children }) => {
  const navigate = useNavigate()
  const params = useParams()
  const [searchParams] = useSearchParams()
  const client = useLoaderData() as AuthAdminClient
  const actionData = useActionData() as EditClientResult
  const [publishData, setPublishData] = useState<PublishData>({
    toEnvironment: null,
    fromEnvironment: null,
  })
  const {
    environment: selectedEnvironment,
    updateEnvironment,
  } = useEnvironmentQuery(client.environments)

  const openPublishModal = (to: AuthAdminEnvironment) => {
    setPublishData({
      toEnvironment: to,
      fromEnvironment: selectedEnvironment.environment,
    })

    const env = searchParams.get('env')
    const href = replaceParams({
      href: IDSAdminPaths.IDSAdminClientPublish,
      params: {
        tenant: params['tenant'],
        client: selectedEnvironment.clientId,
      },
    })

    navigate(env ? `${href}?env=${env}` : href, { preventScrollReset: true })
  }

  const onEnvironmentChange = (environment: AuthAdminEnvironment) => {
    const newEnvironment = updateEnvironment(environment)

    if (!newEnvironment) {
      openPublishModal(environment)
    }
  }

  return (
    <ClientContext.Provider
      value={{
        client,
        selectedEnvironment,
        publishData,
        setPublishData,
        onEnvironmentChange,
        availableEnvironments: client.environments.map(
          (env) => env.environment,
        ),
        actionData,
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
