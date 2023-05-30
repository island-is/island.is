import React, {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useState,
} from 'react'
import { useLoaderData, useNavigate, useParams } from 'react-router-dom'

import { AuthAdminEnvironment } from '@island.is/api/schema'
import { replaceParams } from '@island.is/react-spa/shared'

import { AuthAdminClient, AuthAdminClientEnvironment } from './Client.loader'
import { ClientFormTypes } from './EditClient.action'
import { useEnvironmentQuery } from '../../hooks/useEnvironmentQuery'
import { IDSAdminPaths } from '../../lib/paths'
import { checkEnvironmentSync } from '../../utils/checkEnvironmentSync'

type PublishData = {
  toEnvironment: AuthAdminEnvironment | null
  fromEnvironment: AuthAdminEnvironment | null
}

type VariablesToCheckSync = {
  [key in ClientFormTypes]: Array<keyof AuthAdminClientEnvironment>
}

const variablesToCheckSync: VariablesToCheckSync = {
  [ClientFormTypes.applicationUrls]: ['postLogoutRedirectUris', 'redirectUris'],
  [ClientFormTypes.lifeTime]: [
    'absoluteRefreshTokenLifetime',
    'slidingRefreshTokenLifetime',
    'refreshTokenExpiration',
  ],
  [ClientFormTypes.translations]: ['displayName'],
  [ClientFormTypes.delegations]: [
    'supportsProcuringHolders',
    'supportsLegalGuardians',
    'promptDelegations',
    'supportsPersonalRepresentatives',
    'supportsCustomDelegation',
    'requireApiScopes',
  ],
  [ClientFormTypes.advancedSettings]: [
    'requirePkce',
    'allowOfflineAccess',
    'requireConsent',
    'supportTokenExchange',
    'slidingRefreshTokenLifetime',
    'customClaims',
  ],
  [ClientFormTypes.permissions]: [],
  [ClientFormTypes.none]: [],
}

type Variables = typeof variablesToCheckSync[keyof typeof variablesToCheckSync]

export type ClientContextType = {
  client: AuthAdminClient
  selectedEnvironment: AuthAdminClientEnvironment
  availableEnvironments: AuthAdminEnvironment[] | null
  variablesToCheckSync?: typeof variablesToCheckSync
  publishData: {
    toEnvironment?: AuthAdminEnvironment | null
    fromEnvironment?: AuthAdminEnvironment | null
  }
  setPublishData: Dispatch<SetStateAction<PublishData>>
  checkIfInSync(variables: Variables): boolean
  onEnvironmentChange(environment: AuthAdminEnvironment): void
}

const ClientContext = createContext<ClientContextType | undefined>(undefined)

export const ClientProvider: FC = ({ children }) => {
  const navigate = useNavigate()
  const params = useParams()
  const client = useLoaderData() as AuthAdminClient
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
    navigate(
      replaceParams({
        href: IDSAdminPaths.IDSAdminClientPublish,
        params: {
          tenant: params['tenant'],
          client: selectedEnvironment.clientId,
        },
      }),
      { preventScrollReset: true },
    )
  }

  const checkIfClientEnvInSync = (
    variables: typeof variablesToCheckSync[keyof typeof variablesToCheckSync],
  ) =>
    checkEnvironmentSync({
      environments: client.environments,
      selectedEnvironment,
      variables,
    })

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
        checkIfInSync: checkIfClientEnvInSync,
        variablesToCheckSync,
        publishData,
        setPublishData,
        onEnvironmentChange,
        availableEnvironments: client.environments.map(
          (env) => env.environment,
        ),
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
