import React, { useEffect, useState, useContext } from 'react'
import { Text, Box } from '@island.is/island-ui/core'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import {
  ApplicationOverviewSkeleton,
  ApplicationsTable,
} from '@island.is/financial-aid-web/veita/src/components'

import {
  ApplicationState,
  Application,
} from '@island.is/financial-aid/shared/lib'

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

  const [applications, setApplications] = useState<Application[]>()

  useEffect(() => {
    if (data?.applications) {
      setApplications(
        data.applications.filter((item) =>
          currentNavigationItem?.applicationState.includes(item?.state),
        ),
      )
    }
  }, [data, router])

  if (currentNavigationItem) {
    return (
      <>
        <Box
          className={`contentUp delay-25`}
          marginTop={15}
          key={currentNavigationItem.label}
        >
          <Text as="h1" variant="h1" marginBottom={[2, 2, 4]}>
            {currentNavigationItem.label}
          </Text>
        </Box>

        {applications && (
          <ApplicationsTable
            className={`contentUp delay-50`}
            headers={currentNavigationItem.headers}
            applications={applications}
          />
        )}

        {error && (
          <div>
            Abbabab mistókst að sækja umsóknir, ertu örugglega með aðgang að
            þessu upplýsingum?{' '}
          </div>
        )}

        {loading && <ApplicationOverviewSkeleton />}
      </>
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
