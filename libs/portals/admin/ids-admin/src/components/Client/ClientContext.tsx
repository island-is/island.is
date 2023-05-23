import React, {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useState,
} from 'react'
import { useLoaderData } from 'react-router-dom'

import { AuthAdminEnvironment } from '@island.is/api/schema'

import { AuthAdminClient } from '../../screens/Client/Client.loader'
import { ClientFormTypes } from '../../components/forms/EditApplication/EditApplication.action'
import { useEnvironment } from '../../shared/hooks/useEnvironment'

export type PublishData = {
  toEnvironment: AuthAdminEnvironment | null
  fromEnvironment: AuthAdminEnvironment | null
}

type VariablesToCheckSync = {
  [key in ClientFormTypes]: string[]
}

export type ClientContextType = {
  client: AuthAdminClient
  selectedEnvironment: AuthAdminClient['environments'][0]
  availableEnvironments: AuthAdminEnvironment[] | null
  checkIfInSync: (variables: string[]) => boolean
  variablesToCheckSync?: VariablesToCheckSync
  publishData: {
    toEnvironment?: AuthAdminEnvironment | null
    fromEnvironment?: AuthAdminEnvironment | null
  }
  setPublishData: Dispatch<SetStateAction<PublishData>>
}

const ClientContext = createContext<ClientContextType | undefined>(undefined)

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

export const ClientProvider: FC = ({ children }) => {
  const client = useLoaderData() as AuthAdminClient
  const [publishData, setPublishData] = useState<PublishData>({
    toEnvironment: null,
    fromEnvironment: null,
  })
  const { environment: selectedEnvironment } = useEnvironment(
    client.environments,
  )

  const checkIfInSync = (variables: string[]) => {
    for (const variable of variables) {
      for (const env of client.environments) {
        if (
          JSON.stringify(
            env[variable as keyof AuthAdminClient['environments'][0]],
          ) !==
          JSON.stringify(
            selectedEnvironment[
              variable as keyof AuthAdminClient['environments'][0]
            ],
          )
        ) {
          return false
        }
      }
    }

    return true
  }

  return (
    <ClientContext.Provider
      value={{
        client,
        selectedEnvironment,
        checkIfInSync,
        variablesToCheckSync,
        publishData,
        setPublishData,
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
