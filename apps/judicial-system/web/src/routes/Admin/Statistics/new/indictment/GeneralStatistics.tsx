import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence } from 'motion/react'

import { Box, SkeletonLoader } from '@island.is/island-ui/core'
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

const GeneralStatisticsBody = ({ minDate }: { minDate?: Date }) => {
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
        minDate={minDate}
      />
      <Statistics stats={stats} loading={loading} />
    </Box>
  )
}

export const GeneralStatistics = () => {
  // We extract the initial call to fetch the request statistics data to a specific parent component
  // to fetch defined statistical constraints (minDate) once. The child component is
  // currently re-rendered on each filter change.
  const { data, loading } = useIndictmentCaseStatisticsQuery({
    variables: {
      input: {},
    },
    fetchPolicy: 'cache-and-network',
  })
  const minDate = data?.indictmentCaseStatistics?.minDate ?? new Date()

  return loading && !data ? (
    <SkeletonLoader height={800} />
  ) : (
    <AnimatePresence mode="wait">
      <GeneralStatisticsBody minDate={new Date(minDate)} />
    </AnimatePresence>
  )
}
