import React, { useEffect, useState } from 'react'
import {
  useNavigate,
  useParams,
  useLoaderData,
  Outlet,
  useOutletContext,
  useRouteLoaderData,
} from 'react-router-dom'

import {
  Box,
  Button,
  FilterInput,
  GridContainer,
  GridRow,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { replaceParams } from '@island.is/react-spa/shared'

import { m } from '../../lib/messages'
import { IDSAdminPaths } from '../../lib/paths'
import { AuthClients } from './Clients.loader'
import IdsAdminCard from '../../shared/components/IdsAdminCard/IdsAdminCard'
import { useLooseSearch } from '../../shared/hooks/useLooseSearch'
import { useTenantTitle } from '../../shared/hooks/useTenantTitle'
import { tenantLoaderId } from '../../screens/Tenant/Tenant.loader'
import { AuthAdminTenant } from '@island.is/api/schema'

const Clients = () => {
  const originalClients = useLoaderData() as AuthClients
  const tenantInfo = useRouteLoaderData(tenantLoaderId) as AuthAdminTenant
  const { tenant } = useParams()
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const { locale } = useLocale()
  const { setTitle } = useTenantTitle()

  useEffect(() => {
    setTitle(tenantInfo.defaultEnvironment.displayName[0].value)
  }, [tenantInfo])

  const [inputSearchValue, setInputSearchValue] = useState<string>('')
  const [clients, filterClients] = useLooseSearch(
    originalClients,
    ['defaultEnvironment.displayName[0].value', 'clientId'],
    'clientId',
  )

  const handleSearch = (value: string) => {
    setInputSearchValue(value)
    filterClients(value)
  }

  const openCreateClientModal = () => {
    navigate(
      replaceParams({
        href: IDSAdminPaths.IDSAdminClientCreate,
        params: { tenant },
      }),
    )
  }

  const getHeader = (withCreateButton = true) => {
    return (
      <GridRow rowGap={3} marginBottom={'containerGutter'}>
        <Box
          width={'full'}
          display={'flex'}
          justifyContent={'spaceBetween'}
          columnGap={'gutter'}
          alignItems={'center'}
        >
          <Stack space={2}>
            <Text variant={'h2'}>{formatMessage(m.clients)}</Text>
            <Text variant={'default'}>
              {formatMessage(m.clientsDescription)}
            </Text>
          </Stack>
          {withCreateButton && (
            <Box>
              <Button size={'small'} onClick={openCreateClientModal}>
                {formatMessage(m.createClient)}
              </Button>
            </Box>
          )}
        </Box>
      </GridRow>
    )
  }

  return originalClients.length === 0 ? (
    <GridContainer>
      {getHeader(false)}
      <GridRow>
        <Box
          width="full"
          display="flex"
          flexDirection="column"
          border="standard"
          borderRadius="large"
          justifyContent="center"
          alignItems="center"
          padding={10}
        >
          <Text variant="h3">{formatMessage(m.noClients)}</Text>
          <Text paddingTop="gutter">
            {formatMessage(m.noClientsDescription)}
          </Text>
          <Box marginTop={6}>
            <Button size="small" onClick={openCreateClientModal}>
              {formatMessage(m.createClient)}
            </Button>
          </Box>
          <Box marginTop="gutter">
            <Button variant={'text'}>{formatMessage(m.learnMore)}</Button>
          </Box>
        </Box>
      </GridRow>
      <Outlet />
    </GridContainer>
  ) : (
    <GridContainer position="relative">
      {getHeader()}
      <Box paddingTop="gutter">
        <Stack space={[1, 1, 2, 2]}>
          <GridRow>
            <FilterInput
              placeholder={formatMessage(m.searchPlaceholder)}
              name="session-nationalId-input"
              value={inputSearchValue}
              onChange={handleSearch}
              backgroundColor="blue"
            />
          </GridRow>

          {clients.map((item) => (
            <GridRow key={`clients-${item.clientId}`}>
              <IdsAdminCard
                title={
                  item.defaultEnvironment.displayName.find(
                    (translatedValue) => locale === translatedValue.locale,
                  )?.value
                }
                text={item.defaultEnvironment.clientId}
                tags={item.availableEnvironments.map((tag) => ({
                  children: tag,
                }))}
                eyebrow={
                  <Tag variant="blue" outlined disabled>
                    {item.clientType}
                  </Tag>
                }
                cta={{
                  label: formatMessage(m.change),
                  to: replaceParams({
                    href: IDSAdminPaths.IDSAdminClient,
                    params: {
                      tenant,
                      client: item.clientId,
                    },
                  }),
                }}
              />
            </GridRow>
          ))}
        </Stack>
      </Box>
      <Outlet />
    </GridContainer>
  )
}

export default Clients
