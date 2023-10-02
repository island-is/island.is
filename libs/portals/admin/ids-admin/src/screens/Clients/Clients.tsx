import React, { useState } from 'react'
import { Outlet, useLoaderData, useNavigate, useParams } from 'react-router-dom'

import {
  Box,
  Button,
  FilterInput,
  Inline,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { replaceParams } from '@island.is/react-spa/shared'

import { m } from '../../lib/messages'
import { IDSAdminPaths } from '../../lib/paths'
import { AuthClients } from './Clients.loader'
import { ClientType } from '../../components/ClientType'
import IdsAdminCard from '../../components/IdsAdminCard/IdsAdminCard'
import { useLooseSearch } from '../../hooks/useLooseSearch'

const Clients = () => {
  const originalClients = useLoaderData() as AuthClients
  const { tenant } = useParams()
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const { locale } = useLocale()

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
      <Box
        width={'full'}
        display={'flex'}
        justifyContent={'spaceBetween'}
        columnGap={'gutter'}
        alignItems={'center'}
        rowGap={3}
        marginBottom={[4, 4, 4, 6]}
      >
        <Stack space={2}>
          <Text as="h1" variant="h2">
            {formatMessage(m.clients)}
          </Text>
          <Text variant={'default'}>{formatMessage(m.clientsDescription)}</Text>
        </Stack>
        {withCreateButton && (
          <Box>
            <Button size={'small'} onClick={openCreateClientModal}>
              {formatMessage(m.createClient)}
            </Button>
          </Box>
        )}
      </Box>
    )
  }

  return originalClients.length === 0 ? (
    <>
      {getHeader(false)}
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
        <Text paddingTop="gutter">{formatMessage(m.noClientsDescription)}</Text>
        <Box marginTop={6}>
          <Button size="small" onClick={openCreateClientModal}>
            {formatMessage(m.createClient)}
          </Button>
        </Box>
        <Box marginTop="gutter">
          <Button variant={'text'}>{formatMessage(m.learnMore)}</Button>
        </Box>
      </Box>
      <Outlet />
    </>
  ) : (
    <>
      {getHeader()}
      <Stack space={2}>
        <Inline>
          <FilterInput
            placeholder={formatMessage(m.searchPlaceholder)}
            name="session-nationalId-input"
            value={inputSearchValue}
            onChange={handleSearch}
            backgroundColor="blue"
          />
        </Inline>

        {clients.map((item) => {
          const href = replaceParams({
            href: IDSAdminPaths.IDSAdminClient,
            params: {
              tenant,
              client: item.clientId,
            },
          })
          return (
            <IdsAdminCard
              key={`clients-${item.clientId}`}
              dataTestId="tenant-applications-list-item"
              title={
                item.defaultEnvironment.displayName.find(
                  (translatedValue) => locale === translatedValue.locale,
                )?.value
              }
              text={item.defaultEnvironment.clientId}
              tags={item.availableEnvironments.map((tag) => ({
                children: tag,
                onClick: () => navigate(`${href}?env=${tag}`),
              }))}
              eyebrow={<ClientType client={item} />}
              cta={{
                label: formatMessage(m.change),
                to: href,
              }}
            />
          )
        })}
      </Stack>
      <Outlet />
    </>
  )
}

export default Clients
