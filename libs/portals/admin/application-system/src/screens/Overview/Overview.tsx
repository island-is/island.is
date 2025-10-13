import { useEffect, useState } from 'react'
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
import { getFilteredApplications } from '../../shared/utils'
import { AdminApplication } from '../../types/adminApplication'
import { ApplicationSystemPaths } from '../../lib/paths'

const defaultFilters: ApplicationFilters = {
  nationalId: '',
  period: {},
}

const defaultMultiChoiceFilters: Record<
  MultiChoiceFilter,
  string[] | undefined
> = {
  [MultiChoiceFilter.STATUS]: undefined,
  [MultiChoiceFilter.INSTITUTION]: undefined,
  [MultiChoiceFilter.APPLICATION]: undefined,
  [MultiChoiceFilter.TYPE_ID]: undefined,
}

const pageSize = 12

const Overview = () => {
  const institutionApplications = invertBy(institutionMapper, (application) => {
    return application.slug
  })
  const { formatMessage } = useLocale()
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState(defaultFilters)
  const [availableApplications, setAvailableApplications] = useState<string[]>()
  const [institutionFilters, setInstitutionFilters] = useState<string[]>()
  const [multiChoiceFilters, setMultiChoiceFilters] = useState(
    defaultMultiChoiceFilters,
  )

  const nationalId = filters.nationalId?.replace('-', '') ?? ''

  const { data: orgData, loading: orgsLoading } = useGetOrganizationsQuery({
    ssr: false,
  })

  const { data, loading: queryLoading } = useGetApplicationsQuery({
    ssr: false,
    variables: {
      input: { nationalId },
    },
    onCompleted: (q) => {
      // Initialize available applications from the initial response
      // So that we can use them to filter by
      const names = q.applicationApplicationsAdmin
        ?.filter((x) => !!x.name)
        .map((x) => x.name ?? '')
      if (names) {
        setAvailableApplications(uniq(names))
      }
    },
  })

  const isLoading = queryLoading || orgsLoading
  const { applicationApplicationsAdmin = [] } = data ?? {}
  const applicationAdminList =
    applicationApplicationsAdmin as AdminApplication[]
  const organizations = (orgData?.getOrganizations?.items ??
    []) as Organization[]

  // Get organizations of all applications currently fetched
  const typeIds = applicationAdminList?.map((x) => x.typeId) as string[]
  const availableOrganizations = organizations?.filter((x) => {
    const allApplications = institutionApplications[x.slug]
    return allApplications?.some((x) => typeIds?.includes(x))
  })

  const handleSearchChange = (nationalId: string) => {
    if (nationalId.replace('-', '').length === 10) {
      setFilters((prev) => ({
        ...prev,
        nationalId,
      }))
    }
  }

  const handleMultiChoiceFilterChange: FilterMultiChoiceProps['onChange'] = ({
    categoryId,
    selected,
  }) => {
    if (categoryId === MultiChoiceFilter.INSTITUTION) {
      // Special case for institutions, because we need to map institution slugs to application typeIds
      const typeIds = flatten(selected.map((x) => institutionApplications[x]))
      setInstitutionFilters(typeIds.length > 0 ? typeIds : undefined)
    }

    setMultiChoiceFilters((prev) => ({
      ...prev,
      [categoryId]: selected.length > 0 ? selected : undefined,
    }))
  }

  const handleDateChange = (period: ApplicationFilters['period']) => {
    const update = { ...filters.period, ...period }
    setFilters((prev) => ({
      ...prev,
      period: update,
    }))
  }

  const clearFilters = (categoryId?: string) => {
    if (!categoryId) {
      // Clear all filters (except nationalId)
      setFilters((prev) => ({ ...prev, period: {} }))
      setMultiChoiceFilters(defaultMultiChoiceFilters)
      setInstitutionFilters(undefined)
      return
    }

    if (categoryId === MultiChoiceFilter.INSTITUTION) {
      setInstitutionFilters(undefined)
    }

    setMultiChoiceFilters((prev) => ({
      ...prev,
      [categoryId]: undefined,
    }))
  }

  // Reset the page on filter change
  useEffect(() => setPage(1), [filters, multiChoiceFilters])

  const filteredApplicationList = getFilteredApplications(
    applicationAdminList ?? [],
    { multiChoiceFilters, institutionFilters, period: filters.period },
  )

  return (
    <Box>
      <Breadcrumbs
        items={[
          { title: 'Ísland.is', href: '/stjornbord' },
          {
            title: formatMessage(m.applicationSystem),
            href: `/stjornbord${ApplicationSystemPaths.Root}`,
          },
          { title: formatMessage(m.overview) },
        ]}
      />
      <Text variant="h3" as="h1" marginBottom={[3, 3, 6]} marginTop={3}>
        {formatMessage(m.applicationSystemApplications)}
      </Text>
      <Filters
        onSearchChange={handleSearchChange}
        onFilterChange={handleMultiChoiceFilterChange}
        onDateChange={handleDateChange}
        onFilterClear={clearFilters}
        multiChoiceFilters={multiChoiceFilters}
        filters={filters}
        applications={availableApplications ?? []}
        organizations={availableOrganizations ?? []}
        numberOfDocuments={applicationAdminList?.length}
      />
      {isLoading && nationalId.length === 10 ? (
        <SkeletonLoader
          height={60}
          repeat={10}
          space={2}
          borderRadius="large"
        />
      ) : nationalId === '' ? (
        <Box display="flex" justifyContent="center" marginTop={[3, 3, 6]}>
          <Text variant="h4">
            {formatMessage(m.pleaseEnterValueToBeingSearch)}
          </Text>
        </Box>
      ) : (
        <ApplicationsTable
          applications={filteredApplicationList ?? []}
          organizations={organizations}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          shouldShowCardButtons={false}
        />
      )}
    </Box>
  )
}

export default Overview
