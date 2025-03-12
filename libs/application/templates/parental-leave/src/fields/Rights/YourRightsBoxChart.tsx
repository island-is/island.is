import React, { FC } from 'react'

import { Box, Text } from '@island.is/island-ui/core'
import { Application } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'

import BoxChart, { BoxChartKey } from '../components/BoxChart'
import { parentalLeaveFormMessages } from '../../lib/messages'
import {
  maxDaysToGiveOrReceive,
  defaultMonths,
  minMonths,
  maxMonths,
} from '../../config'
import { getApplicationAnswers } from '../../lib/parentalLeaveUtils'
import { YES } from '@island.is/application/core'

interface YourRightsBoxChartProps {
  application: Application
  showDisclaimer?: boolean
}

const YourRightsBoxChart: FC<
  React.PropsWithChildren<YourRightsBoxChartProps>
> = ({ application, showDisclaimer = false }) => {
  const { formatMessage } = useLocale()
  const { isRequestingRights, requestDays, isGivingRights, giveDays } =
    getApplicationAnswers(application.answers)
  const maxDays = maxDaysToGiveOrReceive

  const requestDaysStringKey =
    requestDays === 1
      ? parentalLeaveFormMessages.shared.requestRightsDay
      : parentalLeaveFormMessages.shared.requestRightsDays

  const yourRightsWithGivenDaysStringKey =
    maxDays - giveDays === 1
      ? parentalLeaveFormMessages.shared.yourRightsInMonthsAndDay
      : parentalLeaveFormMessages.shared.yourRightsInMonthsAndDays

  const giveDaysStringKey =
    giveDays === 1
      ? parentalLeaveFormMessages.shared.giveRightsDay
      : parentalLeaveFormMessages.shared.giveRightsDays

  const boxChartKeys =
    isRequestingRights === YES
      ? [
          {
            label: () => ({
              ...parentalLeaveFormMessages.shared.yourRightsInMonths,
              values: { months: defaultMonths },
            }),
            bulletStyle: 'blue',
          },
          {
            label: () => ({
              ...requestDaysStringKey,
              values: { day: requestDays },
            }),
            bulletStyle: 'greenWithLines',
          },
        ]
      : isGivingRights === YES
      ? [
          {
            label: () => ({
              ...yourRightsWithGivenDaysStringKey,
              values: {
                months: minMonths,
                day: maxDays - giveDays,
              },
            }),
            bulletStyle: 'blue',
          },
        ]
      : [
          {
            label: () => ({
              ...parentalLeaveFormMessages.shared.yourRightsInMonths,
              values: { months: defaultMonths },
            }),
            bulletStyle: 'blue',
          },
        ]

  if (isGivingRights === YES) {
    boxChartKeys.push({
      label: () => ({
        ...giveDaysStringKey,
        values: { day: giveDays },
      }),
      bulletStyle: 'grayWithLines',
    })
  }

  const numberOfBoxes = isRequestingRights === YES ? maxMonths : defaultMonths

  return (
    <Box marginY={3} key={'YourRightsBoxChart'}>
      <BoxChart
        application={application}
        titleLabel={() => ({
          ...parentalLeaveFormMessages.shared.monthsTotal,
          values: { months: numberOfBoxes },
        })}
        boxes={numberOfBoxes}
        calculateBoxStyle={(index) => {
          if (index === minMonths && isGivingRights === YES) {
            return 'grayWithLines'
          }
          if (index === defaultMonths && isRequestingRights === YES) {
            return 'greenWithLines'
          }
          return 'blue'
        }}
        keys={boxChartKeys as BoxChartKey[]}
      />
      {showDisclaimer && (
        <Box marginTop={5}>
          <Text>
            {' '}
            {formatMessage(
              parentalLeaveFormMessages.shared.rightsTotalSmallPrint,
            )}
          </Text>
        </Box>
      )}
    </Box>
  )
}

export default YourRightsBoxChart
