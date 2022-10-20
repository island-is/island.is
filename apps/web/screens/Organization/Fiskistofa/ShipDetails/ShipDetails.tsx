import { useRouter } from 'next/router'
import { useMemo } from 'react'
import {
  Box,
  Breadcrumbs,
  GridContainer,
  Inline,
  Link,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
  GetNamespaceQuery,
  Query,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
  QueryFiskistofaGetSingleShipArgs as QueryGetSingleShipArgs,
} from '@island.is/web/graphql/schema'
import { linkResolver, useNamespace } from '@island.is/web/hooks'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
} from '@island.is/web/screens/queries'
import { Screen } from '@island.is/web/types'
import { Locale } from 'locale'
import { CatchQuotaCalculator } from './components/CatchQuotaCalculator'
import { StraddlingStockCalculator } from './components/StraddlingStockCalculator'
import {
  getThemeConfig,
  OrganizationFooter,
  OrganizationHeader,
} from '@island.is/web/components'
import { CustomNextError } from '@island.is/web/units/errors'
import { GET_SINGLE_SHIP } from './queries'

import * as styles from './ShipDetails.css'

const TAB_OPTIONS = ['catchQuota', 'straddlingStock'] as const

interface ShipDetailsProps {
  locale: Locale
  namespace: Record<string, string>
  organizationPage: Query['getOrganizationPage']
  ship: Query['fiskistofaGetSingleShip']
}

const ShipDetails: Screen<ShipDetailsProps> = ({
  locale,
  namespace,
  organizationPage,
  ship,
}) => {
  const router = useRouter()

  const n = useNamespace(namespace)

  const breadcrumbItems = [
    {
      title: 'Ísland.is',
      href: linkResolver('homepage', [], locale).href,
    },
    {
      title: 'Fiskistofa',
      href: linkResolver('organizationpage', ['fiskistofa'], locale).href,
    },
  ]

  const { shipNumber, selectedTab } = useMemo(() => {
    let shipNumber = null
    const nr = router?.query?.nr
    if (nr && typeof nr === 'string' && !isNaN(Number(nr))) {
      shipNumber = Number(nr)
    }
    const value = TAB_OPTIONS.find((o) => o === router?.query?.tab)
    const selectedTab = value ?? TAB_OPTIONS[0]
    return { shipNumber, selectedTab }
  }, [router?.query])

  return (
    <>
      <OrganizationHeader organizationPage={organizationPage} />
      <GridContainer>
        <Box marginTop={6} marginBottom={6}>
          <Breadcrumbs items={breadcrumbItems} />
        </Box>

        {ship?.name && (
          <Box marginBottom={4}>
            <Stack space={1}>
              <Text variant="h1">{ship.name}</Text>
              <Box className={styles.shipNumber}>
                <Text fontWeight="semiBold" color="white">
                  {shipNumber}
                </Text>
              </Box>
            </Stack>
          </Box>
        )}

        {!ship?.name && !ship?.shipNumber && (
          <Box marginBottom={4}>
            <Text>{n('shipNotFound', 'Skip fannst ekki')}</Text>
          </Box>
        )}

        <Box className={styles.searchBox} marginBottom={4}>
          {/* <SidebarShipSearchInput {...namespace} label="" /> */}
        </Box>

        {ship?.shipNumber && (
          <Box>
            <Inline alignY="center" space={5}>
              {TAB_OPTIONS.map((tab) => {
                const isSelected = selectedTab === tab
                return (
                  <Link
                    shallow={true}
                    href={{
                      pathname: router.pathname,
                      query: {
                        nr: shipNumber,
                        tab: tab,
                      },
                    }}
                    underline="normal"
                    key={tab}
                    underlineVisibility={isSelected ? 'always' : undefined}
                    color={isSelected ? 'blue400' : undefined}
                  >
                    {n(
                      tab,
                      tab === 'catchQuota'
                        ? 'Reiknivél aflamarks'
                        : 'Reiknivél deilistofna',
                    )}
                  </Link>
                )
              })}
            </Inline>
          </Box>
        )}
      </GridContainer>

      {ship && (
        <Box className={styles.container}>
          <GridContainer>
            {selectedTab === 'catchQuota' && ship?.shipNumber && shipNumber && (
              <CatchQuotaCalculator
                shipNumber={shipNumber}
                namespace={namespace}
              />
            )}
            {selectedTab === 'straddlingStock' && ship && shipNumber && (
              <StraddlingStockCalculator
                shipNumber={shipNumber}
                namespace={namespace}
              />
            )}
          </GridContainer>
        </Box>
      )}

      <OrganizationFooter organizations={[organizationPage.organization]} />
    </>
  )
}

ShipDetails.getInitialProps = async ({ locale, apolloClient, query }) => {
  const [
    namspaceResponse,
    organizationPageResponse,
    shipResponse,
  ] = await Promise.all([
    apolloClient.query<GetNamespaceQuery, QueryGetNamespaceArgs>({
      query: GET_NAMESPACE_QUERY,
      variables: {
        input: {
          lang: locale,
          namespace: 'Fiskistofa - Ship details',
        },
      },
    }),
    apolloClient.query<Query, QueryGetOrganizationPageArgs>({
      query: GET_ORGANIZATION_PAGE_QUERY,
      variables: {
        input: {
          slug: 'fiskistofa',
          lang: locale,
        },
      },
    }),
    apolloClient.query<Query, QueryGetSingleShipArgs>({
      query: GET_SINGLE_SHIP,
      variables: {
        input: { shipNumber: Number(query.nr) },
      },
    }),
  ])

  if (!organizationPageResponse?.data?.getOrganizationPage) {
    throw new CustomNextError(404, 'Organization page not found')
  }

  const namespaceString = namspaceResponse?.data?.getNamespace?.fields || '{}'
  const namespace = JSON.parse(namespaceString)

  const organizationPage = organizationPageResponse.data.getOrganizationPage

  return {
    locale: locale as Locale,
    namespace,
    organizationPage: organizationPageResponse.data.getOrganizationPage,
    ship: shipResponse?.data?.fiskistofaGetSingleShip,
    ...getThemeConfig(organizationPage.theme, organizationPage.slug),
  }
}

export default withMainLayout(ShipDetails)
