import { Box, StatisticCard, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { formatHourlyWage, formatPercent } from '../../../lib/format'
import { messages } from '../../../lib/messages'
import { DirectorateOfEqualityGap } from '../../../mocks/types'
import { directionMessage } from './AdjustedGap'

export const MeanHourlyWage = ({
  wage,
  rawGap,
}: {
  wage: { male: number; female: number }
  rawGap: DirectorateOfEqualityGap
}) => {
  const { formatMessage } = useLocale()
  return (
    <>
      <Text variant="h4" as="h3" marginBottom={1}>
        {formatMessage(messages.meanHourlyWageTitle)}
      </Text>
      <Text marginBottom={3}>
        {formatMessage(messages.meanHourlyWageIntro)}
      </Text>
      <Box
        display="flex"
        columnGap={[0, 0, 0, 4]}
        rowGap={[2, 2, 2, 0]}
        flexDirection={['column', 'column', 'column', 'row']}
      >
        <StatisticCard
          title={formatMessage(messages.meanHourlyWageMale)}
          content={formatHourlyWage(wage.male)}
        />
        <StatisticCard
          title={formatMessage(messages.meanHourlyWageFemale)}
          content={formatHourlyWage(wage.female)}
        />
      </Box>
      <Box marginTop={2}>
        <Text variant="small" color="dark350">
          {formatMessage(messages.rawGap, {
            value: formatPercent(rawGap.percent, 2),
            direction: formatMessage(directionMessage(rawGap.direction)),
          })}
        </Text>
      </Box>
    </>
  )
}
