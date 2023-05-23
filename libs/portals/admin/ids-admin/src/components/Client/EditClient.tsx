import classNames from 'classnames'
import React, { useState } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'

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
import { StickyLayout } from '../StickyLayout/StickyLayout'
import { AdvancedSettings } from './AdvancedSettings'
import { BasicInfo } from './BasicInfo'
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
import { EnvironmentProvider } from '../../shared/context/EnvironmentContext'
import { useEnvironment } from '../../shared/hooks/useEnvironment'
import { useClient } from './ClientContext'

const IssuerUrls = {
  [AuthAdminEnvironment.Development]:
    'https://identity-server.dev01.devland.is',
  [AuthAdminEnvironment.Staging]:
    'https://identity-server.staging01.devland.is',
  [AuthAdminEnvironment.Production]: 'https://innskra.island.is',
}

export const EditClient = () => {
  const navigate = useNavigate()
  const params = useParams()
  const { formatMessage, locale } = useLocale()
  const { isSuperAdmin } = useSuperAdmin()
  const { setPublishData, client } = useClient()
  const isMachineApplication = client.clientType === AuthAdminClientType.machine
  const {
    environment: selectedEnvironment,
    updateEnvironment,
  } = useEnvironment(client.environments)
  const [isRevokeSecretsVisible, setRevokeSecretsVisibility] = useState(false)

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
    <EnvironmentProvider selectedEnvironment={selectedEnvironment.environment}>
      <StickyLayout
        header={(isSticky) => (
          <EnvironmentHeader
            title={getTranslatedValue(selectedEnvironment.displayName, locale)}
            selectedEnvironment={selectedEnvironment.environment}
            availableEnvironments={client.availableEnvironments}
            onChange={(environment) => {
              if (environmentExists(environment)) {
                updateEnvironment(environment)
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
          {!isMachineApplication && (
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
          <Permissions
            allowedScopes={selectedEnvironment?.allowedScopes ?? []}
          />
          {isSuperAdmin && !isMachineApplication && (
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
    </EnvironmentProvider>
  )
}
