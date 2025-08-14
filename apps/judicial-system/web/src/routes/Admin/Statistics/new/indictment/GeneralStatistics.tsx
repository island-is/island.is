import { useEffect, useMemo, useState } from 'react'

import { Box } from '@island.is/island-ui/core'
import {
  InfoCard,
  LabelValue,
} from '@island.is/judicial-system-web/src/components'
import {
  DateFilter,
  IndictmentCaseStatistics,
} from '@island.is/judicial-system-web/src/graphql/schema'

import CountAndDays from '../../components/CountAndDays'
import { useIndictmentCaseStatisticsQuery } from '../../getIndictmentCaseStatistics.generated'
import { Filters } from '../shared/StatisticFilter'
import { StatisticsLayout } from '../shared/StatisticLayout'

const Statistics = ({
  stats,
  loading,
}: {
  stats?: IndictmentCaseStatistics
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
                id: 'indictment-case-item',
                title: '',
                values: [
                  <Box
                    key="indictment-statistics-values"
                    display="flex"
                    flexDirection="column"
                    rowGap={1}
                  >
                    <LabelValue label="Heildarfjöldi" value={stats?.count} />
                    <LabelValue
                      label="Í vinnslu"
                      value={stats?.inProgressCount}
                    />
                    <CountAndDays
                      label="Lokið með dómi"
                      count={stats?.rulingCount}
                      days={stats?.averageRulingTimeDays}
                    />
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

type IndictmentFilterType = {
  sentToCourt?: DateFilter
  institution?: { label: string; value: string }
}

const indictmentFilterKeys = [
  'institution',
  'sentToCourt',
] as (keyof IndictmentFilterType)[]

export const GeneralStatistics = () => {
  const [stats, setStats] = useState<IndictmentCaseStatistics | undefined>()
  const [filters, setFilters] = useState<IndictmentFilterType>({})

  const queryVariables = useMemo(() => {
    return {
      sentToCourt: filters.sentToCourt,
      institutionId: filters.institution?.value,
    }
  }, [filters])

  const { data, loading } = useIndictmentCaseStatisticsQuery({
    variables: {
      input: queryVariables,
    },
    fetchPolicy: 'cache-and-network',
  })

  useEffect(() => {
    if (data?.indictmentCaseStatistics) {
      setStats(data.indictmentCaseStatistics)
    }
  }, [data])
  return (
    <Box marginTop={4}>
      <Filters
        id="indictments"
        types={indictmentFilterKeys}
        filters={filters}
        setFilters={setFilters}
        onClear={() => setFilters({})}
      />
      <Statistics stats={stats} loading={loading} />
    </Box>
  )
}
