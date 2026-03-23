import { m } from '../../lib/messages'
import { Box, SkeletonLoader, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import type { ApplicationFilters } from '../../types/filters'
import { StatisticsForm } from '../../components/StatisticsForm/StatisticsForm'
import {
  useGetApplicationV2ApplicationStatisticsInstitutionAdminQuery,
  useGetApplicationV2ApplicationStatisticsSuperAdminQuery,
} from '../../queries/overview.generated'
import { useMemo, useState } from 'react'
import StatisticsTable from '../../components/StatisticsTable/StatisticsTable'
import startOfMonth from 'date-fns/startOfMonth'
import { Organization } from '@island.is/shared/types'

interface StatisticsProps {
  isSuperAdmin: boolean
  organizationListFromContentful: Organization[]
  isLoadingOrganizationsFromContentful: boolean
}

const getFormattedDate = (date?: Date): string => {
  if (!date) {
    return ''
  }
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const Statistics = ({
  isSuperAdmin,
  organizationListFromContentful,
  isLoadingOrganizationsFromContentful,
}: StatisticsProps) => {
  const { formatMessage } = useLocale()
  const [dateInterval, setDateInterval] = useState<
    ApplicationFilters['period']
  >({
    from: startOfMonth(new Date()),
    to: new Date(),
  })
  const [error, setError] = useState<string | null>(null)
  const [selectedInstitutionSlug, setSelectedInstitutionSlug] = useState('')

  const onDateChange = (period: ApplicationFilters['period']) => {
    const dateChanging = period.from
      ? { from: period.from }
      : period.to
      ? { to: period.to }
      : {}
    setDateInterval({ ...dateInterval, ...dateChanging })
    setSelectedInstitutionSlug('')
  }

  const hasSelectedDates = dateInterval.from && dateInterval.to

  const { data: superStatisticsData, loading: superStatisticsLoading } =
    useGetApplicationV2ApplicationStatisticsSuperAdminQuery({
      ssr: false,
      skip:
        !isSuperAdmin || // do NOT run if user is NOT superAdmin
        !hasSelectedDates,
      variables: {
        input: {
          startDate: getFormattedDate(dateInterval.from),
          endDate: getFormattedDate(dateInterval.to),
        },
      },
      onCompleted: () => {
        setError(null)
      },
      onError: (e) => {
        setError(e.message)
      },
    })

  const {
    data: institutionStatisticsData,
    loading: institutionStatisticsLoading,
  } = useGetApplicationV2ApplicationStatisticsInstitutionAdminQuery({
    ssr: false,
    skip:
      isSuperAdmin || // do NOT run if user IS superAdmin
      !hasSelectedDates,
    variables: {
      input: {
        startDate: getFormattedDate(dateInterval.from),
        endDate: getFormattedDate(dateInterval.to),
      },
    },
    onCompleted: () => {
      setError(null)
    },
    onError: (e) => {
      setError(e.message)
    },
  })

  const dataRows = isSuperAdmin
    ? superStatisticsData?.applicationV2ApplicationStatisticsSuperAdmin
    : institutionStatisticsData?.applicationV2ApplicationStatisticsInstitutionAdmin

  const statisticsOrganizationOptions = useMemo<Organization[] | undefined>(
    () =>
      isSuperAdmin
        ? Array.from(
            new Set(
              (dataRows ?? [])
                .map((r) => r.institutionContentfulSlug)
                .filter(Boolean),
            ),
          )
            .map((slug) =>
              organizationListFromContentful.find((o) => o.slug === slug),
            )
            .filter((o): o is Organization => o != null)
            .sort((a, b) => a.title.localeCompare(b.title))
        : undefined,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataRows, organizationListFromContentful, isSuperAdmin],
  )

  const filteredDataRows = selectedInstitutionSlug
    ? (dataRows ?? []).filter(
        (r) => r.institutionContentfulSlug === selectedInstitutionSlug,
      )
    : dataRows

  const isLoading =
    superStatisticsLoading ||
    institutionStatisticsLoading ||
    isLoadingOrganizationsFromContentful

  return (
    <Box>
      <Text variant="h3" as="h1" marginBottom={[3, 3, 6]} marginTop={3}>
        {formatMessage(m.statistics)}
      </Text>
      <StatisticsForm
        dateInterval={dateInterval}
        onDateChange={onDateChange}
        organizations={statisticsOrganizationOptions} // undefined for institution admins → no dropdown rendered
        selectedInstitutionSlug={selectedInstitutionSlug}
        onInstitutionChange={setSelectedInstitutionSlug}
      />
      {isLoading ? (
        <Box marginTop={[3, 3, 6]}>
          <SkeletonLoader
            height={60}
            repeat={10}
            space={2}
            borderRadius="large"
          />
        </Box>
      ) : (
        <StatisticsTable
          isSuperAdmin={isSuperAdmin}
          dataRows={filteredDataRows}
          organizations={organizationListFromContentful}
        />
      )}
      {error && <Box marginTop={[3, 3, 6]}>{error}</Box>}
    </Box>
  )
}

export default Statistics
