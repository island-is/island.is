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
import { InstitutionFilters } from '../../components/Filters/InstitutionFilters'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { ApplicationsTable } from '../../components/ApplicationsTable/ApplicationsTable'
import { ApplicationFilters, MultiChoiceFilter } from '../../types/filters'
import { Organization } from '@island.is/shared/types'
import { AdminApplication } from '../../types/adminApplication'
import endOfDay from 'date-fns/endOfDay'

const defaultFilters: ApplicationFilters = {
  searchStr: '',
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

const InstitutionOverview = () => {
  const { formatMessage } = useLocale()
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState(defaultFilters)
  const [multiChoiceFilters, setMultiChoiceFilters] = useState(
    defaultMultiChoiceFilters,
  )

  const { data: orgData, loading: orgsLoading } = useGetOrganizationsQuery({
    ssr: false,
  })

  const useAdvancedSearch = !!filters.typeId

  const {
    data: response,
    loading: queryLoading,
    refetch,
  } = useGetInstitutionApplicationsQuery({
    ssr: false,
    variables: {
      input: {
        page: page,
        count: pageSize,
        applicantNationalId:
          !useAdvancedSearch && filters.nationalId
            ? filters.nationalId.replace('-', '')
            : '',
        from: filters.period.from?.toISOString(),
        to: filters.period.to?.toISOString(),
        typeIdValue: filters.typeId,
        searchStrValue:
          useAdvancedSearch && filters.searchStr
            ? filters.searchStr.replace('-', '')
            : undefined,
        status: multiChoiceFilters?.status,
      },
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

  const handleTypeIdChange = (typeId: ApplicationFilters['typeId']) => {
    setFilters((prev) => ({
      ...prev,
      typeId: typeId,
    }))
  }

  const handleSearchStrChange = (searchStr: string) => {
    setFilters((prev) => ({
      ...prev,
      searchStr,
    }))
  }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, multiChoiceFilters])

  return (
    <Box>
      <Breadcrumbs
        items={[
          { title: 'Ísland.is', href: '/stjornbord' },
          { title: formatMessage(m.applicationSystem) },
        ]}
      />
      <Box marginBottom={[3, 3, 6]} marginTop={3}>
        <Text variant="h3" as="h1">
          {formatMessage(m.applicationSystemApplications)}
        </Text>
        <Text fontWeight="light">
          {formatMessage(m.applicationSystemApplicationsDescription)}
        </Text>
      </Box>
      <InstitutionFilters
        onTypeIdChange={handleTypeIdChange}
        onSearchStrChange={handleSearchStrChange}
        onSearchChange={handleSearchChange}
        onFilterChange={handleMultiChoiceFilterChange}
        onDateChange={handleDateChange}
        onFilterClear={clearFilters}
        multiChoiceFilters={multiChoiceFilters}
        filters={filters}
        numberOfDocuments={numberOfItems}
        useAdvancedSearch={useAdvancedSearch}
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
          shouldShowCardButtons={false}
          numberOfItems={numberOfItems}
          showAdminData={useAdvancedSearch}
        />
      )}
    </Box>
  )
}

export default InstitutionOverview
