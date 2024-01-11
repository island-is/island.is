import { useEffect, useState } from 'react'
import {
  Box,
  SkeletonLoader,
  Text,
  Breadcrumbs,
  FilterMultiChoiceProps,
} from '@island.is/island-ui/core'
import {
  useGetInstitutionApplicationsQuery,
  useGetOrganizationsQuery,
} from '../../queries/overview.generated'
import invertBy from 'lodash/invertBy'
import { InstitutionFilters } from '../../components/Filters/InstitutionFilters'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { ApplicationsTable } from '../../components/ApplicationsTable/ApplicationsTable'
import { ApplicationFilters, MultiChoiceFilter } from '../../types/filters'
import { Organization } from '@island.is/shared/types'
import { institutionMapper } from '@island.is/application/types'
import { AdminApplication } from '../../types/adminApplication'
import { useUserInfo } from '@island.is/auth/react'
import endOfDay from 'date-fns/endOfDay'

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
}

const pageSize = 12

const InstitutionOverview = () => {
  const institutionApplications = invertBy(institutionMapper, (application) => {
    return application.slug
  })
  const { formatMessage } = useLocale()
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState(defaultFilters)
  const [multiChoiceFilters, setMultiChoiceFilters] = useState(
    defaultMultiChoiceFilters,
  )

  const userInfo = useUserInfo()
  const { data: orgData, loading: orgsLoading } = useGetOrganizationsQuery({
    ssr: false,
  })

  const {
    data: response,
    loading: queryLoading,
    refetch,
  } = useGetInstitutionApplicationsQuery({
    ssr: false,
    variables: {
      input: {
        nationalId: userInfo.profile.nationalId,
        page: page,
        count: pageSize,
        applicantNationalId: filters.nationalId
          ? filters.nationalId.replace('-', '')
          : '',
        from: filters.period.from?.toISOString(),
        to: filters.period.to?.toISOString(),
        status: multiChoiceFilters?.status,
      },
    },
    onCompleted: (q) => {
      // Initialize available applications from the initial response
      // So that we can use them to filter by
      const names = q.applicationApplicationsInstitutionAdmin?.rows
        ?.filter((x) => !!x.name)
        .map((x) => x.name ?? '')
    },
  })

  const isLoading = queryLoading || orgsLoading
  const applicationApplicationsInstitutionAdmin =
    response?.applicationApplicationsInstitutionAdmin?.rows ?? []
  const applicationAdminList =
    applicationApplicationsInstitutionAdmin as AdminApplication[]
  const numberOfItems =
    response?.applicationApplicationsInstitutionAdmin?.count ?? 0
  const organizations = (orgData?.getOrganizations?.items ??
    []) as Organization[]

  const handleSearchChange = (nationalId: string) => {
    if (nationalId.length === 11 || nationalId.length === 0) {
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
    setMultiChoiceFilters((prev) => ({
      ...prev,
      [categoryId]: selected.length > 0 ? selected : undefined,
    }))
  }

  const handleDateChange = (period: ApplicationFilters['period']) => {
    const update = { ...filters.period, ...period }
    if (update.to) {
      update.to = endOfDay(update.to)
    }

    setFilters((prev) => ({
      ...prev,
      period: update,
    }))
  }

  const clearFilters = (categoryId?: string) => {
    if (!categoryId) {
      // Clear all filters
      setFilters(defaultFilters)
      setMultiChoiceFilters(defaultMultiChoiceFilters)
      return
    }

    setMultiChoiceFilters((prev) => ({
      ...prev,
      [categoryId]: undefined,
    }))
  }

  // Reset the page on filter change
  useEffect(() => {
    setPage(1)
    refetch()
  }, [filters, multiChoiceFilters])

  return (
    <Box>
      <Breadcrumbs
        items={[
          { title: 'Ísland.is', href: '/stjornbord' },
          { title: formatMessage(m.applicationSystem) },
        ]}
      />
      <Text variant="h3" as="h1" marginBottom={[3, 3, 6]} marginTop={3}>
        {formatMessage(m.applicationSystemApplications)}
      </Text>
      <InstitutionFilters
        onSearchChange={handleSearchChange}
        onFilterChange={handleMultiChoiceFilterChange}
        onDateChange={handleDateChange}
        onFilterClear={clearFilters}
        multiChoiceFilters={multiChoiceFilters}
        filters={filters}
        numberOfDocuments={numberOfItems}
      />
      {isLoading && filters.nationalId?.length === 11 ? (
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
          shouldShowCardButtons={false}
          numberOfItems={numberOfItems}
        />
      )}
    </Box>
  )
}

export default InstitutionOverview
