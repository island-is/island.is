import { useEffect, useMemo, useState } from 'react'

import { Box } from '@island.is/island-ui/core'
import {
  InfoCard,
  LabelValue,
  PageHeader,
} from '@island.is/judicial-system-web/src/components'
import {
  DateFilter,
  RequestCaseStatistics,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { useRequestCaseStatisticsQuery } from '../getRequestCaseStatistics.generated'
import { Filters } from './shared/StatisticFilter'
import { StatisticHeader } from './shared/StatisticHeader'
import { StatisticsLayout } from './shared/StatisticLayout'
import StatisticPageLayout from './shared/StatisticPageLayout'
import { StatisticReturnButton } from './shared/StatisticReturnButton'

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

type RequestFilterType = {
  created?: DateFilter
  sentToCourt?: DateFilter
  institution?: { label: string; value: string }
}

const requestFilterKeys = [
  'institution',
  'created',
  'sentToCourt',
] as (keyof RequestFilterType)[]

const RequestStatistics = () => {
  const [stats, setStats] = useState<RequestCaseStatistics | undefined>()
  const [filters, setFilters] = useState<RequestFilterType>({})

  const queryVariables = useMemo(() => {
    return {
      created: filters.created,
      sentToCourt: filters.sentToCourt,
      institutionId: filters.institution?.value,
    }
  }, [filters])

  const { data, loading } = useRequestCaseStatisticsQuery({
    variables: {
      input: queryVariables,
    },
    fetchPolicy: 'cache-and-network',
  })

  useEffect(() => {
    if (data?.requestCaseStatistics) {
      setStats(data.requestCaseStatistics)
    }
  }, [data])

  return (
    <StatisticPageLayout>
      <PageHeader title="Tölfræði úr rannsóknarmálum" />
      <Box>
        <StatisticReturnButton />
        <StatisticHeader title="Tölfræði úr rannsóknarmálum" />
        <Filters
          id="request"
          types={requestFilterKeys}
          filters={filters}
          setFilters={setFilters}
          onClear={() => setFilters({})}
        />
        <Statistics stats={stats} loading={loading} />
      </Box>
    </StatisticPageLayout>
  )
}

export default RequestStatistics
