import {
  AlertMessage,
  Box,
  SkeletonLoader,
  Text,
} from '@island.is/island-ui/core'
import {
  useGetApplicationV2ApplicationsSuperAdminQuery,
  useGetApplicationV2ApplicationsInstitutionAdminQuery,
} from '../../queries/overview.generated'
import { Filters } from '../../components/Filters/Filters'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { ApplicationsTable } from '../../components/ApplicationsTable/ApplicationsTable'
import { ApplicationFilters } from '../../types/filters'
import { Organization } from '@island.is/shared/types'
import { AdminApplication } from '../../types/adminApplication'
import { useOverviewUrlState } from './useOverviewUrlState'
import { MAX_PAGE } from '../../lib/constants'

interface OverviewProps {
  isSuperAdmin: boolean
  availableOrganizations: Organization[]
  isLoadingOrganizations: boolean
}

const pageSize = 8

const Overview = ({
  isSuperAdmin,
  availableOrganizations,
  isLoadingOrganizations,
}: OverviewProps) => {
  const { formatMessage } = useLocale()
  const { page, filters, setPage, setFilters, resetFilters } =
    useOverviewUrlState()

  const useAdvancedSearch = !!filters.typeIdValue

  const hasActiveFilter =
    !!filters.nationalId ||
    !!filters.typeIdValue ||
    !!filters.searchStr ||
    !!filters.institution ||
    !!filters.period.from ||
    !!filters.period.to

  const commonVariables = {
    input: {
      page,
      count: pageSize,
      applicantNationalId:
        !useAdvancedSearch && filters.nationalId
          ? filters.nationalId.replace('-', '')
          : '',
      from: filters.period.from?.toISOString(),
      to: filters.period.to?.toISOString(),
      typeIdValue: filters.typeIdValue,
      searchStr:
        useAdvancedSearch && filters.searchStr
          ? filters.searchStr.replace('-', '')
          : undefined,
    },
  }

  const {
    data: institutionApplicationsData,
    loading: loadingInstitutionApplications,
  } = useGetApplicationV2ApplicationsInstitutionAdminQuery({
    ssr: false,
    variables: commonVariables,
    skip: isSuperAdmin || !hasActiveFilter, //do NOT run if user IS superAdmin or no filter is active
  })

  const { data: superApplicationsData, loading: loadingSuperApplications } =
    useGetApplicationV2ApplicationsSuperAdminQuery({
      ssr: false,
      variables: {
        input: {
          ...commonVariables.input,
          institutionNationalId: filters.institution,
        },
      },
      skip: !isSuperAdmin || !hasActiveFilter, //do NOT run if user is NOT superAdmin or no filter is active
    })

  const isLoading =
    loadingSuperApplications ||
    loadingInstitutionApplications ||
    isLoadingOrganizations

  const applicationApplicationsAdmin = isSuperAdmin
    ? superApplicationsData?.applicationV2ApplicationsSuperAdmin?.rows
    : institutionApplicationsData?.applicationV2ApplicationsInstitutionAdmin
        ?.rows

  const applicationAdminList =
    applicationApplicationsAdmin as AdminApplication[]

  const totalCount = isSuperAdmin
    ? superApplicationsData?.applicationV2ApplicationsSuperAdmin?.count
    : institutionApplicationsData?.applicationV2ApplicationsInstitutionAdmin
        ?.count

  const showPageLimitAlert =
    typeof totalCount === 'number' &&
    totalCount > MAX_PAGE * pageSize &&
    page >= MAX_PAGE

  const handleSearchChange = (nationalId: string) => {
    const nationalIdWithoutDash = nationalId.replace('-', '')
    if (nationalIdWithoutDash.length === 10 || nationalId === '') {
      setFilters((prev) => ({
        ...prev,
        nationalId: nationalIdWithoutDash,
      }))
    }
  }

  const handleTypeIdChange = (
    typeIdValue: ApplicationFilters['typeIdValue'],
  ) => {
    setFilters((prev) => ({
      ...prev,
      typeIdValue: typeIdValue,
    }))
  }

  const handleSearchStrChange = (
    searchStr: ApplicationFilters['searchStr'],
  ) => {
    setFilters((prev) => ({
      ...prev,
      searchStr,
    }))
  }

  const handleInstitutionChange = (
    institution: ApplicationFilters['institution'],
  ) => {
    setFilters((prev) => ({
      ...prev,
      institution,

      // Reset typeIdValue when institution filter changes
      typeIdValue: '',
    }))
  }

  const handleDateChange = (period: ApplicationFilters['period']) => {
    setFilters((prev) => ({
      ...prev,
      period: { ...prev.period, ...period },
    }))
  }

  const clearFilters = (categoryId?: string) => {
    if (!categoryId) {
      resetFilters()
      return
    }
  }

  return (
    <Box>
      <Text variant="h3" as="h1" marginBottom={1} marginTop={3}>
        {formatMessage(m.applicationSystemApplications)}
      </Text>

      <Text variant="h5" as="h2" marginBottom={[3, 3, 4]}>
        {formatMessage(m.applicationSystemApplicationsDescription)}
      </Text>

      {showPageLimitAlert && (
        <Box marginBottom={3}>
          <AlertMessage
            type="info"
            title={formatMessage(m.pageLimitReachedTitle, {
              count: MAX_PAGE * pageSize,
            })}
            message={formatMessage(m.pageLimitReachedDescription)}
          />
        </Box>
      )}

      <Filters
        onTypeIdChange={handleTypeIdChange}
        onSearchChange={handleSearchChange}
        onSearchStrChange={handleSearchStrChange}
        onInstitutionChange={handleInstitutionChange}
        onDateChange={handleDateChange}
        onFilterClear={clearFilters}
        filters={filters}
        organizations={availableOrganizations ?? []}
        numberOfDocuments={totalCount}
        isSuperAdmin={isSuperAdmin}
        useAdvancedSearch={!!filters.typeIdValue}
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
          organizations={availableOrganizations ?? []}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          maxPage={MAX_PAGE}
          showAdminData={!!filters.typeIdValue}
          showInstitution={!filters.institution}
          shouldShowCardButtons={false}
          isSuperAdmin={isSuperAdmin}
          numberOfItems={totalCount}
          hasActiveFilter={hasActiveFilter}
        />
      )}
    </Box>
  )
}

export default Overview
