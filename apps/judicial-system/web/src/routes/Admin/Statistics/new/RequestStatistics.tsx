import { useEffect, useMemo, useState } from 'react'

import { Box, DatePicker, Select } from '@island.is/island-ui/core'
import {
  CasesLayout,
  InfoCard,
  LabelValue,
  PageHeader,
} from '@island.is/judicial-system-web/src/components'
import { RequestCaseStatistics } from '@island.is/judicial-system-web/src/graphql/schema'
import { useInstitution } from '@island.is/judicial-system-web/src/utils/hooks'

import { useRequestCaseStatisticsQuery } from '../getRequestCaseStatistics.generated'
import { FilterLayout } from './shared/StatisticFilterLayout'
import { StatisticHeader } from './shared/StatisticHeader'
import { StatisticsLayout } from './shared/StatisticLayout'
import { StatisticReturnButton } from './shared/StatisticReturnButton'
import * as styles from '../Statistics.css'

const Filters = ({
  institution,
  fromDate,
  toDate,
  setInstitution,
  setFromDate,
  setToDate,
  onClear,
}: {
  institution?: { label: string; value: string }
  fromDate?: Date
  toDate?: Date
  setInstitution: (institution?: { label: string; value: string }) => void
  setFromDate: (date?: Date) => void
  setToDate: (date?: Date) => void
  onClear: () => void
}) => {
  const { districtCourts } = useInstitution()

  return (
    <FilterLayout onClear={onClear}>
      <Select
        name="court"
        label="Veldu dómstól"
        placeholder="Dómstóll"
        size="xs"
        options={districtCourts.map((court) => ({
          label: court.name ?? '',
          value: court.id ?? '',
        }))}
        onChange={(selectedOption) =>
          setInstitution(selectedOption ?? undefined)
        }
        value={institution ?? null}
      />
      <DatePicker
        name="statisticsDateFrom"
        label="Veldu dagsetningu frá"
        placeholderText="Frá"
        size="xs"
        selected={fromDate}
        maxDate={new Date()}
        handleChange={(date: Date | null) => setFromDate(date ?? undefined)}
      />
      <DatePicker
        name="statisticsDateTo"
        label="Veldu dagsetningu til"
        placeholderText="Til"
        size="xs"
        maxDate={new Date()}
        minDate={fromDate}
        selected={toDate}
        handleChange={(date: Date | null) => setToDate(date ?? undefined)}
      />
    </FilterLayout>
  )
}

const Statistics = ({
  stats,
  loading,
}: {
  stats?: RequestCaseStatistics
  loading: boolean
}) => {
  return (
    <StatisticsLayout loading={loading} stats={stats}>
      <InfoCard
        sections={[
          {
            id: 'request-cases',
            items: [
              {
                id: 'request-case-item',
                title: '',
                values: [
                  <Box
                    key="request-cases-statistics-values"
                    display="flex"
                    flexDirection="column"
                    rowGap={1}
                  >
                    <LabelValue label="Heildarfjöldi" value={stats?.count} />
                    <LabelValue
                      label="Í vinnslu"
                      value={stats?.inProgressCount}
                    />
                    <LabelValue label="Lokið" value={stats?.completedCount} />
                  </Box>,
                ],
              },
            ],
          },
        ]}
      />
    </StatisticsLayout>
  )
}

const RequestStatistics = () => {
  const [stats, setStats] = useState<RequestCaseStatistics | undefined>()
  const [filters, setFilters] = useState<{
    fromDate?: Date
    toDate?: Date
    institution?: { label: string; value: string }
  }>({})

  const queryVariables = useMemo(() => {
    return {
      fromDate: filters.fromDate,
      toDate: filters.toDate,
      institutionId: filters.institution?.value,
    }
  }, [filters])

  const { data, loading } = useRequestCaseStatisticsQuery({
    variables: {
      input: queryVariables,
    },
    fetchPolicy: 'cache-and-network',
  })

  console.log({ data })
  useEffect(() => {
    if (data?.requestCaseStatistics) {
      setStats(data.requestCaseStatistics)
    }
  }, [data])

  return (
    <CasesLayout>
      <PageHeader title="Tölfræði úr rannsóknarmálum" />
      <Box className={styles.statisticsContentBox}>
        <StatisticReturnButton />
        <StatisticHeader title="Tölfræði úr rannsóknarmálum" />
        <Filters
          institution={filters.institution}
          fromDate={filters.fromDate}
          toDate={filters.toDate}
          setInstitution={(institution) =>
            setFilters((prev) => ({ ...prev, institution }))
          }
          setFromDate={(fromDate) =>
            setFilters((prev) => ({ ...prev, fromDate }))
          }
          setToDate={(toDate) => setFilters((prev) => ({ ...prev, toDate }))}
          onClear={() => setFilters({})}
        />
        <Statistics stats={stats} loading={loading} />
      </Box>
    </CasesLayout>
  )
}

export default RequestStatistics
