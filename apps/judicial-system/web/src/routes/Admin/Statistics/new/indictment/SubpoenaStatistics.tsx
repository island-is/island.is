import { useEffect, useMemo, useState } from 'react'

import { Box } from '@island.is/island-ui/core'
import {
  InfoCard,
  LabelValue,
} from '@island.is/judicial-system-web/src/components'
import {
  DateFilter,
  ServiceStatus,
  SubpoenaStatistics as SubpoenaStatisticsType,
} from '@island.is/judicial-system-web/src/graphql/schema'

import CountAndDays from '../../components/CountAndDays'
import { useSubpoenaStatisticsQuery } from '../../getSubpoenaStatistics.generated'
import { mapServiceStatusTitle } from '../../helpers'
import { Filters } from '../shared/StatisticFilter'
import { StatisticsLayout } from '../shared/StatisticLayout'

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

type SubpoenaFilterType = {
  created?: DateFilter
  institution?: { label: string; value: string }
}

const subpoenaFilterKeys = [
  'institution',
  'created',
] as (keyof SubpoenaFilterType)[]

export const SubpoenaStatistics = () => {
  const [stats, setStats] = useState<SubpoenaStatisticsType | undefined>()
  const [filters, setFilters] = useState<SubpoenaFilterType>({})

  const queryVariables = useMemo(() => {
    return {
      created: filters.created,
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
        types={subpoenaFilterKeys}
        filters={filters}
        setFilters={setFilters}
        onClear={() => setFilters({})}
      />
      <Statistics stats={stats} loading={loading} />
    </Box>
  )
}
