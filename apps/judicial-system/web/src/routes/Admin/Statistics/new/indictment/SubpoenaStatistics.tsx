import { useEffect, useMemo, useState } from 'react'

import { Box, DatePicker, Select } from '@island.is/island-ui/core'
import {
  InfoCard,
  LabelValue,
} from '@island.is/judicial-system-web/src/components'
import {
  ServiceStatus,
  SubpoenaStatistics as SubpoenaStatisticsType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useInstitution } from '@island.is/judicial-system-web/src/utils/hooks'

import CountAndDays from '../../components/CountAndDays'
import { useSubpoenaStatisticsQuery } from '../../getSubpoenaStatistics.generated'
import { mapServiceStatusTitle } from '../../helpers'
import { FilterLayout } from '../shared/StatisticFilterLayout'
import { StatisticsLayout } from '../shared/StatisticLayout'

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
  stats?: SubpoenaStatisticsType
  loading: boolean
}) => {
  return (
    <StatisticsLayout loading={loading} stats={stats}>
      <InfoCard
        sections={[
          {
            id: 'indictment-cases',
            items: [
              {
                id: 'case-stat-item',
                title: '',
                values: [
                  <Box
                    key="subpoena-statistics-values"
                    display="flex"
                    flexDirection="column"
                    rowGap={1}
                  >
                    <LabelValue label="Heildarfjöldi" value={stats?.count} />
                    {[null, ...Object.values(ServiceStatus)].map((status) => {
                      const stat = stats?.serviceStatusStatistics.find(
                        (s) => s.serviceStatus === status,
                      )
                      return (
                        <CountAndDays
                          key={status ?? 'unserviced'}
                          label={mapServiceStatusTitle(status)}
                          count={stat?.count}
                          days={
                            status ? stat?.averageServiceTimeDays : undefined
                          }
                        />
                      )
                    })}
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

export const SubpoenaStatistics = () => {
  const [stats, setStats] = useState<SubpoenaStatisticsType | undefined>()
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

  const { data, loading } = useSubpoenaStatisticsQuery({
    variables: {
      input: queryVariables,
    },
    fetchPolicy: 'cache-and-network',
  })

  useEffect(() => {
    if (data?.subpoenaStatistics) {
      setStats(data.subpoenaStatistics)
    }
  }, [data])

  return (
    <Box marginTop={4}>
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
  )
}
