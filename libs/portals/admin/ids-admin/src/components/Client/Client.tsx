import React, { useState } from 'react'
import { useLoaderData } from 'react-router-dom'

import {
  AuthAdminEnvironment,
  AuthAdminRefreshTokenExpiration,
} from '@island.is/api/schema'
import { Tag, Text, Stack, Box, Select } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { m } from '../../lib/messages'
import BasicInfo from './BasicInfo'
import { AuthClient } from './Client.loader'
import ClientsUrl from './ClientsUrl'
import Lifetime from './Lifetime'
import Translations from './Translations'
import Delegation from './Delegation'
import AdvancedSettings from './AdvancedSettings'
import { ClientContext } from '../../shared/context/ClientContext'
import { ClientFormTypes } from '../forms/EditApplication/EditApplication.action'
import * as styles from './Client.css'

const IssuerUrls = {
  [AuthAdminEnvironment.Development]:
    'https://identity-server.dev01.devland.is',
  [AuthAdminEnvironment.Staging]:
    'https://identity-server.staging01.devland.is',
  [AuthAdminEnvironment.Production]: 'https://innskra.island.is',
}

const Client = () => {
  const client = useLoaderData() as AuthClient

  const { formatMessage } = useLocale()
  const [selectedEnvironment, setSelectedEnvironment] = useState<
    AuthClient['environments'][0]
  >(client.environments[0])

  const checkIfInSync = (variables: string[]) => {
    for (const variable of variables) {
      for (const env of client.environments) {
        if (
          JSON.stringify(
            env[variable as keyof AuthClient['environments'][0]],
          ) !==
          JSON.stringify(
            selectedEnvironment[
              variable as keyof AuthClient['environments'][0]
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
          [ClientFormTypes.none]: [],
        },
      }}
    >
      <Stack space={4}>
        <Box
          display="flex"
          columnGap={2}
          rowGap={2}
          justifyContent="spaceBetween"
          flexDirection={['column', 'row']}
        >
          <Box flexGrow={1}>
            <Tag outlined>{client.clientType}</Tag>
            <Text variant="h2">
              {client.environments[0].displayName[0].value}
            </Text>
          </Box>
          <Box className={styles.select}>
            <Select
              name="env"
              icon="chevronDown"
              size="sm"
              backgroundColor="blue"
              label={formatMessage(m.environment)}
              onChange={(event: any) =>
                setSelectedEnvironment(
                  client.environments.find(
                    (env) => env.environment === event.value,
                  ) as AuthClient['environments'][0],
                )
              }
              value={{
                label: selectedEnvironment.environment,
                value: selectedEnvironment.environment,
              }}
              options={client.environments.map((env) => {
                return {
                  label: env.environment,
                  value: env.environment,
                }
              })}
            />
          </Box>
        </Box>

        <BasicInfo
          key={`${selectedEnvironment.environment}-BasicInfo`}
          clientId={selectedEnvironment.clientId}
          issuerUrl={IssuerUrls[selectedEnvironment.environment]}
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
          slidingRefreshTokenLifetime={
            selectedEnvironment.slidingRefreshTokenLifetime
          }
          customClaims={
            selectedEnvironment.customClaims?.map((claim) => {
              return `${claim.type}=${claim.value}`
            }) ?? []
          }
        />
      </Stack>
    </ClientContext.Provider>
  )
}

export default Client
