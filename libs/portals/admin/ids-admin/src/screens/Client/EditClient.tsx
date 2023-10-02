import classNames from 'classnames'
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'

import {
  AuthAdminClientType,
  AuthAdminEnvironment,
  AuthAdminRefreshTokenExpiration,
} from '@island.is/api/schema'
import { AlertMessage, Button, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { getTranslatedValue } from '@island.is/portals/core'

import { m } from '../../lib/messages'
import { ClientType } from '../../components/ClientType'
import { AdvancedSettings } from './components/AdvancedSettings'
import { BasicInfo } from './components/BasicInfo'
import ClientsUrl from './components/ClientsUrl'
import { DangerZone } from './components/DangerZone'
import Delegation from './components/Delegation'
import Lifetime from './components/Lifetime'
import Permissions from './components/Permissions'
import { RevokeSecrets } from './components/RevokeSecrets/RevokeSecrets'
import Translations from './components/Translations'
import { useSuperAdmin } from '../../hooks/useSuperAdmin'
import { EnvironmentHeader } from '../../components/EnvironmentHeader/EnvironmentHeader'
import { StickyLayout } from '../../components/StickyLayout/StickyLayout'
import { EnvironmentProvider } from '../../context/EnvironmentContext'
import { useClient } from './ClientContext'

import * as styles from './Client.css'

const IssuerUrls = {
  [AuthAdminEnvironment.Development]:
    'https://identity-server.dev01.devland.is',
  [AuthAdminEnvironment.Staging]:
    'https://identity-server.staging01.devland.is',
  [AuthAdminEnvironment.Production]: 'https://innskra.island.is',
}

export const EditClient = () => {
  const { formatMessage, locale } = useLocale()
  const { isSuperAdmin } = useSuperAdmin()
  const { onEnvironmentChange, client, selectedEnvironment } = useClient()
  const [isRevokeSecretsVisible, setRevokeSecretsVisibility] = useState(false)
  const isMachineApplication = client.clientType === AuthAdminClientType.machine

  return (
    <EnvironmentProvider
      selectedEnvironment={selectedEnvironment.environment}
      availableEnvironments={client.availableEnvironments}
    >
      <StickyLayout
        header={(isSticky) => (
          <EnvironmentHeader
            title={getTranslatedValue(selectedEnvironment.displayName, locale)}
            selectedEnvironment={selectedEnvironment.environment}
            availableEnvironments={client.availableEnvironments}
            onChange={onEnvironmentChange}
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
