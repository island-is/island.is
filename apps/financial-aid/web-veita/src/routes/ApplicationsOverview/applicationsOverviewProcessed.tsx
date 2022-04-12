import React, { useEffect, useState } from 'react'
import { Text, Box } from '@island.is/island-ui/core'
import { useRouter } from 'next/router'
import { useLazyQuery } from '@apollo/client'

import {
  ApplicationsTable,
  FilterPopover,
} from '@island.is/financial-aid-web/veita/src/components'
import {
  ApplicationState,
  Application,
} from '@island.is/financial-aid/shared/lib'
import { ApplicationFilterQuery } from '@island.is/financial-aid-web/veita/graphql/sharedGql'
import { navigationItems } from '@island.is/financial-aid-web/veita/src/utils/navigation'

interface Filters {
  selectedStates: ApplicationState[]
  selectedMonths: number[]
}

export const ApplicationsOverviewProcessed = () => {
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

  const onFilterClear = () => {
    setFilters({ selectedMonths: [], selectedStates: [] })
  }

  const onFilterSave = () => {
    filter()
  }

  const filter = () => {
    getApplications({
      variables: {
        input: {
          states:
            filters.selectedStates.length === 0
              ? [ApplicationState.APPROVED, ApplicationState.REJECTED]
              : filters.selectedStates,
          months: filters.selectedMonths,
        },
      },
    })
  }

  const [getApplications, { data, error, loading }] = useLazyQuery<{
    applicationFilter: Application[]
  }>(ApplicationFilterQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const currentNavigationItem =
    navigationItems.find((i) => i.link === router.pathname) ||
    navigationItems[0]

  useEffect(() => {
    filter()
  }, [])

  return (
    <>
      <Box className={`contentUp delay-25`} marginTop={15}>
        <Text as="h1" variant="h1" marginBottom={[2, 2, 4]}>
          {currentNavigationItem.label}
        </Text>
      </Box>
      <FilterPopover
        selectedMonths={filters.selectedMonths}
        selectedStates={filters.selectedStates}
        results={data?.applicationFilter?.length}
        onChecked={onChecked}
        onFilterClear={onFilterClear}
        onFilterSave={onFilterSave}
      />
      {data?.applicationFilter && (
        <ApplicationsTable
          headers={currentNavigationItem.headers}
          applications={data?.applicationFilter}
          setApplications={() => {}}
        />
      )}
      {error && (
        <div>
          Abbabab mistókst að sækja umsóknir, ertu örugglega með aðgang að þessu
          upplýsingum?
        </div>
      )}
    </>
  )
}

export default ApplicationsOverviewProcessed
