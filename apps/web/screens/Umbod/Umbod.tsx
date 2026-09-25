import * as kennitala from 'kennitala'
import { useQuery } from '@apollo/client'
import Head from 'next/head'
import { useMemo, useState } from 'react'

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

import { withMainLayout } from '../../layouts/main'
import { Screen } from '../../types'
import { useI18n } from '../../i18n'
import {
  GET_PUBLIC_AUTH_TENANTS,
  GET_PUBLIC_AUTH_TENANT_SCOPES_ONLY,
} from '../queries/Umbod'
import { getTranslation, PublicAuthScope, PublicAuthTenant } from './types'

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
  const { data, loading } = useQuery<PublicTenantScopesQuery>(
    GET_PUBLIC_AUTH_TENANT_SCOPES_ONLY,
    {
      variables: { tenantId },
    },
  )
  const scopes = data?.publicAuthTenantScopes ?? []

  if (loading) {
    return <SkeletonLoader height={160} />
  }

  if (scopes.length === 0) {
    return (
      <Text>
        {locale === 'is' ? 'Engar heimildir fundust.' : 'No mandates found.'}
      </Text>
    )
  }

  return (
    <Table.Table>
      <Table.Head>
        <Table.Row>
          <Table.HeadData>
            <Text variant="medium" fontWeight="semiBold">
              {locale === 'is' ? 'Heiti umboðs' : 'Mandate name'}
            </Text>
          </Table.HeadData>
          <Table.HeadData>
            <Text variant="medium" fontWeight="semiBold">
              {locale === 'is' ? 'Lýsing' : 'Description'}
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

const Umbod: Screen<UmbodProps> = ({ tenants }) => {
  const { activeLocale } = useI18n()
  const isIcelandic = activeLocale === 'is'
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
        <title>
          {isIcelandic ? 'Rafræn umboð' : 'Electronic mandates'} | Ísland.is
        </title>
      </Head>
      <GridContainer>
        <GridRow>
          <GridColumn
            span={['12/12', '10/12', '8/12']}
            offset={['0', '1/12', '2/12']}
          >
            <Box paddingY={[5, 7, 8]}>
              <Text as="h1" variant="h1" marginBottom={2}>
                {isIcelandic ? 'Rafræn umboð' : 'Electronic mandates'}
              </Text>
              <Text marginBottom={5}>
                {isIcelandic
                  ? 'Smelltu á þjónustuaðila til að skoða umboð hans.'
                  : 'Select a service provider to view its mandates.'}
              </Text>
              <Box marginBottom={4}>
                <FilterInput
                  name="tenant-search"
                  placeholder={
                    isIcelandic
                      ? 'Leita eftir nafni stofnunar eða kennitölu'
                      : 'Search by organisation name or national ID'
                  }
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
                  <Text>
                    {isIcelandic
                      ? 'Engir þjónustuaðilar fundust.'
                      : 'No service providers found.'}
                  </Text>
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

export default withMainLayout(Umbod, {
  showSearchInHeader: false,
  languageToggleHrefOverride: {
    is: '/flokkur/umbod',
    en: '/en/category/mandates',
  },
})
