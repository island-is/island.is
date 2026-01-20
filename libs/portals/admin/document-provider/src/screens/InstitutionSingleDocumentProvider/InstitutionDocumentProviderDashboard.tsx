import {
  GridRow,
  GridColumn,
  Box,
  Text,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { OpenedFilesDonutChart } from '../../components/OpenedFilesDonutChart/OpenedFilesDonutChart'
import { SentFilesBarChart } from '../../components/SentFilesBarChart/SentFilesBarChart'
import { SentFilesAndErrorsBarChart } from '../../components/SentFilesAndErrorsBarChart/SentFilesAndErrorsBarChart'
import { SentFilesProfitBarChart } from '../../components/SentFilesProfitBarChart/SentFilesProfitBarChart'
import { DocumentProviderDashboardCategoryStatisticsSortBy } from '@island.is/api/schema'
import { useGetProviderStatisticsBreakdownWCategoriesByProviderId } from '../../shared/useGetProviderStatisticsBreakdownWCategoriesByProviderId'
import { useGetProviderStatisticsBreakdownByProviderId } from '../../shared/useGetProviderStatisticsBreakdownByProviderId'

interface Props {
  providerId?: string
}

export const InstitutionDocumentProviderDashboard = ({ providerId }: Props) => {
  const { formatMessage } = useLocale()
  const { loading: loadingSentFiles, chartData: sentFilesData } =
    useGetProviderStatisticsBreakdownWCategoriesByProviderId(
      providerId,
      undefined,
      undefined,
      DocumentProviderDashboardCategoryStatisticsSortBy.Date,
      true,
      1,
      6,
    )

  const { loading: loadingChartData, chartData } =
    useGetProviderStatisticsBreakdownByProviderId(
      providerId,
      undefined,
      undefined,
      'Date',
      true,
      1,
      6,
    )
  //Get the sum of opened and published from chartData
  const opened =
    chartData?.reduce((acc, item) => acc + (item?.opened ?? 0), 0) ?? 0
  const published =
    chartData?.reduce((acc, item) => acc + (item?.published ?? 0), 0) ?? 0

  const openedPercentage =
    published > 0 ? Math.round((opened / published) * 100) : 0

  const openedFilesData = [
    {
      name: formatMessage(m.openedDocuments),
      value: openedPercentage || 0,
      color: '#007bff',
    },
    {
      name: formatMessage(m.statisticsBoxUnopenedDocuments),
      value: 100 - openedPercentage,
      color: '#d6b3ff',
    },
  ]

  if (loadingSentFiles || loadingChartData) {
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
        {formatMessage(m.StatisticsTitle)}
      </Text>
      <Text marginBottom={2}>
        {formatMessage(m.statisticsDescription6months)}
      </Text>

      <GridRow>
        <SentFilesBarChart data={sentFilesData || []} />

        <OpenedFilesDonutChart
          valueIndex={0}
          title={formatMessage(m.openedDocuments)}
          data={openedFilesData}
        />

        <SentFilesAndErrorsBarChart data={chartData || []} />

        <SentFilesProfitBarChart data={chartData || []} />
      </GridRow>
    </Box>
  )
}
