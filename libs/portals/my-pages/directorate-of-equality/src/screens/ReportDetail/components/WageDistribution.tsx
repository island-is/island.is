import {
  Box,
  Divider,
  ScatterChart,
  ScatterChartPoint,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import {
  formatHourlyWage,
  formatPercent,
  formatThousands,
} from '../../../lib/format'
import { messages } from '../../../lib/messages'
import {
  DirectorateOfEqualityDistribution,
  DirectorateOfEqualityDistributionPoint,
  DirectorateOfEqualityGender,
} from '../../../mocks/types'

export const WageDistribution = ({
  distribution,
}: {
  distribution: DirectorateOfEqualityDistribution
}) => {
  const { formatMessage } = useLocale()

  const toPoint = (
    point: DirectorateOfEqualityDistributionPoint,
  ): ScatterChartPoint => ({
    x: point.score,
    y: point.wage,
    marked: point.isOutlier,
    tooltip: {
      title: formatMessage(
        point.gender === DirectorateOfEqualityGender.MALE
          ? messages.male
          : messages.female,
      ),
      rows: [
        {
          label: formatMessage(messages.chartXAxis),
          value: String(point.score),
        },
        {
          label: formatMessage(messages.chartTooltipWage),
          value: formatHourlyWage(point.wage),
        },
      ],
      note: point.isOutlier
        ? { text: formatMessage(messages.chartLegendOutlier), color: 'red600' }
        : undefined,
    },
  })

  const xMax =
    Math.ceil(Math.max(...distribution.points.map((p) => p.score), 1) / 250) *
    250
  const yMax =
    Math.ceil(Math.max(...distribution.points.map((p) => p.wage), 1) / 3750) *
    3750
  const male = distribution.points.filter(
    (p) => p.gender === DirectorateOfEqualityGender.MALE,
  )
  const female = distribution.points.filter(
    (p) => p.gender === DirectorateOfEqualityGender.FEMALE,
  )

  return (
    <Box>
      <Text variant="h4" as="h3" marginBottom={1}>
        {formatMessage(messages.chartTitle)}
      </Text>
      <Text marginBottom={3}>{formatMessage(messages.chartIntro)}</Text>
      <ScatterChart
        title={formatMessage(messages.chartTitle)}
        description={formatMessage(messages.chartIntro)}
        series={[
          {
            name: formatMessage(messages.chartLegendMale),
            color: 'blue400',
            points: male.map(toPoint),
          },
          {
            name: formatMessage(messages.chartLegendFemale),
            color: 'purple400',
            points: female.map(toPoint),
          },
        ]}
        line={{
          name: formatMessage(messages.chartLegendExpected),
          color: 'roseTinted400',
          points: distribution.expectedLine.map((p) => ({
            x: p.score,
            y: p.wage,
          })),
        }}
        markedLegendLabel={
          distribution.points.some((p) => p.isOutlier)
            ? formatMessage(messages.chartLegendOutlier)
            : undefined
        }
        xAxis={{
          label: formatMessage(messages.chartXAxis),
          domain: [0, xMax],
          ticks: Array.from({ length: xMax / 250 + 1 }, (_, i) => i * 250),
        }}
        yAxis={{
          label: formatMessage(messages.chartYAxis),
          domain: [0, yMax],
          ticks: Array.from({ length: yMax / 3750 + 1 }, (_, i) => i * 3750),
          tickFormatter: formatThousands,
          width: 95,
        }}
      />
      <Text variant="small" color="dark300" marginTop={2}>
        {formatMessage(messages.chartNote)}
      </Text>
      <Box display="flex" columnGap={2} flexWrap="wrap" marginTop={1}>
        <Text variant="small" fontWeight="semiBold">
          {formatMessage(messages.increasePer100)}
        </Text>
        <Text variant="small">{`${formatPercent(
          distribution.increasePer100PointsPercent,
          1,
        )}%`}</Text>
        <Text variant="small" color="dark300">
          {formatMessage(messages.increasePer100Hint)}
        </Text>
      </Box>
      <Box display="flex" columnGap={2} flexWrap="wrap" marginTop={1}>
        <Text variant="small" fontWeight="semiBold">
          {formatMessage(messages.expectedAtMean)}
        </Text>
        <Text variant="small">
          {formatHourlyWage(distribution.expectedWageAtMeanScore)}
        </Text>
        <Text variant="small" color="dark300">
          {formatMessage(messages.expectedAtMeanHint)}
        </Text>
      </Box>
      <Box marginTop={2}>
        <Divider />
      </Box>
    </Box>
  )
}
