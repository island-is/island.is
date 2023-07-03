import React, { FC, useContext, useRef, useEffect } from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'
import NextLink from 'next/link'

import { useI18n } from '@island.is/skilavottord-web/i18n'
import {
  Box,
  Breadcrumbs,
  GridColumn,
  GridRow,
  LoadingDots,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { PartnerPageLayout } from '@island.is/skilavottord-web/components/Layouts'
import { Sidenav, NotFound } from '@island.is/skilavottord-web/components'
import { UserContext } from '@island.is/skilavottord-web/context'
import { hasPermission } from '@island.is/skilavottord-web/auth/utils'
import {
  Query,
  Role,
  Vehicle,
} from '@island.is/skilavottord-web/graphql/schema'

import { CarsTable, RecyclingCompanyImage } from './components'

export const SkilavottordVehiclesQuery = gql`
  query skilavottordVehiclesQuery($after: String!) {
    skilavottordAllDeregisteredVehicles(first: 20, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      count
      items {
        vehicleId
        vehicleType
        newregDate
        createdAt
        recyclingRequests {
          id
          nameOfRequestor
          createdAt
        }
      }
    }
  }
`

const Overview: FC<React.PropsWithChildren<unknown>> = () => {
  const { user } = useContext(UserContext)
  const {
    t: { recyclingFundOverview: t, recyclingFundSidenav: sidenavText, routes },
  } = useI18n()
  const { data, loading, fetchMore } = useQuery<Query>(
    SkilavottordVehiclesQuery,
    {
      notifyOnNetworkStatusChange: true,
      variables: { after: '' },
    },
  )
  const { pageInfo, items: vehicles } =
    data?.skilavottordAllDeregisteredVehicles ?? {}

  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (loading) return
    const observer = new IntersectionObserver(
      (entries) => {
        const { hasNextPage, endCursor } = pageInfo || {}
        if (entries[0].isIntersecting && hasNextPage) {
          fetchMore({
            variables: { after: endCursor },
            updateQuery: (
              { skilavottordAllDeregisteredVehicles },
              { fetchMoreResult },
            ) => {
              const prevResults = skilavottordAllDeregisteredVehicles
              const newResults =
                fetchMoreResult?.skilavottordAllDeregisteredVehicles
              return {
                skilavottordAllDeregisteredVehicles: {
                  ...newResults,
                  items: [
                    ...(prevResults?.items as Vehicle[]),
                    ...(newResults?.items as Vehicle[]),
                  ],
                },
              } as Query
            },
          })
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 1.0,
      },
    )
    triggerRef.current && observer.observe(triggerRef.current)
    return () => {
      observer.disconnect()
    }
  }, [loading])

  if (!user) {
    return null
  } else if (!hasPermission('recycledVehicles', user?.role as Role)) {
    return <NotFound />
  }

  return (
    <PartnerPageLayout
      side={
        <Sidenav
          title={sidenavText.title}
          sections={[
            {
              icon: 'car',
              title: `${sidenavText.recycled}`,
              link: `${routes.recycledVehicles}`,
            },
            {
              icon: 'business',
              title: `${sidenavText.companies}`,
              link: `${routes.recyclingCompanies.baseRoute}`,
            },
            {
              ...(hasPermission('accessControl', user?.role)
                ? {
                    icon: 'lockClosed',
                    title: `${sidenavText.accessControl}`,
                    link: `${routes.accessControl}`,
                  }
                : null),
            } as React.ComponentProps<typeof Sidenav>['sections'][0],
          ].filter(Boolean)}
          activeSection={0}
        />
      }
    >
      <Stack space={4}>
        <Breadcrumbs
          items={[
            { title: 'Ísland.is', href: routes.home['recyclingCompany'] },
            {
              title: t.title,
            },
          ]}
          renderLink={(link, item) => {
            return item?.href ? (
              <NextLink href={item?.href} legacyBehavior>
                {link}
              </NextLink>
            ) : (
              link
            )
          }}
        />
        <Box
          display="flex"
          alignItems="flexStart"
          justifyContent="spaceBetween"
        >
          <GridRow marginBottom={7}>
            <GridColumn span={['8/8', '6/8', '5/8']} order={[2, 1]}>
              <Text variant="h1" as="h1" marginBottom={4}>
                {t.title}
              </Text>
              <Text variant="intro">{t.info}</Text>
            </GridColumn>
            <GridColumn
              span={['8/8', '2/8']}
              offset={['0', '0', '1/8']}
              order={[1, 2]}
            >
              <Box textAlign={['center', 'right']} padding={[6, 0]}>
                <RecyclingCompanyImage />
              </Box>
            </GridColumn>
          </GridRow>
        </Box>
        <Stack space={3}>
          <Text variant="h3">{t.subtitles.deregistered}</Text>
          {vehicles && vehicles.length > 0 ? (
            <>
              <CarsTable titles={t.table} vehicles={vehicles} />

              {loading && (
                <Box display="flex" justifyContent="center" marginTop={4}>
                  <LoadingDots />
                </Box>
              )}
            </>
          ) : loading ? (
            <Box display="flex" justifyContent="center" marginTop={4}>
              <LoadingDots />
            </Box>
          ) : (
            <Text>{t.info}</Text>
          )}
          <div ref={triggerRef} />
        </Stack>
      </Stack>
    </PartnerPageLayout>
  )
}

export default Overview
