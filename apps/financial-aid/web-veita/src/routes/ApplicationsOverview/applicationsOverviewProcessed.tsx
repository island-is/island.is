import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useLazyQuery } from '@apollo/client'

import { Text, Box, Pagination } from '@island.is/island-ui/core'
import {
  ApplicationOverviewSkeleton,
  ApplicationsTable,
  FilterPopover,
  LoadingContainer,
} from '@island.is/financial-aid-web/veita/src/components'
import {
  ApplicationPagination,
  applicationPageSize,
  getStateFromRoute,
} from '@island.is/financial-aid/shared/lib'
import { ApplicationFilterQuery } from '@island.is/financial-aid-web/veita/graphql/sharedGql'
import { navigationItems } from '@island.is/financial-aid-web/veita/src/utils/navigation'
import { container } from './applicationsOverviewProcessed.css'
import useFilter, { Filters } from '../../utils/useFilter'

export const ApplicationsOverviewProcessed = () => {
  const router = useRouter()

  const currentNavigationItem =
    navigationItems.find((i) => i.link === router.pathname) ||
    navigationItems[0]

  const statesOnRoute = getStateFromRoute[router.pathname]

  const {
    currentPage,
    setCurrentPage,
    activeFilters,
    onChecked,
    onClearFilter,
  } = useFilter(router)

  const [getApplications, { data, error }] = useLazyQuery<{
    filterApplications: ApplicationPagination
  }>(ApplicationFilterQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const { applications, staffList } = data?.filterApplications ?? {}

  const onFilterClear = () => {
    onClearFilter()
    filter(1, activeFilters)
  }

  useEffect(() => {
    onFilterClear()
  }, [router.pathname])

  const onFilterSave = () => {
    setCurrentPage(1)
    filter(1, activeFilters)
  }

  const onPageChange = (page: number) => {
    setCurrentPage(page)
    filter(page, activeFilters)
  }

  const filter = (page: number, searchFilters: Filters) => {
    const { applicationState, staff } = searchFilters
    getApplications({
      variables: {
        input: {
          defaultStates: statesOnRoute,
          states: applicationState,
          months: [],
          staff: staff,
          page: page,
        },
      },
    })

    const query = new URLSearchParams()
    query.append('page', page.toString())

    if (applicationState.length > 0) {
      query.append('state', activeFilters.applicationState.join(','))
    }

    if (staff.length > 0) {
      query.append('staff', activeFilters.staff.join(','))
    }

    router.push({ search: query.toString() })
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
            onFilterSave={onFilterSave}
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
    // </LoadingContainer>
  )
}

export default ApplicationsOverviewProcessed
