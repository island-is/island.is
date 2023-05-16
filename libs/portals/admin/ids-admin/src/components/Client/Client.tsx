import React, { useEffect, useState } from 'react'
import { Outlet, useLoaderData, useNavigate, useParams } from 'react-router-dom'

import {
  AuthAdminEnvironment,
  AuthAdminRefreshTokenExpiration,
} from '@island.is/api/schema'
import { Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { replaceParams } from '@island.is/react-spa/shared'

import { IDSAdminPaths } from '../../lib/paths'
import { ClientContext } from '../../shared/context/ClientContext'
import { ClientFormTypes } from '../forms/EditApplication/EditApplication.action'
import AdvancedSettings from './AdvancedSettings'
import BasicInfo from './BasicInfo'
import { AuthAdminClient } from './Client.loader'
import ClientsUrl from './ClientsUrl'
import { DangerZone } from './DangerZone'
import Delegation from './Delegation'
import Lifetime from './Lifetime'
import Permissions from './Permissions'
import Translations from './Translations'

import { EnvironmentHeader } from '../forms/EnvironmentHeader/EnvironmentHeader'
import { getTranslatedValue } from '@island.is/portals/core'

const IssuerUrls = {
  [AuthAdminEnvironment.Development]:
    'https://identity-server.dev01.devland.is',
  [AuthAdminEnvironment.Staging]:
    'https://identity-server.staging01.devland.is',
  [AuthAdminEnvironment.Production]: 'https://innskra.island.is',
}

export type PublishData = {
  toEnvironment: AuthAdminEnvironment | null
  fromEnvironment: AuthAdminEnvironment | null
}

const Client = () => {
  const client = useLoaderData() as AuthAdminClient
  const navigate = useNavigate()
  const params = useParams()
  const { locale } = useLocale()
  const [publishData, setPublishData] = useState<PublishData>({
    toEnvironment: null,
    fromEnvironment: null,
  })
  const [selectedEnvironment, setSelectedEnvironment] = useState<
    AuthAdminClient['environments'][0]
  >(client.environments[0])

  useEffect(() => {
    const newSelectedEnvironment = client.environments.find(
      ({ environment }) => environment === selectedEnvironment.environment,
    )

    if (newSelectedEnvironment) {
      setSelectedEnvironment(newSelectedEnvironment)
    }
  }, [client, setSelectedEnvironment])

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
    )
  }

  const environmentExists = (environment: AuthAdminEnvironment) => {
    return client.environments.some((env) => env.environment === environment)
  }

  return (
    <ClientContext.Provider
      value={{
        client,
        selectedEnvironment,
        setSelectedEnvironment,
        availableEnvironments: client.environments.map(
          (env) => env.environment,
        ),
        checkIfInSync: checkIfInSync,
        variablesToCheckSync: {
          [ClientFormTypes.applicationUrls]: [
            'postLogoutRedirectUris',
            'redirectUris',
          ],
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
        },
        publishData: publishData,
        setPublishData: setPublishData,
      }}
    >
      <Stack space={3}>
        <EnvironmentHeader
          title={getTranslatedValue(selectedEnvironment.displayName, locale)}
          selectedEnvironment={selectedEnvironment.environment}
          onChange={(environment) => {
            if (environmentExists(environment)) {
              setSelectedEnvironment(
                client.environments.find(
                  (env) => env.environment === environment,
                ) as AuthAdminClient['environments'][0],
              )
            } else {
              openPublishModal(environment)
            }
          }}
          tag={client.clientType}
        />
        <BasicInfo
          key={`${selectedEnvironment.environment}-BasicInfo`}
          clientId={selectedEnvironment.clientId}
          issuerUrl={IssuerUrls[selectedEnvironment.environment]}
          clientSecrets={selectedEnvironment.secrets}
        />
        <Translations
          key={`${selectedEnvironment.environment}-Translations`}
          translations={selectedEnvironment.displayName}
        />
        <ClientsUrl
          key={`${selectedEnvironment.environment}-ClientsUrl`}
          redirectUris={selectedEnvironment.redirectUris}
          postLogoutRedirectUris={selectedEnvironment.postLogoutRedirectUris}
        />
        <Lifetime
          key={`${selectedEnvironment.environment}-Lifetime`}
          absoluteRefreshTokenLifetime={
            selectedEnvironment.absoluteRefreshTokenLifetime
          }
          slidingRefreshTokenLifetime={
            selectedEnvironment.slidingRefreshTokenLifetime
          }
          refreshTokenExpiration={
            selectedEnvironment.refreshTokenExpiration ===
            AuthAdminRefreshTokenExpiration.Sliding
          }
        />
        <Permissions />
        <Delegation
          key={`${selectedEnvironment.environment}-Delegation`}
          supportsProcuringHolders={
            selectedEnvironment.supportsProcuringHolders
          }
          supportsLegalGuardians={selectedEnvironment.supportsLegalGuardians}
          promptDelegations={selectedEnvironment.promptDelegations}
          supportsPersonalRepresentatives={
            selectedEnvironment.supportsPersonalRepresentatives
          }
          supportsCustomDelegation={
            selectedEnvironment.supportsCustomDelegation
          }
          requireApiScopes={selectedEnvironment.requireApiScopes}
        />
        <AdvancedSettings
          key={`${selectedEnvironment.environment}-AdvancedSettings`}
          requirePkce={selectedEnvironment.requirePkce}
          allowOfflineAccess={selectedEnvironment.allowOfflineAccess}
          requireConsent={selectedEnvironment.requireConsent}
          supportTokenExchange={selectedEnvironment.supportTokenExchange}
          accessTokenLifetime={selectedEnvironment.accessTokenLifetime}
          customClaims={selectedEnvironment.customClaims}
        />
        <DangerZone />
      </Stack>
      <Outlet />
    </ClientContext.Provider>
  )
}

export default Client
