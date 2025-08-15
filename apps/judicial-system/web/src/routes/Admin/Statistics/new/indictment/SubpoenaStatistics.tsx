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

const SubpoenaStatisticsBody = ({ minDate }: { minDate?: Date }) => {
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
        id={'subpoena'}
        types={subpoenaFilterKeys}
        filters={filters}
        setFilters={setFilters}
        onClear={() => setFilters({})}
        minDate={minDate}
      />
      <Statistics stats={stats} loading={loading} />
    </Box>
  )
}

export const SubpoenaStatistics = () => {
  // We extract the initial call to fetch the request statistics data to a specific parent component
  // to fetch defined statistical constraints (minDate) once. The child component is
  // currently re-rendered on each filter change.
  const { data } = useSubpoenaStatisticsQuery({
    variables: {
      input: {},
    },
    fetchPolicy: 'cache-and-network',
  })
  const minDate = data?.subpoenaStatistics?.minDate ?? new Date()

  return <SubpoenaStatisticsBody minDate={new Date(minDate)} />
}
