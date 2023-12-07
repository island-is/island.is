import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { Text, Box, Pagination } from '@island.is/island-ui/core'
import {
  ApplicationsTable,
  FilterDates,
  FilterPopover,
} from '@island.is/financial-aid-web/veita/src/components'
import {
  ApplicationPagination,
  applicationPageSize,
  getStateFromRoute,
} from '@island.is/financial-aid/shared/lib'
import { navigationItems } from '@island.is/financial-aid-web/veita/src/utils/navigation'
import { container } from './applicationsOverviewProcessed.css'
import useFilter from '@island.is/financial-aid-web/veita/src/utils/useFilter'
import useApplicationFilter from '@island.is/financial-aid-web/veita/src/utils/useApplicationFilter'

export const ApplicationsOverviewProcessed = () => {
  const router = useRouter()

  const currentNavigationItem =
    navigationItems.find((i) => i.link === router.pathname) ||
    navigationItems[0]

  const { label, headers, defaultHeaderSort } = currentNavigationItem

  const statesOnRoute = getStateFromRoute[router.pathname]
  const [filterApplications, setFilterApplications] =
    useState<ApplicationPagination>()

  const { applications, staffList, totalCount, minDateCreated } =
    filterApplications || {}

  const {
    currentPage,
    setCurrentPage,
    activeFilters,
    onChecked,
    onFilterClear,
    ClearFilterOrFillFromRoute,
  } = useFilter(router)

  const { filterTable, error, loading } = useApplicationFilter(
    router,
    statesOnRoute,
    setFilterApplications,
  )

  useEffect(() => {
    filterTable(activeFilters, currentPage)
  }, [activeFilters])

  useEffect(() => {
    ClearFilterOrFillFromRoute()
  }, [router.pathname])

  const onPageChange = (page: number) => {
    setCurrentPage(page)
    filterTable(activeFilters, page)
  }

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
            {label}
          </Text>
        </Box>
        {staffList && (
          <FilterPopover
            stateOptions={statesOnRoute}
            staffOptions={staffList}
            activeFilters={activeFilters}
            onChecked={onChecked}
            onFilterClear={onFilterClear}
            results={totalCount ?? 0}
          />
        )}

        {minDateCreated && <FilterDates minDateCreated={minDateCreated} />}

        {applications && !loading && (
          <ApplicationsTable
            headers={headers}
            applications={applications}
            emptyText="Engar umsóknir fundust með þessum leitarskilyrðum 👀"
            defaultHeaderSort={defaultHeaderSort}
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
            totalCount ? Math.ceil(totalCount / applicationPageSize) : 0
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
