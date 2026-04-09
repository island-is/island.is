import * as kennitala from 'kennitala'
import React, { useMemo, useState } from 'react'
import { Link, useLoaderData, useRevalidator } from 'react-router-dom'

import {
  Box,
  Button,
  FilterInput,
  GridColumn,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroHeader } from '@island.is/portals/core'
import { replaceParams } from '@island.is/react-spa/shared'

import { useLooseSearch } from '../../hooks/useLooseSearch'
import { useSuperAdmin } from '../../hooks/useSuperAdmin'
import { m } from '../../lib/messages'
import { IDSAdminPaths } from '../../lib/paths'
import CreateTenantModal from './CreateTenantModal/CreateTenantModal'
import type { AuthTenants } from './Tenants.loader'

type SearchableTenant = AuthTenants[number] & {
  searchNationalId: string
}

const Tenants = () => {
  const originalTenantsList = useLoaderData() as AuthTenants
  const { formatMessage, locale } = useLocale()
  const { isSuperAdmin } = useSuperAdmin()
  const revalidator = useRevalidator()

  const searchableTenants: SearchableTenant[] = useMemo(
    () =>
      originalTenantsList.map((item) => {
        const raw = item.nationalId ?? ''
        const formatted = raw ? kennitala.format(raw) : ''
        return {
          ...item,
          searchNationalId: [raw, formatted].filter(Boolean).join(' '),
        }
      }),
    [originalTenantsList],
  )

  const [tenantList, filterTenantList] = useLooseSearch(
    searchableTenants,
    [
      'defaultEnvironment.displayName[0].value',
      'defaultEnvironment.id',
      'searchNationalId',
    ],
    'id',
  )
  const [inputSearchValue, setInputSearchValue] = useState('')
  const [isCreateOpen, setCreateOpen] = useState(false)

  const handleSearch = (value: string) => {
    setInputSearchValue(value)
    filterTenantList(value)
  }

  return (
    <GridColumn span={['12/12', '12/12', '10/12']} offset={['0', '0', '1/12']}>
      <IntroHeader
        title={formatMessage(m.idsAdmin)}
        intro={formatMessage(m.idsAdminDescription)}
      />
      <Stack space={[2, 2, 3, 3]}>
        <Box
          display="flex"
          flexDirection={['column', 'row']}
          justifyContent="spaceBetween"
          alignItems={['flexStart', 'center']}
          columnGap={2}
          rowGap={2}
        >
          <FilterInput
            placeholder={formatMessage(m.tenantSearchPlaceholder)}
            name="session-nationalId-input"
            value={inputSearchValue}
            onChange={handleSearch}
            backgroundColor="blue"
          />
          {isSuperAdmin && (
            <Button size="small" onClick={() => setCreateOpen(true)}>
              {formatMessage(m.createTenant)}
            </Button>
          )}
        </Box>
        <Stack space={[1, 1, 2, 2]}>
          {tenantList.map((item) => {
            const href = replaceParams({
              href: IDSAdminPaths.IDSAdminClients,
              params: { tenant: item.id },
            })
            const title =
              item.defaultEnvironment.displayName.find(
                (translatedValue) => locale === translatedValue.locale,
              )?.value ?? item.defaultEnvironment.displayName[0]?.value

            const formattedNationalId = item.nationalId
              ? kennitala.format(item.nationalId)
              : null
            const subtitle = formattedNationalId
              ? `${item.defaultEnvironment.name} · ${formattedNationalId}`
              : item.defaultEnvironment.name

            return (
              <Link
                key={`tenant-${item.id}`}
                to={href}
                style={{ textDecoration: 'none', width: '100%' }}
              >
                <Box
                  display="flex"
                  borderRadius="large"
                  border="standard"
                  width="full"
                  paddingX={4}
                  paddingY={3}
                  justifyContent="spaceBetween"
                  alignItems="center"
                  data-testid="tenant-list-item"
                >
                  <Box>
                    <Stack space={1}>
                      <Text variant="h3" color="blue400">
                        {title}
                      </Text>
                      <Text variant="default">{subtitle}</Text>
                    </Stack>
                  </Box>
                  <Box
                    display="flex"
                    flexDirection={[
                      'column',
                      'column',
                      'row',
                      'row',
                      'row',
                    ]}
                    alignItems="flexEnd"
                    justifyContent="flexEnd"
                  >
                    {item.availableEnvironments.map((tag, index) => (
                      <Box margin="smallGutter" key={`tenant-tag-${index}`}>
                        <Tag variant="purple" outlined disabled>
                          {tag}
                        </Tag>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Link>
            )
          })}
        </Stack>
      </Stack>
      {isSuperAdmin && isCreateOpen && (
        <CreateTenantModal
          onClose={() => setCreateOpen(false)}
          onCreated={() => {
            setCreateOpen(false)
            revalidator.revalidate()
          }}
        />
      )}
    </GridColumn>
  )
}

export default Tenants
