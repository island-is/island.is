import { GridRow, Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { OpenedFilesDonutChart } from '../../components/OpenedFilesDonutChart/OpenedFilesDonutChart'
import { SentFilesBarChart } from '../../components/SentFilesBarChart/SentFilesBarChart'
import { SentFilesAndErrorsBarChart } from '../../components/SentFilesAndErrorsBarChart/SentFilesAndErrorsBarChart'
import { SentFilesProfitBarChart } from '../../components/SentFilesProfitBarChart/SentFilesProfitBarChart'
import {
  DocumentProviderDashboardChartData,
  SentFilesChartDataItem,
} from '../../lib/types'
import { DocumentProvidersLoading } from '../../components/DocumentProvidersLoading/DocumentProvidersLoading'

interface Props {
  sentFilesData?: Array<SentFilesChartDataItem>
  chartData?: DocumentProviderDashboardChartData[]
  loading?: boolean
}

export const InstitutionDocumentProviderDashboard = ({
  sentFilesData,
  chartData,
  loading,
}: Props) => {
  const { formatMessage } = useLocale()
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

  if (loading) {
    return <DocumentProvidersLoading />
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
