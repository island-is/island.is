import { Box, StatisticCard, Text } from '@island.is/island-ui/core'
import {
  DirectorateOfEqualityGap,
  DirectorateOfEqualityMeanHourlyWage,
} from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'

import { formatHourlyWage, formatPercent } from '../../../lib/format'
import { messages } from '../../../lib/messages'
import { directionMessage } from './AdjustedGap'

export const MeanHourlyWage = ({
  wage,
  rawGap,
}: {
  wage?: DirectorateOfEqualityMeanHourlyWage | null
  rawGap?: DirectorateOfEqualityGap | null
}) => {
  const { formatMessage } = useLocale()
  const male = wage?.male
  const female = wage?.female
  return (
    <>
      <Text variant="h4" as="h3" marginBottom={1}>
        {formatMessage(messages.meanHourlyWageTitle)}
      </Text>
      <Text marginBottom={3}>
        {formatMessage(messages.meanHourlyWageIntro)}
      </Text>
      {male == null && female == null ? (
        <Text variant="small" color="dark300">
          {formatMessage(messages.notComputable)}
        </Text>
      ) : (
        <Box
          display="flex"
          columnGap={[0, 0, 0, 4]}
          rowGap={[2, 2, 2, 0]}
          flexDirection={['column', 'column', 'column', 'row']}
        >
          <StatisticCard
            title={formatMessage(messages.meanHourlyWageMale)}
            content={male == null ? '–' : formatHourlyWage(male)}
          />
          <StatisticCard
            title={formatMessage(messages.meanHourlyWageFemale)}
            content={female == null ? '–' : formatHourlyWage(female)}
          />
        </Box>
      )}
      {rawGap && (
        <Box marginTop={2}>
          <Text variant="small" color="dark350">
            {formatMessage(messages.rawGap, {
              value: formatPercent(rawGap.percent, 2),
              direction: formatMessage(directionMessage(rawGap.direction)),
            })}
          </Text>
        </Box>
      )}
    </>
  )
}
