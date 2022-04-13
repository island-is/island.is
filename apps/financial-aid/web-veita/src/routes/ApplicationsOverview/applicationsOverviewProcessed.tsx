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
  applicationPageSize,
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
    router?.query?.page ? parseInt(router.query.page as string) : 1,
  )
  const [filters, setFilters] = useState<Filters>({
    selectedStates: router?.query?.state
      ? ((router?.query?.state as string).split(',') as ApplicationState[])
      : [],
    selectedMonths: router?.query?.month
      ? (router?.query?.month as string).split(',').map(Number)
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

  const setQuery = (page: number, clearFilters?: boolean) => {
    const query = new URLSearchParams()
    query.append('month', clearFilters ? '' : filters.selectedMonths.join(','))
    query.append('state', clearFilters ? '' : filters.selectedStates.join(','))
    query.append('page', page.toString())

    router.push({ search: query.toString() })

    setCurrentPage(page)
    if (clearFilters) {
      setFilters({ selectedMonths: [], selectedStates: [] })
    }
  }

  const [getApplications, { data, error }] = useLazyQuery<{
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
  }, [router.query])

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
        onFilterClear={() => setQuery(1, true)}
        onFilterSave={() => setQuery(1)}
      />
      {data?.filterApplications?.applications && (
        <ApplicationsTable
          headers={currentNavigationItem.headers}
          applications={data?.filterApplications?.applications}
        />
      )}
      <Pagination
        page={currentPage}
        totalPages={
          data?.filterApplications.totalCount
            ? Math.ceil(
                data?.filterApplications.totalCount / applicationPageSize,
              )
            : 0
        }
        renderLink={(page, className, children) => (
          <Box
            cursor="pointer"
            className={className}
            onClick={() => setQuery(page)}
          >
            {children}
          </Box>
        )}
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
