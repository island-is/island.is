import React, { useEffect, useState } from 'react'
import { Text, Box } from '@island.is/island-ui/core'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import {
  ApplicationOverviewSkeleton,
  ApplicationsTable,
  FilterPopover,
  LoadingContainer,
} from '@island.is/financial-aid-web/veita/src/components'

import {
  ApplicationState,
  Application,
  getStateUrlFromRoute,
} from '@island.is/financial-aid/shared/lib'

import { ApplicationsQuery } from '@island.is/financial-aid-web/veita/graphql/sharedGql'

import { navigationItems } from '@island.is/financial-aid-web/veita/src/utils/navigation'

interface Filters {
  selectedStates: ApplicationState[]
  selectedMonths: number[]
}

interface ApplicationsProvider {
  applications?: Application[]
}

export const ApplicationsOverview = () => {
  const router = useRouter()

  const [filters, setFilters] = useState<Filters>({
    selectedStates: router?.query?.stada
      ? ((router?.query?.stada as string).split(',') as ApplicationState[])
      : [],
    selectedMonths: router?.query?.timabil
      ? (router?.query?.timabil as string).split(',').map(Number)
      : [],
  })

  const onChecked = (item: ApplicationState | number, checked: boolean) => {
    const filtersCopy = { ...filters }

    if (typeof item === 'number') {
      checked
        ? filters.selectedMonths.push(item)
        : filters.selectedMonths.splice(filters.selectedMonths.indexOf(item), 1)
    } else {
      checked
        ? filters.selectedStates.push(item)
        : filters.selectedStates.splice(filters.selectedStates.indexOf(item), 1)
    }

    setFilters(filtersCopy)
  }

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

  const finishedApplicationsPage = currentNavigationItem.link === '/afgreidd'

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
      {finishedApplicationsPage && (
        <FilterPopover
          selectedMonths={filters.selectedMonths}
          selectedStates={filters.selectedStates}
          results={80}
          onChecked={onChecked}
          onFilterClear={() => { }}
          onFilterSave={() => { }}
        />
      )}
      {applications && (
        <ApplicationsTable
          headers={currentNavigationItem.headers}
          applications={applications}
          setApplications={setApplications}
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
