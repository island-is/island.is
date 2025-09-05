import { useLocale } from '@island.is/localization'
import { GridRow, Box, Text } from '@island.is/island-ui/core'
import { OpenedFilesDonutChart } from '../../components/OpenedFilesDonutChart/OpenedFilesDonutChart'
import { useGetProviderStatisticCategoriesByNationalId } from '../../shared/useGetProviderStatisticCategoriesByNationalId'
import { SentFilesBarChart } from '../../components/SentFilesBarChart/SentFilesBarChart'
import { SentFilesChartDataItem, StatisticsOverview } from '../../lib/types'
import { m } from '../../lib/messages'

interface Props {
  statistics: StatisticsOverview | null
  nationalId: string
  sentFilesData?: Array<SentFilesChartDataItem>
  fromDate?: Date
  toDate?: Date
}

export const DocumentProvidersDashboard = ({
  statistics,
  nationalId,
  sentFilesData,
  fromDate,
  toDate,
}: Props) => {
  const { formatMessage } = useLocale()

  const { categories } = useGetProviderStatisticCategoriesByNationalId(
    nationalId,
    fromDate,
    toDate,
  )
  const opened = statistics?.statistics?.opened || 0
  const published = statistics?.statistics?.published || 0

  const openedPercentage =
    published > 0 ? Math.round((opened / published) * 100) : 0

  const openedFilesData = [
    {
      name: formatMessage(m.statisticsBoxOpenedDocuments),
      value: openedPercentage || 0,
      color: '#007bff',
    },
    {
      name: formatMessage(m.statisticsBoxUnopenedDocuments),
      value: 100 - openedPercentage,
      color: '#d6b3ff',
    },
  ]

  return (
    <Box marginBottom={2}>
      <Text variant="h4" marginBottom={1} marginTop={4}>
        {formatMessage(m.Statistics)}
      </Text>
      <Text marginBottom={2}>
        {formatMessage(m.statisticsDescription6months)}
      </Text>

      <GridRow>
        <SentFilesBarChart
          data={sentFilesData || []}
        />

        <OpenedFilesDonutChart
          valueIndex={0}
          title={formatMessage(m.statisticsBoxOpenedDocuments)}
          data={openedFilesData}
        />

        <OpenedFilesDonutChart
          title={formatMessage(m.categories)}
          data={categories}
        />
      </GridRow>
    </Box>
  )
}
