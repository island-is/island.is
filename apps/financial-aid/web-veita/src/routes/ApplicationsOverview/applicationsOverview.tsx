import React, { useEffect, useState } from 'react'
import { Text, Box, Link } from '@island.is/island-ui/core'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import {
  ApplicationOverviewSkeleton,
  ApplicationsTable,
  LoadingContainer,
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
      variables: {
        input: { stateUrl: router.pathname.substring(1) },
      },
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
      setApplications(data.applications)
    }
  }, [data, router])

  if (currentNavigationItem) {
    return (
      <LoadingContainer
        isLoading={loading}
        loader={<ApplicationOverviewSkeleton />}
      >
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
            headers={currentNavigationItem.headers}
            applications={applications}
            setApplications={setApplications}
          />
        )}

        {error && (
          <div>
            Abbabab mistókst að sækja umsóknir, ertu örugglega með aðgang að
            þessu upplýsingum?{' '}
          </div>
        )}
      </LoadingContainer>
    )
  }
  return (
    <div>
      <Box marginTop={15} className={`contentUp delay-25`}>
        <Text as="h1" variant="h1" marginBottom={[2, 2, 4]} marginTop={4}>
          Hefuru villst?
        </Text>
        <Link href="/nymal" color="blue600">
          Kíktu á nýmál
        </Link>
      </Box>
    </div>
  )
}

export default ApplicationsOverview
