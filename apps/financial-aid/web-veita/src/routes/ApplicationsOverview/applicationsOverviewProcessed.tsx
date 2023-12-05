import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useLazyQuery } from '@apollo/client'

import { Text, Box, Pagination } from '@island.is/island-ui/core'
import {
  ApplicationsTable,
  FilterPopover,
} from '@island.is/financial-aid-web/veita/src/components'
import {
  ApplicationState,
  ApplicationPagination,
  applicationPageSize,
  getStateUrlFromRoute,
  getStateFromUrl,
} from '@island.is/financial-aid/shared/lib'
import { ApplicationFilterQuery } from '@island.is/financial-aid-web/veita/graphql/sharedGql'
import { navigationItems } from '@island.is/financial-aid-web/veita/src/utils/navigation'
import { container } from './applicationsOverviewProcessed.css'

interface Filters {
  selectedStates: ApplicationState[]
  selectedMonths: number[]
}

export const ApplicationsOverviewProcessed = () => {
  const router = useRouter()

  const [currentPage, setCurrentPage] = useState<number>(
    router?.query?.page ? parseInt(router.query.page as string) : 1,
  )
  const currentNavigationItem =
    navigationItems.find((i) => i.link === router.pathname) ||
    navigationItems[0]

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

  const onFilterClear = () => {
    setFilters({ selectedMonths: [], selectedStates: [] })
    setCurrentPage(1)
    filter(1, { selectedMonths: [], selectedStates: [] })
  }

  const onFilterSave = () => {
    setCurrentPage(1)
    filter(1, filters)
  }

  const onPageChange = (page: number) => {
    setCurrentPage(page)
    filter(page, filters)
  }
  const filter = (page: number, searchFilters: Filters) => {
    getApplications({
      variables: {
        input: {
          states: searchFilters.selectedStates,
          months: searchFilters.selectedMonths,
          page: page,
        },
      },
    })

    const query = new URLSearchParams()
    query.append('page', page.toString())

    if (searchFilters.selectedMonths.length > 0) {
      query.append('month', filters.selectedMonths.join(','))
    }
    if (searchFilters.selectedStates.length > 0) {
      query.append('state', filters.selectedStates.join(','))
    }

    router.push({ search: query.toString() })
  }

  const [getApplications, { data, error }] = useLazyQuery<{
    filterApplications: ApplicationPagination
  }>(ApplicationFilterQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  useEffect(() => {
    filter(currentPage, filters)
  }, [])

  return (
    <Box
      className={container}
      display="flex"
      flexDirection="column"
      justifyContent="spaceBetween"
    >
      <Box>
        <Box className={`contentUp delay-25`} marginTop={15}>
          <Text as="h1" variant="h1" marginBottom={[2, 2, 4]}>
            {currentNavigationItem.label}
          </Text>
        </Box>
        <FilterPopover
          stateOptions={currentNavigationItem?.filterStates}
          selectedMonths={filters.selectedMonths}
          selectedStates={filters.selectedStates}
          results={data?.filterApplications?.totalCount ?? 0}
          onChecked={onChecked}
          onFilterClear={onFilterClear}
          onFilterSave={onFilterSave}
        />
        {data?.filterApplications?.applications && (
          <ApplicationsTable
            headers={currentNavigationItem.headers}
            applications={data?.filterApplications?.applications}
            emptyText="Engar umsóknir fundust með þessum leitarskilyrðum 👀"
            defaultHeaderSort={currentNavigationItem.defaultHeaderSort}
          />
        )}
        {error && (
          <div>
            Abbabab mistókst að sækja umsóknir, ertu örugglega með aðgang að
            þessu upplýsingum?
          </div>
        )}
      </Box>

      <Box marginBottom={[3, 3, 7]}>
        <Pagination
          page={currentPage}
          totalPages={
            data?.filterApplications
              ? Math.ceil(
                  data?.filterApplications.totalCount / applicationPageSize,
                )
              : 0
          }
          renderLink={(page, className, children) => (
            <Box
              cursor="pointer"
              className={className}
              onClick={() => onPageChange(page)}
            >
              {children}
            </Box>
          )}
        />
      </Box>
    </Box>
  )
}

export default ApplicationsOverviewProcessed
