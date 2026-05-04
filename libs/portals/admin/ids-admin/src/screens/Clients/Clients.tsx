import React, { useMemo, useState } from 'react'
import {
  Outlet,
  useLoaderData,
  useNavigate,
  useParams,
  useRevalidator,
} from 'react-router-dom'

import {
  Box,
  Button,
  Filter,
  FilterInput,
  FilterMultiChoice,
  Inline,
  Stack,
  Text,
  LinkV2,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { replaceParams } from '@island.is/react-spa/shared'

import { m } from '../../lib/messages'
import { IDSAdminExternalPaths, IDSAdminPaths } from '../../lib/paths'
import { AuthClients } from './Clients.loader'
import { ClientType } from '../../components/ClientType'
import IdsAdminCard from '../../components/IdsAdminCard/IdsAdminCard'
import { useLooseSearch } from '../../hooks/useLooseSearch'
import { RestoreClient } from './RestoreClient'

const Clients = () => {
  const originalClients = useLoaderData() as AuthClients
  const { tenant } = useParams()
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const { locale } = useLocale()

  const revalidator = useRevalidator()
  const [restoreClientId, setRestoreClientId] = useState<string | null>(null)
  const [inputSearchValue, setInputSearchValue] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('active')
  const [clients, filterClients] = useLooseSearch(
    originalClients,
    ['defaultEnvironment.displayName[0].value', 'clientId'],
    'clientId',
  )

  const filteredClients = useMemo(() => {
    if (statusFilter === 'all') {
      return clients
    }
    if (statusFilter === 'archived') {
      return clients.filter((c) => !!c.archived)
    }
    return clients.filter((c) => !c.archived)
  }, [clients, statusFilter])

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
          <LinkV2
            color="blue400"
            underline="normal"
            underlineVisibility="always"
            href={IDSAdminExternalPaths.DocsClients}
            newTab
          >
            {formatMessage(m.learnMore)}
          </LinkV2>
        </Box>
      </Box>
      <Outlet />
    </>
  ) : (
    <>
      {getHeader()}
      <Stack space={2}>
        <Box display="flex" justifyContent="spaceBetween" alignItems="center">
          <Inline>
            <FilterInput
              placeholder={formatMessage(m.searchPlaceholder)}
              name="clients-search-input"
              value={inputSearchValue}
              onChange={handleSearch}
              backgroundColor="blue"
            />
          </Inline>
          <Filter
            variant="popover"
            align="right"
            labelClear={formatMessage(m.clearFilter)}
            labelClearAll={formatMessage(m.clearFilter)}
            labelOpen={formatMessage(m.openFilter)}
            labelClose={formatMessage(m.closeFilter)}
            filterCount={statusFilter !== 'active' ? 1 : 0}
            onFilterClear={() => setStatusFilter('active')}
          >
            <FilterMultiChoice
              singleExpand
              onChange={({ selected }) => {
                setStatusFilter(selected[0] ?? 'active')
              }}
              onClear={() => {
                setStatusFilter('active')
              }}
              categories={[
                {
                  id: 'status',
                  label: formatMessage(m.clientStatus),
                  selected: [statusFilter],
                  startExpanded: true,
                  filters: [
                    {
                      value: 'active',
                      label: formatMessage(m.activeClients),
                    },
                    {
                      value: 'archived',
                      label: formatMessage(m.archivedClients),
                    },
                    {
                      value: 'all',
                      label: formatMessage(m.allClients),
                    },
                  ],
                  singleOption: true,
                },
              ]}
            />
          </Filter>
        </Box>

        {filteredClients.length === 0 && originalClients.length > 0 && (
          <Box
            display="flex"
            justifyContent="center"
            padding={6}
            border="standard"
            borderRadius="large"
          >
            <Text>{formatMessage(m.noMatchingClients)}</Text>
          </Box>
        )}

        {filteredClients.map((item) => {
          const href = replaceParams({
            href: IDSAdminPaths.IDSAdminClient,
            params: {
              tenant,
              client: item.clientId,
            },
          })
          const isArchived = !!item.archived
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
              tags={
                isArchived
                  ? [
                      {
                        children: formatMessage(m.archived),
                        variant: 'red' as const,
                        outlined: false,
                      },
                    ]
                  : item.availableEnvironments.map((tag) => ({
                      children: tag,
                      onClick: () => navigate(`${href}?env=${tag}`),
                    }))
              }
              eyebrow={<ClientType client={item} />}
              cta={
                isArchived
                  ? {
                      label: formatMessage(m.restore),
                      icon: 'reload' as const,
                      onClick: () => setRestoreClientId(item.clientId),
                    }
                  : {
                      label: formatMessage(m.change),
                      to: href,
                    }
              }
            />
          )
        })}
      </Stack>
      {restoreClientId && tenant && (
        <RestoreClient
          isVisible={!!restoreClientId}
          onClose={() => setRestoreClientId(null)}
          tenantId={tenant}
          clientId={restoreClientId}
          onSuccess={() => {
            setRestoreClientId(null)
            revalidator.revalidate()
          }}
        />
      )}
      <Outlet />
    </>
  )
}

export default Clients
