import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FC, useContext, useEffect, useRef } from 'react'

import {
  Box,
  BreadcrumbsDeprecated as Breadcrumbs,
  Button,
  GridColumn,
  LoadingDots,
  Stack,
  Text,
} from '@island.is/island-ui/core'

import { hasPermission } from '@island.is/skilavottord-web/auth/utils'
import {
  PartnerPageLayout,
  Sidenav,
} from '@island.is/skilavottord-web/components'
import PageHeader from '@island.is/skilavottord-web/components/PageHeader/PageHeader'
import { UserContext } from '@island.is/skilavottord-web/context'
import { Query, Vehicle } from '@island.is/skilavottord-web/graphql/schema'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import { BASE_PATH } from '@island.is/skilavottord/consts'
import { CarsTable } from './components/CarsTable'
import AuthGuard from '@island.is/skilavottord-web/components/AuthGuard/AuthGuard'

export const SkilavottordRecyclingPartnerVehiclesQuery = gql`
  query skilavottordRecyclingPartnerVehiclesQuery($after: String!) {
    skilavottordRecyclingPartnerVehicles(first: 20, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      count
      items {
        vehicleId
        vehicleType
        newregDate
        recyclingRequests {
          id
          requestType
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
    t: { deregisterOverview: t, deregisterSidenav: sidenavText, routes },
  } = useI18n()
  const router = useRouter()

  const {
    data: vehicleData,
    loading,
    fetchMore,
  } = useQuery<Query>(SkilavottordRecyclingPartnerVehiclesQuery, {
    notifyOnNetworkStatusChange: true,
    variables: {
      after: '',
    },
  })

  const { pageInfo, items: vehicles = [] } =
    vehicleData?.skilavottordRecyclingPartnerVehicles ?? {}

  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (loading) {
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const { hasNextPage, endCursor } = pageInfo || {}
        if (entries[0].isIntersecting && hasNextPage) {
          fetchMore({
            variables: { after: endCursor },
            updateQuery: (
              { skilavottordRecyclingPartnerVehicles },
              { fetchMoreResult },
            ) => {
              const prevResults = skilavottordRecyclingPartnerVehicles
              const newResults =
                fetchMoreResult?.skilavottordRecyclingPartnerVehicles
              return {
                skilavottordRecyclingPartnerVehicles: {
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

  const handleDeregister = () => {
    router.push(`${routes.deregisterVehicle.select}`)
  }

  return (
    <AuthGuard permission="deregisterVehicle" loading={loading && !vehicleData}>
      <PartnerPageLayout
        side={
          <Sidenav
            title={sidenavText.title}
            sections={[
              {
                icon: 'car',
                title: `${sidenavText.deregister}`,
                link: `${routes.deregisterVehicle.baseRoute}`,
              },
              {
                icon: 'business',
                title: `${sidenavText.companyInfo}`,
                link: `${routes.companyInfo.baseRoute}`,
              },
              {
                ...(user?.role &&
                hasPermission('accessControlCompany', user.role)
                  ? {
                      icon: 'lockClosed',
                      title: `${sidenavText.accessControl}`,
                      link: `${routes.accessControlCompany}`,
                    }
                  : null),
              } as React.ComponentProps<typeof Sidenav>['sections'][0],
            ].filter(Boolean)}
            activeSection={0}
          />
        }
      >
        <Stack space={6}>
          <GridColumn span={['8/8', '8/8', '7/8', '7/8']}>
            <Stack space={4}>
              <Breadcrumbs>
                <Link href={`${BASE_PATH}${routes.home['recyclingCompany']}`}>
                  Ísland.is
                </Link>
                <span>{t.title}</span>
              </Breadcrumbs>
              <PageHeader title={t.title} info={t.info} />
              <Box marginTop={4}>
                <Button onClick={handleDeregister}>
                  {t.buttons.deregister}
                </Button>
              </Box>
            </Stack>
          </GridColumn>
          {vehicles?.length > 0 && (
            <Box marginX={1}>
              <Stack space={4}>
                <Text variant="h3">{t.subtitles.history}</Text>
                <CarsTable titles={t.table} deregisteredVehicles={vehicles} />
              </Stack>
            </Box>
          )}
          {loading && (
            <Box display="flex" justifyContent="center">
              <LoadingDots />
            </Box>
          )}
          <div ref={triggerRef} />
        </Stack>
      </PartnerPageLayout>
    </AuthGuard>
  )
}

export default Overview
