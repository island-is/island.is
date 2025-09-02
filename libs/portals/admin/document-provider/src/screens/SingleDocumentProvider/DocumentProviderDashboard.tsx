import { GridRow, Box, Text } from '@island.is/island-ui/core'
import { OpenedFilesDonutChart } from '../../components/OpenedFilesDonutChart/OpenedFilesDonutChart'
import { SentFilesBarChart } from '../../components/SentFilesBarChart/SentFilesBarChart'
import { SentFilesAndErrorsBarChart } from '../../components/SentFilesAndErrorsBarChart/SentFilesAndErrorsBarChart'
import { SentFilesProfitBarChart } from '../../components/SentFilesProfitBarChart/SentFilesProfitBarChart'
import { ChartData, SentFilesChartDataItem } from '../../lib/types'

interface Props {
  sentFilesData?: Array<SentFilesChartDataItem>
  chartData?: ChartData[]
}

export const DocumentProviderDashboard = ({
  sentFilesData,
  chartData,
}: Props) => {
  //Get the sum of opened and published from chartData
  const opened =
    chartData?.reduce((acc, item) => acc + (item.opened || 0), 0) || 0
  const published =
    chartData?.reduce((acc, item) => acc + (item.published || 0), 0) || 0

  const openedPercentage =
    published > 0 ? Math.round((opened / published) * 100) : 0

  const openedFilesData = [
    { name: 'Opnuð skjöl', value: openedPercentage || 0, color: '#007bff' },
    { name: 'Óopnuð skjöl', value: 100 - openedPercentage, color: '#d6b3ff' },
  ]

  return (
    <Box marginBottom={2}>
      <Text variant="h4" marginBottom={1} marginTop={4}>
        Tölfræði
      </Text>
      <Text marginBottom={2}>Hér er tölfræði síðustu 6 mánuða</Text>

      <GridRow>
        <SentFilesBarChart title="Send skjöl" data={sentFilesData || []} />

        <OpenedFilesDonutChart
          valueIndex={0}
          title="Opnuð skjöl"
          data={openedFilesData}
        />

        <SentFilesAndErrorsBarChart data={chartData || []} />

        <SentFilesProfitBarChart data={chartData || []} />
      </GridRow>
    </Box>
  )
}
