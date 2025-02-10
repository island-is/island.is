import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import NextLink from 'next/link'
import React, { FC, useContext, useEffect, useRef } from 'react'

import {
  Box,
  Breadcrumbs,
  LoadingDots,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { hasPermission } from '@island.is/skilavottord-web/auth/utils'
import { NotFound } from '@island.is/skilavottord-web/components'
import { PartnerPageLayout } from '@island.is/skilavottord-web/components/Layouts'
import { UserContext } from '@island.is/skilavottord-web/context'
import {
  Query,
  Role,
  Vehicle,
} from '@island.is/skilavottord-web/graphql/schema'
import { useI18n } from '@island.is/skilavottord-web/i18n'

import NavigationLinks from '@island.is/skilavottord-web/components/NavigationLinks/NavigationLinks'
import PageHeader from '@island.is/skilavottord-web/components/PageHeader/PageHeader'
import { CarsTable } from './components'

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
          recyclingPartnerId
          nameOfRequestor
          createdAt
          recyclingPartner {
            companyId
            companyName
            municipalityId
            municipality {
              companyName
            }
          }
        }
      }
    }
  }
`

const Overview: FC<React.PropsWithChildren<unknown>> = () => {
  const { user } = useContext(UserContext)
  const {
    t: { recyclingFundOverview: t, routes },
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
    <PartnerPageLayout side={<NavigationLinks activeSection={0} />}>
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

        <PageHeader title={t.title} info={t.info} />

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
