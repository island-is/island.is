import { useLocale } from '@island.is/localization'
import {
  GridRow,
  GridColumn,
  Box,
  Text,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { OpenedFilesDonutChart } from '../../components/OpenedFilesDonutChart/OpenedFilesDonutChart'
import { useGetProviderStatisticCategoriesByNationalId } from '../../shared/useGetProviderStatisticCategoriesByNationalId'
import { SentFilesBarChart } from '../../components/SentFilesBarChart/SentFilesBarChart'
import { SentFilesChartDataItem, StatisticsOverview } from '../../lib/types'
import { m } from '../../lib/messages'

interface Props {
  loading?: boolean
  statistics: StatisticsOverview | null
  nationalId: string
  sentFilesData?: Array<SentFilesChartDataItem>
}

export const InstitutionDocumentProvidersDashboard = ({
  loading,
  statistics,
  sentFilesData,
}: Props) => {
  const { formatMessage } = useLocale()

  const { categories } = useGetProviderStatisticCategoriesByNationalId(
    undefined,
    undefined,
  )
  const opened = statistics?.statistics?.opened || 0
  const published = statistics?.statistics?.published || 0
  const rawOpenedPct = published > 0 ? (opened / published) * 100 : 0
  const openedPercentage = Math.min(100, Math.max(0, Math.round(rawOpenedPct)))
  const unopenedPercentage = Math.max(0, 100 - openedPercentage)

  const openedFilesData = [
    {
      name: formatMessage(m.statisticsBoxOpenedDocuments),
      value: openedPercentage || 0,
      color: '#007bff',
    },
    {
      name: formatMessage(m.statisticsBoxUnopenedDocuments),
      value: unopenedPercentage,
      color: '#d6b3ff',
    },
  ]

  if (loading) {
    return (
      <GridRow>
        <GridColumn span={['12/12', '6/12']}>
          <Box padding={2}>
            <SkeletonLoader height={200} borderRadius="large" />
          </Box>
        </GridColumn>
        <GridColumn span={['12/12', '6/12']}>
          <Box padding={2}>
            <SkeletonLoader height={200} borderRadius="large" />
          </Box>
        </GridColumn>
      </GridRow>
    )
  }

  return (
    <Box marginBottom={2}>
      <Text variant="h4" marginBottom={1} marginTop={4}>
        {formatMessage(m.Statistics)}
      </Text>
      <Text marginBottom={2}>
        {formatMessage(m.statisticsDescription6months)}
      </Text>

      <GridRow>
        <SentFilesBarChart data={sentFilesData || []} />

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
