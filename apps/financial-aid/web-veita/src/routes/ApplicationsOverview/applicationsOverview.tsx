import React, { useEffect, useState } from 'react'
import { Text, Box } from '@island.is/island-ui/core'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import {
  ApplicationOverviewSkeleton,
  ApplicationsTable,
  LoadingContainer,
} from '@island.is/financial-aid-web/veita/src/components'

import {
  Application,
  getStateUrlFromRoute,
} from '@island.is/financial-aid/shared/lib'

import { ApplicationsQuery } from '@island.is/financial-aid-web/veita/graphql/sharedGql'

import { navigationItems } from '@island.is/financial-aid-web/veita/src/utils/navigation'

interface ApplicationsProvider {
  applications?: Application[]
}

export const ApplicationsOverview = () => {
  const router = useRouter()

  const { data, error, loading } = useQuery<ApplicationsProvider>(
    ApplicationsQuery,
    {
      variables: {
        input: { stateUrl: getStateUrlFromRoute[router.pathname] },
      },
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  )

  const currentNavigationItem =
    navigationItems.find((i) => i.link === router.pathname) ||
    navigationItems[0]

  const [applications, setApplications] = useState<Application[]>()

  useEffect(() => {
    if (data?.applications) {
      setApplications(data.applications)
    }
  }, [data, router])

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
          defaultHeaderSort={currentNavigationItem.defaultHeaderSort}
        />
      )}

      {error && (
        <div>
          Abbabab mistókst að sækja umsóknir, ertu örugglega með aðgang að þessu
          upplýsingum?
        </div>
      )}
    </LoadingContainer>
  )
}

export default ApplicationsOverview
