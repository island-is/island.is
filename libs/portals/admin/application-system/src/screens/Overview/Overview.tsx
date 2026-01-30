import { useEffect, useState } from 'react'
import {
  Box,
  SkeletonLoader,
  Text,
  FilterMultiChoiceProps,
} from '@island.is/island-ui/core'
import {
  useGetApplicationInstitutionsQuery,
  useGetApplicationsInstitutionAdminQuery,
  useGetApplicationsSuperAdminQuery,
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

const defaultFilters: ApplicationFilters = {
  nationalId: '',
  period: {},
  searchStr: '',
  institution: '',
}

const defaultMultiChoiceFilters: Record<
  MultiChoiceFilter,
  string[] | undefined
> = {
  [MultiChoiceFilter.INSTITUTION]: undefined,
  [MultiChoiceFilter.TYPE_ID]: undefined,
}

interface OverviewProps {
  isSuperAdmin: boolean
}

const pageSize = 12

const Overview = ({ isSuperAdmin }: OverviewProps) => {
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

  //These are all organizations in contentful
  const { data: contentfulOrgDataResults, loading: orgsLoading } =
    useGetOrganizationsQuery({
      ssr: false,
    })

  // A list of all institutions with active application types
  const {
    data: organizationDataWithNationalId,
    loading: loadinOrganizationDataWithNationalId,
  } = useGetApplicationInstitutionsQuery({
    ssr: false,
    skip: !isSuperAdmin, //do NOT run if user is NOT superAdmin
  })

  const useAdvancedSearch = !!filters.typeIdValue

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
    data: institutionData,
    loading: loadingInstitution,
    refetch: refetchInstitution,
  } = useGetApplicationsInstitutionAdminQuery({
    ssr: false,
    variables: commonVariables,
    skip: isSuperAdmin, //do NOT run if user IS superAdmin
    onCompleted: (q) => {
      const names = q.applicationApplicationsInstitutionAdmin?.rows
        ?.filter((x) => !!x.name)
        ?.map((x) => x.name ?? '')

      if (names) {
        setAvailableApplications(uniq(names))
      }
    },
  })

  const {
    data: superData,
    loading: loadingSuper,
    refetch: refetchSuper,
  } = useGetApplicationsSuperAdminQuery({
    ssr: false,
    variables: {
      input: {
        ...commonVariables.input,
        institutionNationalId: filters.institution,
      },
    },
    skip: !isSuperAdmin, //do NOT run if user is NOT superAdmin
    onCompleted: (q) => {
      const names = q.applicationApplicationsAdmin?.rows
        ?.filter((x) => !!x.name)
        ?.map((x) => x.name ?? '')

      if (names) {
        setAvailableApplications(uniq(names))
      }
    },
  })

  const isLoading =
    loadingSuper ||
    loadingInstitution ||
    orgsLoading ||
    loadinOrganizationDataWithNationalId

  const applicationApplicationsAdmin = isSuperAdmin
    ? superData?.applicationApplicationsAdmin?.rows
    : institutionData?.applicationApplicationsInstitutionAdmin?.rows

  const applicationAdminList =
    applicationApplicationsAdmin as AdminApplication[]

  const organizationListFromContentful = (contentfulOrgDataResults
    ?.getOrganizations?.items ?? []) as Organization[]

  // Get organizations of all applications currently fetched
  const availableOrganizations = isSuperAdmin
    ? organizationListFromContentful?.flatMap((x) => {
        const itemFoundInResponse =
          organizationDataWithNationalId?.applicationApplicationsAdminInstitutions?.find(
            (y) => y.slug === x.slug,
          )
        if (!itemFoundInResponse) {
          return []
        }
        return [
          {
            ...x,
            nationalId: itemFoundInResponse?.nationalId || '',
          },
        ]
      })
    : organizationListFromContentful.map((x) => ({
        ...x,
        nationalId: '',
      })) || []

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

  const handleInstitutionIdChange = (
    instituionNationalId: ApplicationFilters['institution'],
  ) => {
    setFilters((prev) => ({
      ...prev,
      institution: instituionNationalId,
    }))
  }

  const handleMultiChoiceFilterChange: FilterMultiChoiceProps['onChange'] = ({
    categoryId,
    selected,
  }) => {
    if (categoryId === MultiChoiceFilter.INSTITUTION) {
      // Special case for institutions, because we need to map institution slugs to application typeIds
      const typeIds = flatten(selected.map((x) => institutionApplications[x]))
      setInstitutionFilters(typeIds.length > 0 ? typeIds : undefined)
      setFilters({ ...filters, typeIdValue: '' }) // Reset typeIdValue when institution filter changes
      const institution = availableOrganizations.find(
        (x) => x.slug === selected[0],
      )?.nationalId
      handleInstitutionIdChange(institution)
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
      setFilters(defaultFilters)
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
  useEffect(() => {
    setPage(1)
    const refetch = isSuperAdmin ? refetchSuper : refetchInstitution
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, multiChoiceFilters])

  const filteredApplicationList = getFilteredApplications(
    applicationAdminList ?? [],
    {
      institutionFilters,
    },
  )

  return (
    <Box>
      <Text variant="h3" as="h1" marginBottom={1} marginTop={3}>
        {formatMessage(m.applicationSystemApplications)}
      </Text>

      <Text variant="h5" as="h2" marginBottom={[3, 3, 6]}>
        {formatMessage(m.applicationSystemApplicationsDescription)}
      </Text>

      <Filters
        onTypeIdChange={handleTypeIdChange}
        onSearchChange={handleSearchChange}
        onSearchStrChange={handleSearchStrChange}
        onFilterChange={handleMultiChoiceFilterChange}
        onDateChange={handleDateChange}
        onFilterClear={clearFilters}
        multiChoiceFilters={multiChoiceFilters}
        filters={filters}
        applications={availableApplications ?? []}
        organizations={availableOrganizations ?? []}
        numberOfDocuments={
          isSuperAdmin
            ? superData?.applicationApplicationsAdmin?.count
            : institutionData?.applicationApplicationsInstitutionAdmin?.count
        }
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
          applications={filteredApplicationList ?? []}
          organizations={availableOrganizations ?? []}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          showAdminData={!!filters.typeIdValue}
          shouldShowCardButtons={false}
          numberOfItems={
            isSuperAdmin
              ? superData?.applicationApplicationsAdmin?.count
              : institutionData?.applicationApplicationsInstitutionAdmin?.count
          }
        />
      )}
    </Box>
  )
}

export default Overview
