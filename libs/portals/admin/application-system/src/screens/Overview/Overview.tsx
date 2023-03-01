import React, { useEffect, useState } from 'react'
import {
  Box,
  SkeletonLoader,
  Text,
  Breadcrumbs,
  FilterMultiChoiceProps,
} from '@island.is/island-ui/core'
import {
  useGetApplicationsQuery,
  useGetOrganizationsQuery,
} from '../../queries/overview.generated'
import { Filters } from '../../components/Filters/Filters'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { ApplicationsTable } from '../../components/ApplicationsTable/ApplicationsTable'
import { ApplicationFilters, MultiChoiceFilter } from '../../types/filters'
import { Organization } from '@island.is/shared/types'

const defaultFilters: ApplicationFilters = {
  nationalId: '',
  institution: '',
  period: {},
}

const defaultMultiChoiceFilters: Record<
  MultiChoiceFilter,
  string[] | undefined
> = {
  [MultiChoiceFilter.STATUS]: undefined,
  [MultiChoiceFilter.INSTITUTION]: undefined,
  [MultiChoiceFilter.APPLICATION]: undefined,
}

const pageSize = 12

const Overview = () => {
  const { formatMessage } = useLocale()
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState(defaultFilters)
  const [multiChoiceFilters, setMultiChoiceFilters] = useState(
    defaultMultiChoiceFilters,
  )

  const { data: orgData, loading: orgsLoading } = useGetOrganizationsQuery({
    ssr: false,
    fetchPolicy: 'cache-and-network',
  })

  const { data, loading: queryLoading, refetch } = useGetApplicationsQuery({
    ssr: false,
    fetchPolicy: 'standby',
    variables: {
      input: {
        nationalId: filters.nationalId ?? '',
        status: multiChoiceFilters[MultiChoiceFilter.STATUS],
      },
    },
  })

  const isLoading = queryLoading || orgsLoading
  const { applicationApplicationsAdmin: applicationAdminList = [] } = data ?? {}
  const organizations = (orgData?.getOrganizations?.items ??
    []) as Organization[]

  const refetchData = () => {
    setPage(1)
    refetch()
  }

  const handleSearchChange = (nationalId: string) => {
    setFilters((prev) => ({
      ...prev,
      nationalId,
    }))
  }

  const handleFilterChange: FilterMultiChoiceProps['onChange'] = ({
    categoryId,
    selected,
  }) => {
    setMultiChoiceFilters((prev) => ({
      ...prev,
      [categoryId]: selected.length > 0 ? selected : undefined,
    }))
  }

  const onDateChange = (period: ApplicationFilters['period']) => {
    setFilters((prev) => ({
      ...prev,
      period,
    }))
  }

  const clearFilters = () => {
    setFilters(defaultFilters)
    setMultiChoiceFilters(defaultMultiChoiceFilters)
  }

  useEffect(refetchData, [filters, multiChoiceFilters, refetch])

  return (
    <Box>
      <Breadcrumbs
        items={[
          { title: 'Ísland.is', href: '/stjornbord' },
          { title: formatMessage(m.applicationSystem) },
        ]}
      />
      <Text variant="h3" marginBottom={[3, 3, 6]} marginTop={3}>
        {formatMessage(m.applicationSystemApplications)}
      </Text>
      <Filters
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onFilterClear={clearFilters}
        filters={multiChoiceFilters}
        organizations={organizations}
        numberOfDocuments={applicationAdminList?.length}
      />
      {isLoading ? (
        <SkeletonLoader
          height={60}
          repeat={10}
          space={2}
          borderRadius="large"
        />
      ) : (
        <ApplicationsTable
          applications={applicationAdminList ?? []}
          organizations={organizations}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
        />
      )}
    </Box>
  )
}

export default Overview
