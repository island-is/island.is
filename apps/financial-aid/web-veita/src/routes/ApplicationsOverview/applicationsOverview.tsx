import React, { useEffect, useState, useContext } from 'react'
import { Text, Box, LoadingDots } from '@island.is/island-ui/core'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import {
  AdminLayout,
  ApplicationsTable,
} from '@island.is/financial-aid-web/veita/src/components'

import { ApplicationState, Application } from '@island.is/financial-aid/shared'

import { GetApplicationsQuery } from '@island.is/financial-aid-web/veita/graphql/sharedGql'

import { navigationItems } from '@island.is/financial-aid-web/veita/src/utils/navigation'

interface ApplicationsProvider {
  applications?: Application[]
}

export interface NavigationElement {
  label: string
  link: string
  applicationState: ApplicationState[]
  headers: TableHeadersProps[]
}

export interface TableHeadersProps {
  filterBy?: string
  title: string
}

export interface sortByProps {
  selected: 'modified' | 'state'
  sorted: 'asc' | 'dsc'
}

export const ApplicationsOverview = () => {
  const router = useRouter()

  const { data, error, loading } = useQuery<ApplicationsProvider>(
    GetApplicationsQuery,
    {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  )

  const currentNavigationItem = navigationItems.find(
    (i) => i.link === router.pathname,
  )

  const [sortBy, setSortBy] = useState<sortByProps>({
    selected: 'modified',
    sorted: 'asc',
  })

  const [applications, setApplications] = useState<Application[]>()

  useEffect(() => {
    if (data?.applications) {
      setApplications(
        data.applications
          .filter((item) =>
            currentNavigationItem?.applicationState.includes(item?.state),
          )
          .sort((a, b) =>
            a[sortBy.selected] > b[sortBy.selected]
              ? -1
              : a[sortBy.selected] < b[sortBy.selected]
              ? 1
              : 0,
          ),
      )
    }
  }, [data, router, sortBy])

  if (currentNavigationItem) {
    return (
      <AdminLayout>
        <Box className={`contentUp delay-25`} key={currentNavigationItem.label}>
          <Text as="h1" variant="h1" marginBottom={[2, 2, 4]} marginTop={15}>
            {currentNavigationItem.label}
          </Text>
        </Box>

        {applications && (
          <ApplicationsTable
            className={`contentUp delay-50`}
            headers={currentNavigationItem.headers}
            setSortBy={(filter) => {
              if (filter === 'modified' || filter === 'state') {
                setSortBy({ ...sortBy, selected: filter })
              }
            }}
            sortBy={sortBy}
            applications={applications}
          />
        )}

        {error && (
          <div>
            Abbabab mistókst að sækja umsóknir, ertu örugglega með aðgang að
            þessu upplýsingum?{' '}
          </div>
        )}

        {loading && <LoadingDots />}
      </AdminLayout>
    )
  }
  return (
    <div>
      <Box className={`contentUp delay-25`}>
        <Text as="h1" variant="h1" marginBottom={[2, 2, 4]} marginTop={4}>
          Enginn umsókn fundinn
        </Text>
      </Box>
    </div>
  )
}

export default ApplicationsOverview
