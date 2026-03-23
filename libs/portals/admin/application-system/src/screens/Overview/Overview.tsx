import { useEffect, useState } from 'react'
import { Box, SkeletonLoader, Text } from '@island.is/island-ui/core'
import {
  useGetApplicationV2ApplicationsSuperAdminQuery,
  useGetApplicationV2InstitutionsSuperAdminQuery,
  useGetApplicationV2ApplicationsInstitutionAdminQuery,
} from '../../queries/overview.generated'
import uniq from 'lodash/uniq'
import { Filters } from '../../components/Filters/Filters'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { ApplicationsTable } from '../../components/ApplicationsTable/ApplicationsTable'
import { ApplicationFilters } from '../../types/filters'
import { Organization } from '@island.is/shared/types'
import { AdminApplication } from '../../types/adminApplication'

const defaultFilters: ApplicationFilters = {
  nationalId: '',
  period: {},
  searchStr: '',
  institution: '',
}

interface OverviewProps {
  isSuperAdmin: boolean
  organizationListFromContentful: Organization[]
  isLoadingOrganizationsFromContentful: boolean
}

const pageSize = 12

const Overview = ({
  isSuperAdmin,
  organizationListFromContentful,
  isLoadingOrganizationsFromContentful,
}: OverviewProps) => {
  const { formatMessage } = useLocale()
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState(defaultFilters)
  const [availableApplications, setAvailableApplications] = useState<string[]>()

  // A list of all institutions with active application types
  const {
    data: organizationsWithApplicationData,
    loading: loadingOrganizationsWithApplication,
  } = useGetApplicationV2InstitutionsSuperAdminQuery({
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
    data: institutionApplicationsData,
    loading: loadingInstitutionApplications,
  } = useGetApplicationV2ApplicationsInstitutionAdminQuery({
    ssr: false,
    variables: commonVariables,
    skip: isSuperAdmin, //do NOT run if user IS superAdmin
    onCompleted: (q) => {
      const names = q.applicationV2ApplicationsInstitutionAdmin?.rows
        ?.filter((x) => !!x.name)
        ?.map((x) => x.name ?? '')

      if (names) {
        setAvailableApplications(uniq(names))
      }
    },
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
      skip: !isSuperAdmin, //do NOT run if user is NOT superAdmin
      onCompleted: (q) => {
        const names = q.applicationV2ApplicationsSuperAdmin?.rows
          ?.filter((x) => !!x.name)
          ?.map((x) => x.name ?? '')

        if (names) {
          setAvailableApplications(uniq(names))
        }
      },
    })

  const isLoading =
    loadingSuperApplications ||
    loadingInstitutionApplications ||
    isLoadingOrganizationsFromContentful ||
    loadingOrganizationsWithApplication

  const applicationApplicationsAdmin = isSuperAdmin
    ? superApplicationsData?.applicationV2ApplicationsSuperAdmin?.rows
    : institutionApplicationsData?.applicationV2ApplicationsInstitutionAdmin
        ?.rows

  const applicationAdminList =
    applicationApplicationsAdmin as AdminApplication[]

  // Get organizations of all applications currently fetched
  const availableOrganizations = isSuperAdmin
    ? organizationsWithApplicationData?.applicationV2InstitutionsSuperAdmin?.flatMap(
        (responseOrg) => {
          const contentfulOrg = organizationListFromContentful?.find(
            (x) => x.slug === responseOrg.contentfulSlug,
          )

          if (!contentfulOrg) {
            if (!responseOrg.nationalId) {
              return []
            } else {
              return [
                {
                  id: '',
                  title: responseOrg.name ?? responseOrg.nationalId ?? '',
                  slug: '',
                  nationalId: responseOrg.nationalId,
                  logo: null,
                },
              ]
            }
          }

          return [
            {
              ...contentfulOrg,
              nationalId: responseOrg.nationalId,
            },
          ]
        },
      ) ?? []
    : organizationListFromContentful?.map((x) => ({
        ...x,
        nationalId: '',
      })) ?? []

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
    const update = { ...filters.period, ...period }
    setFilters((prev) => ({
      ...prev,
      period: update,
    }))
  }

  const clearFilters = (categoryId?: string) => {
    if (!categoryId) {
      setFilters(defaultFilters)
      return
    }
  }

  // Reset the page on filter change
  // Note: Apollo will automatically refetch
  // when commonVariables change due to the updated page/filters state
  useEffect(() => {
    setPage(1)
  }, [filters])

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
        onInstitutionChange={handleInstitutionChange}
        onDateChange={handleDateChange}
        onFilterClear={clearFilters}
        filters={filters}
        applications={availableApplications ?? []}
        organizations={availableOrganizations ?? []}
        numberOfDocuments={
          isSuperAdmin
            ? superApplicationsData?.applicationV2ApplicationsSuperAdmin?.count
            : institutionApplicationsData
                ?.applicationV2ApplicationsInstitutionAdmin?.count
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
          applications={applicationAdminList ?? []}
          organizations={availableOrganizations ?? []}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          showAdminData={!!filters.typeIdValue}
          shouldShowCardButtons={false}
          isSuperAdmin={isSuperAdmin}
          numberOfItems={
            isSuperAdmin
              ? superApplicationsData?.applicationV2ApplicationsSuperAdmin
                  ?.count
              : institutionApplicationsData
                  ?.applicationV2ApplicationsInstitutionAdmin?.count
          }
        />
      )}
    </Box>
  )
}

export default Overview
