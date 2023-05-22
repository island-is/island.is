import classNames from 'classnames'
import React, { useState } from 'react'
import {
  Outlet,
  useLoaderData,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'

import {
  AuthAdminClientType,
  AuthAdminEnvironment,
  AuthAdminRefreshTokenExpiration,
} from '@island.is/api/schema'
import { AlertMessage, Button, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { replaceParams } from '@island.is/react-spa/shared'
import { getTranslatedValue } from '@island.is/portals/core'

import { m } from '../../lib/messages'
import { IDSAdminPaths } from '../../lib/paths'
import { ClientType } from '../../shared/components/ClientType'
import { ClientContext } from '../../shared/context/ClientContext'
import { useSyncedQueryStringValueWithoutNavigation } from '../../shared/hooks/useSyncedQueryStringValueWithoutNavigation'
import { ClientFormTypes } from '../forms/EditApplication/EditApplication.action'
import { StickyLayout } from '../StickyLayout/StickyLayout'
import { AdvancedSettings } from './AdvancedSettings'
import { BasicInfo } from './BasicInfo'
import { AuthAdminClient } from './Client.loader'
import ClientsUrl from './ClientsUrl'
import { DangerZone } from './DangerZone'
import Delegation from './Delegation'
import Lifetime from './Lifetime'
import Permissions from './Permissions'
import { RevokeSecrets } from './RevokeSecrets/RevokeSecrets'
import Translations from './Translations'
import { useSuperAdmin } from '../../shared/hooks/useSuperAdmin'
import { EnvironmentHeader } from '../forms/EnvironmentHeader/EnvironmentHeader'
import * as styles from './Client.css'

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
  const { formatMessage, locale } = useLocale()
  const { isSuperAdmin } = useSuperAdmin()
  const isNativeApplication = client.clientType === AuthAdminClientType.native
  const [publishData, setPublishData] = useState<PublishData>({
    toEnvironment: null,
    fromEnvironment: null,
  })
  const [searchParams] = useSearchParams()
  const [selectedEnvironmentName, setSelectedEnvironmentName] = useState(
    searchParams.get('env') ?? '',
  )
  const selectedEnvironment =
    client.environments.find(
      (env) => env.environment === selectedEnvironmentName,
    ) ?? client.environments[0]
  useSyncedQueryStringValueWithoutNavigation(
    'env',
    selectedEnvironmentName,
    true,
  )

  const [isRevokeSecretsVisible, setRevokeSecretsVisibility] = useState(false)

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
      { preventScrollReset: true },
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
      <StickyLayout
        header={(isSticky) => (
          <EnvironmentHeader
            title={getTranslatedValue(selectedEnvironment.displayName, locale)}
            selectedEnvironment={selectedEnvironment.environment}
            onChange={(environment) => {
              if (environmentExists(environment)) {
                setSelectedEnvironmentName(environment)
              } else {
                openPublishModal(environment)
              }
            }}
            preHeader={
              <div
                className={classNames(
                  styles.tagWrapper,
                  isSticky && styles.tagHide,
                )}
              >
                <ClientType client={client} />
              </div>
            }
          />
        )}
      >
        <Stack space={3}>
          {selectedEnvironment.secrets.length > 1 && (
            <>
              <AlertMessage
                type="warning"
                title={formatMessage(m.multipleSecrets)}
                message={
                  <Stack space={1}>
                    <Text variant="small">
                      {formatMessage(m.multipleSecretsDescription)}
                    </Text>
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => setRevokeSecretsVisibility(true)}
                    >
                      {formatMessage(m.revokeSecrets)}
                    </Button>
                  </Stack>
                }
              />
              <RevokeSecrets
                isVisible={isRevokeSecretsVisible}
                onClose={() => setRevokeSecretsVisibility(false)}
              />
            </>
          )}

          <BasicInfo
            clientId={selectedEnvironment.clientId}
            issuerUrl={IssuerUrls[selectedEnvironment.environment]}
            clientSecrets={selectedEnvironment.secrets}
          />
          <Translations translations={selectedEnvironment.displayName} />
          {!isNativeApplication && (
            <ClientsUrl
              redirectUris={selectedEnvironment.redirectUris}
              postLogoutRedirectUris={
                selectedEnvironment.postLogoutRedirectUris
              }
            />
          )}
          <Lifetime
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
          {isSuperAdmin && !isNativeApplication && (
            <Delegation
              supportsProcuringHolders={
                selectedEnvironment.supportsProcuringHolders
              }
              supportsLegalGuardians={
                selectedEnvironment.supportsLegalGuardians
              }
              promptDelegations={selectedEnvironment.promptDelegations}
              supportsPersonalRepresentatives={
                selectedEnvironment.supportsPersonalRepresentatives
              }
              supportsCustomDelegation={
                selectedEnvironment.supportsCustomDelegation
              }
              requireApiScopes={selectedEnvironment.requireApiScopes}
            />
          )}
          {isSuperAdmin && (
            <AdvancedSettings
              requirePkce={selectedEnvironment.requirePkce}
              allowOfflineAccess={selectedEnvironment.allowOfflineAccess}
              requireConsent={selectedEnvironment.requireConsent}
              supportTokenExchange={selectedEnvironment.supportTokenExchange}
              accessTokenLifetime={selectedEnvironment.accessTokenLifetime}
              customClaims={selectedEnvironment.customClaims}
            />
          )}
          <DangerZone />
        </Stack>
      </StickyLayout>
      <Outlet />
    </ClientContext.Provider>
  )
}

export default Client
