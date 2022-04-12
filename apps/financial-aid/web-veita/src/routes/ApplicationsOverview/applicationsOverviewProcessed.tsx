import React, { useEffect, useState } from 'react'
import { Text, Box, Pagination } from '@island.is/island-ui/core'
import { useRouter } from 'next/router'
import { useLazyQuery } from '@apollo/client'

import {
  ApplicationsTable,
  FilterPopover,
} from '@island.is/financial-aid-web/veita/src/components'
import {
  ApplicationState,
  ApplicationPagination,
} from '@island.is/financial-aid/shared/lib'
import { ApplicationFilterQuery } from '@island.is/financial-aid-web/veita/graphql/sharedGql'
import { navigationItems } from '@island.is/financial-aid-web/veita/src/utils/navigation'

interface Filters {
  selectedStates: ApplicationState[]
  selectedMonths: number[]
}

export const ApplicationsOverviewProcessed = () => {
  const router = useRouter()

  const [currentPage, setCurrentPage] = useState<number>(
    router.query.sida ? parseInt(router.query.sida as string) : 1,
  )
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

  const onFilterSave = () => {
    setQuery()
    setCurrentPage(1)
  }

  const onFilterClear = () => {
    setFilters({ selectedMonths: [], selectedStates: [] })
    setQuery()
    setCurrentPage(1)
  }

  const setQuery = () => {
    const query = new URLSearchParams()
    query.append('timabil', filters.selectedMonths.join(','))
    query.append('stada', filters.selectedStates.join(','))
    query.append('sida', currentPage.toString())

    router.push({ search: query.toString() })
  }

  const [getApplications, { data, error, loading }] = useLazyQuery<{
    filterApplications: ApplicationPagination
  }>(ApplicationFilterQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const currentNavigationItem =
    navigationItems.find((i) => i.link === router.pathname) ||
    navigationItems[0]

  useEffect(() => {
    getApplications({
      variables: {
        input: {
          states: filters.selectedStates,
          months: filters.selectedMonths,
          page: currentPage,
        },
      },
    })
  }, [router.query, currentPage])

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
        results={data?.filterApplications?.totalCount}
        onChecked={onChecked}
        onFilterClear={onFilterClear}
        onFilterSave={onFilterSave}
      />
      {data?.filterApplications?.applications && (
        <ApplicationsTable
          headers={currentNavigationItem.headers}
          applications={data?.filterApplications?.applications}
          setApplications={() => { }}
        />
      )}
      <Pagination
        page={currentPage}
        renderLink={(page, className, children) => (
          <Box
            cursor="pointer"
            className={className}
            onClick={() => setCurrentPage(page)}
          >
            {children}
          </Box>
        )}
        totalPages={
          data?.filterApplications.totalCount
            ? Math.ceil(data?.filterApplications.totalCount / 2)
            : 0
        }
      />
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
