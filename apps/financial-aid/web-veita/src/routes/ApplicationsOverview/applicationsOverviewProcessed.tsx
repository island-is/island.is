import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import {
  Text,
  Box,
  Pagination,
  SkeletonLoader,
  Button,
} from '@island.is/island-ui/core'
import {
  ApplicationsFilterTable,
  FilterDates,
  FilterPopover,
  LoadingContainer,
  TableSkeleton,
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
    onClearFilterOrFillFromRoute,
    handleDateChange,
    onFilterClearAll,
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
    onClearFilterOrFillFromRoute()
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

        <LoadingContainer
          isLoading={staffList === undefined}
          loader={<SkeletonLoader height={64} />}
        >
          <Box
            display="flex"
            alignItems="flexEnd"
            rowGap={1}
            columnGap={2}
            flexWrap="wrap"
            marginBottom={4}
          >
            {staffList && (
              <FilterPopover
                stateOptions={statesOnRoute}
                staffOptions={staffList}
                activeFilters={activeFilters}
                onChecked={onChecked}
                onFilterClear={onFilterClear}
              />
            )}

            <FilterDates
              onDateChange={handleDateChange}
              periodFrom={activeFilters.period.from}
              periodTo={activeFilters.period.to}
              minDateCreated={minDateCreated}
            />

            <Box>
              <Text fontWeight="semiBold" whiteSpace="nowrap">
                {`${totalCount} ${
                  totalCount === 1 ? 'niðurstaða' : 'niðurstöður'
                }`}
              </Text>
              <Button
                icon="reload"
                onClick={onFilterClearAll}
                variant="text"
                size="small"
              >
                Hreinsa síu
              </Button>
            </Box>
          </Box>
        </LoadingContainer>

        <LoadingContainer isLoading={loading} loader={<TableSkeleton />}>
          {applications && applications.length > 0 ? (
            <ApplicationsFilterTable
              headers={headers}
              applications={applications}
              defaultHeaderSort={defaultHeaderSort}
            />
          ) : (
            <Text marginTop={2}>Engar umsóknir bíða þín, vel gert 👏</Text>
          )}
        </LoadingContainer>

        {error && (
          <div>
            Abbabab mistókst að sækja umsóknir, ertu örugglega með aðgang að
            þessu upplýsingum?
          </div>
        )}
      </Box>

      <Box marginBottom={[3, 3, 7]}>
        <LoadingContainer
          isLoading={totalCount === undefined}
          loader={<SkeletonLoader height={32} />}
        >
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
        </LoadingContainer>
      </Box>
    </Box>
  )
}

export default ApplicationsOverviewProcessed
