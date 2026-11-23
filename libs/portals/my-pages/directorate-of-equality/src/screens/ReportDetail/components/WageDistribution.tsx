import { Box, Divider, Text } from '@island.is/island-ui/core'
import {
  ScatterChart,
  ScatterChartPoint,
} from '@island.is/island-ui/core/charts'
import {
  DirectorateOfEqualityDistribution,
  DirectorateOfEqualityDistributionPoint,
  DirectorateOfEqualityGender,
  DirectorateOfEqualityMarkedKind,
} from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import { m as coreMessages } from '@island.is/portals/my-pages/core'

import {
  formatHourlyWage,
  formatPercent,
  formatThousands,
} from '../../../lib/format'
import { messages } from '../../../lib/messages'

export const WageDistribution = ({
  distribution,
}: {
  distribution?: DirectorateOfEqualityDistribution | null
}) => {
  const { formatMessage } = useLocale()
  const hourlyWageUnit = formatMessage(messages.hourlyWageUnit)

  if (!distribution) {
    return (
      <Box>
        <Text variant="h4" as="h3" marginBottom={1}>
          {formatMessage(messages.chartTitle)}
        </Text>
        <Text variant="small" color="dark300">
          {formatMessage(messages.notComputable)}
        </Text>
      </Box>
    )
  }

  const markedLabel =
    distribution.markedKind === DirectorateOfEqualityMarkedKind.MINIMUM_SET
      ? formatMessage(messages.chartLegendOutlier)
      : distribution.markedKind ===
        DirectorateOfEqualityMarkedKind.PAY_DISPERSION
      ? formatMessage(messages.chartLegendPayDispersion)
      : undefined

  const toPoint = (
    point: DirectorateOfEqualityDistributionPoint,
  ): ScatterChartPoint => ({
    x: point.score,
    y: point.wage,
    marked: point.marked,
    tooltip: {
      title: formatMessage(
        point.gender === DirectorateOfEqualityGender.MALE
          ? messages.male
          : messages.female,
      ),
      rows: [
        {
          label: formatMessage(messages.chartXAxis),
          value: String(Math.round(point.score)),
        },
        {
          label: formatMessage(messages.chartTooltipWage),
          value: formatHourlyWage(point.wage, hourlyWageUnit),
        },
      ],
      note:
        point.marked && markedLabel
          ? { text: markedLabel, color: 'red600' }
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
    (p) =>
      p.gender === DirectorateOfEqualityGender.FEMALE ||
      p.gender === DirectorateOfEqualityGender.NEUTRAL,
  )

  return (
    <Box>
      <Text variant="h4" as="h3" marginBottom={1}>
        {formatMessage(messages.chartTitle)}
      </Text>
      <Text marginBottom={3}>{formatMessage(messages.chartIntro)}</Text>
      <ScatterChart
        title={formatMessage(messages.chartTitle)}
        dataTable={{
          caption: formatMessage(messages.chartTitle),
          seriesHeader: formatMessage(coreMessages.gender),
          noteHeader: markedLabel,
        }}
        series={[
          {
            name: formatMessage(messages.chartLegendMale),
            color: 'blue400',
            points: male.map(toPoint),
          },
          {
            name: formatMessage(messages.chartLegendFemale),
            color: 'purple400',
            shape: 'diamond',
            points: female.map(toPoint),
          },
        ]}
        line={
          distribution.expectedLine.length > 0
            ? {
                name: formatMessage(messages.chartLegendExpected),
                color: 'roseTinted400',
                points: distribution.expectedLine.map((p) => ({
                  x: p.score,
                  y: p.wage,
                })),
              }
            : undefined
        }
        markedLegendLabel={markedLabel}
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
      <Box marginTop={2}>
        <Text variant="small" color="dark300">
          {formatMessage(messages.chartNote)}
        </Text>
      </Box>
      {distribution.increasePer100PointsPercent != null && (
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
      )}
      {distribution.expectedWageAtMeanScore != null && (
        <Box display="flex" columnGap={2} flexWrap="wrap" marginTop={1}>
          <Text variant="small" fontWeight="semiBold">
            {formatMessage(messages.expectedAtMean)}
          </Text>
          <Text variant="small">
            {formatHourlyWage(
              distribution.expectedWageAtMeanScore,
              hourlyWageUnit,
            )}
          </Text>
          <Text variant="small" color="dark300">
            {formatMessage(messages.expectedAtMeanHint)}
          </Text>
        </Box>
      )}
      <Box marginTop={2}>
        <Divider />
      </Box>
    </Box>
  )
}
