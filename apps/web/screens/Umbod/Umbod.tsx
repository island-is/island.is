import { useMemo, useState } from 'react'
import * as kennitala from 'kennitala'
import Head from 'next/head'
import { useQuery } from '@apollo/client'
import { useIntl } from 'react-intl'

import {
  AccordionCard,
  Box,
  FilterInput,
  GridColumn,
  GridContainer,
  GridRow,
  SkeletonLoader,
  Stack,
  Table,
  Text,
} from '@island.is/island-ui/core'

import { useI18n } from '../../i18n'
import { withMainLayout } from '../../layouts/main'
import { CustomPageUniqueIdentifier } from '@island.is/shared/types'
import { CustomPageUniqueIdentifier as GraphQLCustomPageUniqueIdentifier } from '@island.is/web/graphql/schema'
import {
  GET_PUBLIC_AUTH_TENANT_SCOPES_ONLY,
  GET_PUBLIC_AUTH_TENANTS,
} from '../queries/Umbod'
import {
  type CustomScreen,
  withCustomPageWrapper,
} from '../CustomPage/CustomPageWrapper'
import { getTranslation, PublicAuthScope, PublicAuthTenant } from './types'
import { m } from './translations.strings'

interface UmbodProps {
  tenants: PublicAuthTenant[]
}

interface PublicTenantsQuery {
  publicAuthTenants: PublicAuthTenant[]
}

interface PublicTenantScopesQuery {
  publicAuthTenantScopes: PublicAuthScope[]
}

const TenantScopes = ({
  tenantId,
  locale,
}: {
  tenantId: string
  locale: string
}) => {
  const { formatMessage } = useIntl()
  const { data, loading, error } = useQuery<PublicTenantScopesQuery>(
    GET_PUBLIC_AUTH_TENANT_SCOPES_ONLY,
    {
      variables: { tenantId },
    },
  )
  const scopes = data?.publicAuthTenantScopes ?? []

  if (loading) {
    return <SkeletonLoader height={160} />
  }

  if (error) {
    return <Text>{formatMessage(m.loadMandatesError)}</Text>
  }

  if (scopes.length === 0) {
    return <Text>{formatMessage(m.noMandates)}</Text>
  }

  return (
    <Table.Table>
      <Table.Head>
        <Table.Row>
          <Table.HeadData>
            <Text variant="medium" fontWeight="semiBold">
              {formatMessage(m.mandateName)}
            </Text>
          </Table.HeadData>
          <Table.HeadData>
            <Text variant="medium" fontWeight="semiBold">
              {formatMessage(m.description)}
            </Text>
          </Table.HeadData>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {scopes.map((scope) => {
          const title = getTranslation(scope.displayName, locale)
          const description = getTranslation(scope.description, locale)

          return (
            <Table.Row key={scope.scopeName}>
              <Table.Data>
                <Text variant="medium">{title || '-'}</Text>
              </Table.Data>
              <Table.Data>
                <Text variant="medium">{description || '-'}</Text>
              </Table.Data>
            </Table.Row>
          )
        })}
      </Table.Body>
    </Table.Table>
  )
}

const TenantCard = ({
  tenant,
  locale,
}: {
  tenant: PublicAuthTenant
  locale: string
}) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <AccordionCard
      id={tenant.id}
      label={getTranslation(tenant.displayName, locale) || '-'}
      visibleContent={
        tenant.nationalId ? kennitala.format(tenant.nationalId) : undefined
      }
      expanded={expanded}
      onToggle={setExpanded}
    >
      {expanded && (
        <Box paddingY={[0, 0, 3]}>
          <TenantScopes tenantId={tenant.id} locale={locale} />
        </Box>
      )}
    </AccordionCard>
  )
}

const Umbod: CustomScreen<UmbodProps> = ({ tenants }) => {
  const { activeLocale } = useI18n()
  const { formatMessage } = useIntl()
  const [search, setSearch] = useState('')
  const normalizedSearch = search.trim().toLocaleLowerCase(activeLocale)
  const filteredTenants = useMemo(
    () =>
      tenants.filter((tenant) => {
        const searchable = [
          tenant.id,
          tenant.nationalId,
          ...tenant.displayName.map(({ value }) => value),
        ]
          .filter(Boolean)
          .join(' ')
          .toLocaleLowerCase(activeLocale)

        return searchable.includes(normalizedSearch)
      }),
    [activeLocale, normalizedSearch, tenants],
  )
  return (
    <>
      <Head>
        <title>{formatMessage(m.pageTitle)} | Ísland.is</title>
      </Head>
      <GridContainer>
        <GridRow>
          <GridColumn
            span={['12/12', '10/12', '8/12']}
            offset={['0', '1/12', '2/12']}
          >
            <Box paddingY={[5, 7, 8]}>
              <Text as="h1" variant="h1" marginBottom={2}>
                {formatMessage(m.pageTitle)}
              </Text>
              <Text marginBottom={5}>{formatMessage(m.introduction)}</Text>
              <Box marginBottom={4}>
                <FilterInput
                  name="tenant-search"
                  label={formatMessage(m.searchLabel)}
                  placeholder={formatMessage(m.searchLabel)}
                  value={search}
                  onChange={setSearch}
                  backgroundColor="blue"
                />
              </Box>
              <Stack space={2}>
                {filteredTenants.map((tenant) => (
                  <TenantCard
                    key={tenant.id}
                    tenant={tenant}
                    locale={activeLocale}
                  />
                ))}
              </Stack>
              {filteredTenants.length === 0 && (
                <Box paddingY={5} textAlign="center">
                  <Text>{formatMessage(m.noServiceProviders)}</Text>
                </Box>
              )}
            </Box>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </>
  )
}

Umbod.getProps = async ({ apolloClient }) => {
  const { data } = await apolloClient.query<PublicTenantsQuery>({
    query: GET_PUBLIC_AUTH_TENANTS,
  })

  return { tenants: data.publicAuthTenants }
}

export default withMainLayout(
  withCustomPageWrapper(
    CustomPageUniqueIdentifier.ElectronicMandates as GraphQLCustomPageUniqueIdentifier,
    Umbod,
  ),
  {
    showSearchInHeader: false,
    languageToggleHrefOverride: {
      is: '/s/stafraent-island/umbodskerfi/rafraen-umbod',
      en: '/en/o/digital-iceland/authorisation-system/electronic-mandates',
    },
  },
)
