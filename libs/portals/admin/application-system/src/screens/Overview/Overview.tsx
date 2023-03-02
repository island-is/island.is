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
import invertBy from 'lodash/invertBy'
import flatten from 'lodash/flatten'
import uniq from 'lodash/uniq'
import { Filters } from '../../components/Filters/Filters'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { ApplicationsTable } from '../../components/ApplicationsTable/ApplicationsTable'
import { ApplicationFilters, MultiChoiceFilter } from '../../types/filters'
import { Organization } from '@island.is/shared/types'
import { institutionMapper } from '@island.is/application/types'

const defaultFilters: ApplicationFilters = {
  nationalId: '',
  period: {},
}

const defaultMultiChoiceFilters: Record<
  MultiChoiceFilter,
  string[] | undefined
> = {
  [MultiChoiceFilter.STATUS]: undefined, // Server side
  [MultiChoiceFilter.INSTITUTION]: undefined, // Server side
  [MultiChoiceFilter.APPLICATION]: undefined, // Client side
}

const pageSize = 12

const Overview = () => {
  const institutionApplications = invertBy(institutionMapper)
  const { formatMessage } = useLocale()
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState(defaultFilters)
  const [availableApplications, setAvailableApplications] = useState<string[]>()
  const [institutionFilters, setInstitutionFilters] = useState<string[]>()
  const [multiChoiceFilters, setMultiChoiceFilters] = useState(
    defaultMultiChoiceFilters,
  )

  const { data: orgData, loading: orgsLoading } = useGetOrganizationsQuery({
    ssr: false,
  })

  const { data, loading: queryLoading, refetch } = useGetApplicationsQuery({
    ssr: false,
    // Set fetch policy to standby and manually refetch when filters change
    // This is because Apollo is not detecting changes in the cache when arrays are updated
    fetchPolicy: 'standby',
    variables: {
      input: {
        nationalId: filters.nationalId ?? '',
        status: multiChoiceFilters[MultiChoiceFilter.STATUS],
        typeId: institutionFilters,
      },
    },
    onCompleted: (q) => {
      // Initialize available applications from the initial response
      // So that we can use them to filter by
      if (!availableApplications) {
        const names = q.applicationApplicationsAdmin
          ?.filter((x) => !!x.name)
          .map((x) => x.name ?? '')
        if (names) {
          setAvailableApplications(uniq(names))
        }
      }
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
    if (categoryId === MultiChoiceFilter.INSTITUTION) {
      // Special case for instutitions, because we need to map institution slugs to application typeIds
      const typeIds = flatten(selected.map((x) => institutionApplications[x]))
      setInstitutionFilters(typeIds.length > 0 ? typeIds : undefined)
    }

    setMultiChoiceFilters((prev) => ({
      ...prev,
      [categoryId]: selected.length > 0 ? selected : undefined,
    }))
  }

  const onDateChange = (period: ApplicationFilters['period']) => {
    // TODO: Filter this in frontend?
    setFilters((prev) => ({
      ...prev,
      period,
    }))
  }

  const clearFilters = () => {
    setFilters(defaultFilters)
    setMultiChoiceFilters(defaultMultiChoiceFilters)
    setInstitutionFilters(undefined)
  }

  // Listen to filter changes and refetch data
  useEffect(refetchData, [filters, multiChoiceFilters, refetch])

  const filteredApplicationList = multiChoiceFilters[
    MultiChoiceFilter.APPLICATION
  ]
    ? applicationAdminList?.filter(
        (x) =>
          !!x.name &&
          multiChoiceFilters[MultiChoiceFilter.APPLICATION]?.includes(x.name),
      )
    : applicationAdminList

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
        applications={availableApplications ?? []}
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
          applications={filteredApplicationList ?? []}
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
