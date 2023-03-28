import {
  GridColumn,
  GridContainer,
  GridRow,
  Tag,
  Text,
  Stack,
  Box,
  Select,
} from '@island.is/island-ui/core'
import React, { useState } from 'react'
import BasicInfo from './BasicInfo'
import Translations from './Translations'
import ClientsUrl from './ClientsUrl'
import Lifetime from './Lifetime'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { useLoaderData } from 'react-router-dom'
import { AuthClient } from './Client.loader'
import { RefreshTokenExpiration } from '@island.is/api/schema'

const Client = () => {
  const client = useLoaderData() as AuthClient

  const { formatMessage } = useLocale()
  const [selectedEnvironment, setSelectedEnvironment] = useState<
    AuthClient['environments'][0]
  >(client.environments[0])
  return (
    <GridContainer>
      <Stack space={4}>
        <GridRow>
          <GridColumn span="6/12">
            <Stack space="smallGutter">
              <Tag outlined>{client.clientType}</Tag>
              <Text variant="h2">
                {client.environments[0].displayName[0].value}
              </Text>
            </Stack>
          </GridColumn>
          <GridColumn span="6/12">
            <Box width="full" display="flex" justifyContent="flexEnd">
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
          </GridColumn>
        </GridRow>
        <BasicInfo clientId={selectedEnvironment.clientId} />
        <Translations translations={selectedEnvironment.displayName} />
        <ClientsUrl
          redirectUris={selectedEnvironment.redirectUris}
          postLogoutRedirectUris={selectedEnvironment.postLogoutRedirectUris}
        />
        <Lifetime
          absoluteLifetime={selectedEnvironment.absoluteRefreshTokenLifetime}
          inactivityLifetime={selectedEnvironment.slidingRefreshTokenLifetime}
          inactivityExpiration={
            selectedEnvironment.refreshTokenExpiration ===
            RefreshTokenExpiration.Sliding
          }
        />
      </Stack>
    </GridContainer>
  )
}

export default Client
