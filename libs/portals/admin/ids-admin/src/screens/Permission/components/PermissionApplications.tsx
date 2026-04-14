import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  AlertMessage,
  Box,
  Button,
  SkeletonLoader,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { getTranslatedValue } from '@island.is/portals/core'
import { replaceParams } from '@island.is/react-spa/shared'

import { usePermission } from '../PermissionContext'
import { useEnvironment } from '../../../context/EnvironmentContext'
import { IDSAdminPaths } from '../../../lib/paths'
import { m } from '../../../lib/messages'
import { ShadowBox } from '../../../components/ShadowBox/ShadowBox'
import { useGetScopeClientsQuery } from './PermissionApplications.generated'
import { ClientType } from '../../../components/ClientType'

export const PermissionApplications = () => {
  const { formatMessage, locale } = useLocale()
  const { tenant } = useParams()
  const { permission } = usePermission()
  const { selectedEnvironment } = useEnvironment()
  const navigate = useNavigate()

  const { data, loading, error } = useGetScopeClientsQuery({
    variables: {
      input: {
        tenantId: tenant ?? '',
        scopeName: permission.scopeName,
        environment: selectedEnvironment,
      },
    },
    skip: !tenant,
  })

  const clients = error ? [] : data?.authAdminScopeClients ?? []

  return (
    <Box
      padding={4}
      borderRadius="large"
      border="standard"
      display="flex"
      flexDirection="column"
      rowGap={2}
    >
      <Text as="h2" variant="h3">
        {formatMessage(m.clients)}
      </Text>
      <Text marginBottom={3}>
        {formatMessage(m.permissionApplicationsDescription)}
      </Text>
      {error ? (
        <AlertMessage
          message={formatMessage(m.errorLoadingData)}
          type="error"
        />
      ) : loading ? (
        <SkeletonLoader height={120} />
      ) : clients.length === 0 ? (
        <Box
          display="flex"
          justifyContent="center"
          padding={4}
          borderRadius="large"
          background="blue100"
        >
          <Text>{formatMessage(m.permissionApplicationsEmpty)}</Text>
        </Box>
      ) : (
        <ShadowBox style={{ maxHeight: 440 }}>
          <T.Table box={{ overflow: 'initial' }}>
            <T.Head sticky>
              <T.Row>
                <T.HeadData>
                  {formatMessage(m.permissionApplicationsName)}
                </T.HeadData>
                <T.HeadData>
                  {formatMessage(m.permissionApplicationsType)}
                </T.HeadData>
              </T.Row>
            </T.Head>
            <T.Body>
              {clients.map((client) => {
                const href = replaceParams({
                  href: IDSAdminPaths.IDSAdminClient,
                  params: {
                    tenant: tenant ?? '',
                    client: client.clientId,
                  },
                })

                return (
                  <T.Row key={client.clientId}>
                    <T.Data>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => navigate(href)}
                      >
                        <Text variant="eyebrow">
                          {getTranslatedValue(client.displayName, locale)}
                        </Text>
                        {client.clientId}
                      </Button>
                    </T.Data>
                    <T.Data>
                      <ClientType client={{ clientType: client.clientType }} />
                    </T.Data>
                  </T.Row>
                )
              })}
            </T.Body>
          </T.Table>
        </ShadowBox>
      )}
    </Box>
  )
}
