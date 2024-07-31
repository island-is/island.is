import { m } from '../../lib/messages'
import {
  Box,
  Breadcrumbs,
  SkeletonLoader,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { ApplicationSystemPaths } from '../../lib/paths'
import type { ApplicationFilters, MultiChoiceFilter } from '../../types/filters'
import { StatisticsForm } from '../../components/StatisticsForm/StatisticsForm'
import { useGetApplicationStatisticsQuery } from '../../queries/overview.generated'
import { useState } from 'react'
import StatisticsTable from '../../components/StatisticsTable/StatisticsTable'
import startOfMonth from 'date-fns/startOfMonth'

const Statistics = () => {
  const { formatMessage } = useLocale()
  const [dateInterval, setDateInterval] = useState<
    ApplicationFilters['period']
  >({
    from: startOfMonth(new Date()),
    to: new Date(),
  })
  const [error, setError] = useState<string | null>(null)

  const getFormattedDate = (date?: Date) => {
    if (!date) {
      return ''
    }

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  const onDateChange = (period: ApplicationFilters['period']) => {
    const dateChanging = period.from
      ? { from: period.from }
      : period.to
      ? { to: period.to }
      : {}
    setDateInterval({ ...dateInterval, ...dateChanging })
  }

  const { data, loading } = useGetApplicationStatisticsQuery({
    ssr: false,
    skip: !dateInterval.from || !dateInterval.to,
    variables: {
      input: {
        startDate: getFormattedDate(dateInterval.from),
        endDate: getFormattedDate(dateInterval.to),
      },
    },
    onCompleted: (q) => {
      setError(null)
    },
    onError: (e) => {
      setError(e.message)
    },
  })

  return (
    <Box>
      <Breadcrumbs
        items={[
          { title: 'Ísland.is', href: '/stjornbord' },
          {
            title: formatMessage(m.applicationSystem),
            href: `/stjornbord${ApplicationSystemPaths.Root}`,
          },
          { title: formatMessage(m.statistics) },
        ]}
      />
      <Text variant="h3" as="h1" marginBottom={[3, 3, 6]} marginTop={3}>
        {formatMessage(m.statistics)}
      </Text>
      <StatisticsForm dateInterval={dateInterval} onDateChange={onDateChange} />
      {loading && (
        <Box marginTop={[3, 3, 6]}>
          <SkeletonLoader
            height={60}
            repeat={10}
            space={2}
            borderRadius="large"
          />
        </Box>
      )}
      <StatisticsTable data={data} />
      {error && <Box marginTop={[3, 3, 6]}>{error}</Box>}
    </Box>
  )
}

export default Statistics
