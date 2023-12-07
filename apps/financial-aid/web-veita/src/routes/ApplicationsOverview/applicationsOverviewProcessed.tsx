import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { Text, Box, Pagination } from '@island.is/island-ui/core'
import {
  ApplicationsTable,
  FilterPopover,
  SortableTableHeader,
  State,
  TableBody,
  TableContainer,
  TextTableItem,
  usePseudoName,
} from '@island.is/financial-aid-web/veita/src/components'
import {
  Application,
  ApplicationPagination,
  Routes,
  applicationPageSize,
  getMonth,
  getStateFromRoute,
} from '@island.is/financial-aid/shared/lib'
import { navigationItems } from '@island.is/financial-aid-web/veita/src/utils/navigation'
import { container } from './applicationsOverviewProcessed.css'
import useFilter from '@island.is/financial-aid-web/veita/src/utils/useFilter'
import useApplicationFilter from '@island.is/financial-aid-web/veita/src/utils/useApplicationFilter'
import useSortedApplications from '../../utils/useSortedApplications'
import { calcDifferenceInDate } from '../../utils/formHelper'

export const ApplicationsOverviewProcessed = () => {
  const router = useRouter()

  const currentNavigationItem =
    navigationItems.find((i) => i.link === router.pathname) ||
    navigationItems[0]

  const statesOnRoute = getStateFromRoute[router.pathname]
  const [applications, setApplications] = useState<Application[]>()
  const [staffList, setStaffList] = useState<StaffList[]>()

  const {
    currentPage,
    setCurrentPage,
    activeFilters,
    onChecked,
    onClearFilter,
  } = useFilter()

  const { filterTable, error } = useApplicationFilter(
    statesOnRoute,
    setFilterApplications,
  )

  useEffect(() => {
    filterTable(activeFilters, 1)
  }, [activeFilters, router])

  // console.log(router, 'router', activeFilters, 'activeFilters')

  const onPageChange = (page: number) => {
    setCurrentPage(page)
    // filter(page, activeFilters)
  }

  return (
    // TODO
    // <LoadingContainer
    //   isLoading={loading}
    //   loader={<ApplicationOverviewSkeleton />}
    // >
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
        {staffList && (
          <FilterPopover
            stateOptions={statesOnRoute}
            staffOptions={staffList}
            activeFilters={activeFilters}
            onChecked={onChecked}
          />
        )}

        {applications && (
          <ApplicationsTable
            headers={currentNavigationItem.headers}
            applications={applications}
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
    // </LoadingContainer>
  )
}

export default ApplicationsOverviewProcessed

// const { data, error } = useQuery<{
//   filterApplications: ApplicationPagination
// }>(ApplicationFilterQuery, {
//   variables: {
//     input: {
//       defaultStates: statesOnRoute,
//       states: [],
//       staff: [],
//       page: 1,
//     },
//   },
//   fetchPolicy: 'no-cache',
//   errorPolicy: 'all',
// })
