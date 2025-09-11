import { useQuery } from '@apollo/client'

import NextLink from 'next/link'
import React, { FC, useEffect, useRef } from 'react'

import {
  Box,
  Breadcrumbs,
  LoadingDots,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { PartnerPageLayout } from '@island.is/skilavottord-web/components/Layouts'
import { Query, Vehicle } from '@island.is/skilavottord-web/graphql/schema'
import { useI18n } from '@island.is/skilavottord-web/i18n'

import AuthGuard from '@island.is/skilavottord-web/components/AuthGuard/AuthGuard'
import NavigationLinks from '@island.is/skilavottord-web/components/NavigationLinks/NavigationLinks'
import PageHeader from '@island.is/skilavottord-web/components/PageHeader/PageHeader'
import { SkilavottordVehiclesQuery } from '@island.is/skilavottord-web/graphql/queries'
import { CarsTable } from './components'

const Overview: FC<React.PropsWithChildren<unknown>> = () => {
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

  return (
    <AuthGuard permission="recycledVehicles" loading={loading && !data}>
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
    </AuthGuard>
  )
}

export default Overview
