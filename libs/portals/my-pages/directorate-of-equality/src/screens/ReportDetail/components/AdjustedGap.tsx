import {
  AlertMessage,
  Box,
  StatisticCard,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { formatPercent } from '../../../lib/format'
import { messages } from '../../../lib/messages'
import {
  DirectorateOfEqualityAdjustedGap,
  DirectorateOfEqualityGapDirection,
} from '../../../mocks/types'

export const directionMessage = (
  direction: DirectorateOfEqualityGapDirection,
) =>
  direction === DirectorateOfEqualityGapDirection.WOMEN
    ? messages.directionWomen
    : direction === DirectorateOfEqualityGapDirection.MEN
    ? messages.directionMen
    : messages.directionNone

export const AdjustedGap = ({
  gap,
}: {
  gap: DirectorateOfEqualityAdjustedGap
}) => {
  const { formatMessage } = useLocale()
  return (
    <>
      <Text variant="h4" as="h3" marginBottom={1}>
        {formatMessage(messages.adjustedGapTitle)}
      </Text>
      <Text marginBottom={3}>{formatMessage(messages.adjustedGapIntro)}</Text>
      <Box display="flex" marginBottom={3}>
        <StatisticCard
          title={formatMessage(messages.adjustedGapTitle)}
          content={formatMessage(messages.gapWithDirection, {
            value: formatPercent(gap.percent, 2),
            direction: formatMessage(directionMessage(gap.direction)),
          })}
          subtext={formatMessage(messages.benchmark, {
            benchmark: formatPercent(gap.benchmarkPercent, 2),
          })}
          color="purple"
        />
      </Box>
      {gap.withinBenchmark ? (
        <AlertMessage
          type="success"
          title={formatMessage(messages.withinBenchmarkTitle)}
          message={formatMessage(messages.withinBenchmarkMessage, {
            benchmark: formatPercent(gap.benchmarkPercent, 2),
          })}
        />
      ) : (
        <AlertMessage
          type="warning"
          title={formatMessage(messages.overBenchmarkTitle)}
          message={formatMessage(messages.overBenchmarkMessage, {
            count: gap.outlierCount,
          })}
        />
      )}
    </>
  )
}
