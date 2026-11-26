import {
  AlertMessage,
  Box,
  StatisticCard,
  Text,
} from '@island.is/island-ui/core'
import {
  DirectorateOfEqualityAdjustedGap,
  DirectorateOfEqualityGapDirection,
} from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'

import { formatPercent } from '../../../lib/format'
import { messages } from '../../../lib/messages'

export const directionMessage = (
  direction: DirectorateOfEqualityGapDirection,
) =>
  direction === DirectorateOfEqualityGapDirection.FEMALE
    ? messages.directionWomen
    : direction === DirectorateOfEqualityGapDirection.MALE
    ? messages.directionMen
    : messages.directionNone

export const AdjustedGap = ({
  gap,
}: {
  gap?: DirectorateOfEqualityAdjustedGap | null
}) => {
  const { formatMessage } = useLocale()
  return (
    <>
      <Text variant="h4" as="h3" marginBottom={1}>
        {formatMessage(messages.adjustedGapTitle)}
      </Text>
      <Text marginBottom={3}>{formatMessage(messages.adjustedGapIntro)}</Text>
      {!gap ? (
        <Text variant="small" color="dark300">
          {formatMessage(messages.notComputable)}
        </Text>
      ) : (
        <>
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
          {gap.withinBenchmark === true && (
            <AlertMessage
              type="success"
              title={formatMessage(messages.withinBenchmarkTitle)}
              message={formatMessage(messages.withinBenchmarkMessage, {
                benchmark: formatPercent(gap.benchmarkPercent, 2),
              })}
            />
          )}
          {gap.withinBenchmark === false && (
            <AlertMessage
              type="warning"
              title={formatMessage(messages.overBenchmarkTitle)}
              message={formatMessage(messages.overBenchmarkMessage, {
                count: gap.outlierCount,
              })}
            />
          )}
        </>
      )}
    </>
  )
}
