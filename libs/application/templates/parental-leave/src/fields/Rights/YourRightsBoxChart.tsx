import React, { FC } from 'react'
import BoxChart, { BoxChartKey } from '../components/BoxChart'
import { Box, Text } from '@island.is/island-ui/core'
import { Application, getValueViaPath } from '@island.is/application/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { maxDaysToGiveOrReceive, defaultMonths } from '../../config'
import { YES } from '../../constants'

interface YourRightsBoxChartProps {
  application: Application
  showDisclaimer?: boolean
}

const YourRightsBoxChart: FC<YourRightsBoxChartProps> = ({
  application,
  showDisclaimer = false,
}) => {
  const { formatMessage } = useLocale()

  const maxDays = maxDaysToGiveOrReceive

  // Yes/No
  const requestRightsAnswer = getValueViaPath(
    application.answers,
    'requestRights.isRequestingRights',
    undefined,
  )
  // How many days requested?
  const requestDaysAnswer = getValueViaPath(
    application.answers,
    'requestRights.requestDays',
    undefined,
  ) as number

  // Yes/No
  const giveRightsAnswer = getValueViaPath(
    application.answers,
    'giveRights.isGivingRights',
    undefined,
  )
  // How many days given?
  const giveDaysAnswer = getValueViaPath(
    application.answers,
    'giveRights.giveDays',
    undefined,
  ) as number

  const requestDaysStringKey =
    requestDaysAnswer === 1 ? m.requestRightsDay : m.requestRightsDays

  const yourRightsWithGivenDaysStringKey =
    maxDays - giveDaysAnswer === 1
      ? m.yourRightsInMonthsAndDay
      : m.yourRightsInMonthsAndDays

  const giveDaysStringKey =
    giveDaysAnswer === 1 ? m.giveRightsDay : m.giveRightsDays

  const boxChartKeys =
    requestRightsAnswer === YES
      ? [
          {
            label: () => ({
              ...m.yourRightsInMonths,
              values: { months: defaultMonths },
            }),
            bulletStyle: 'blue',
          },
          {
            label: () => ({
              ...requestDaysStringKey,
              values: { day: requestDaysAnswer },
            }),
            bulletStyle: 'greenWithLines',
          },
        ]
      : giveRightsAnswer === YES
      ? [
          {
            label: () => ({
              ...yourRightsWithGivenDaysStringKey,
              values: {
                months: defaultMonths - 1,
                day: maxDays - giveDaysAnswer,
              },
            }),
            bulletStyle: 'blue',
          },
        ]
      : [
          {
            label: () => ({
              ...m.yourRightsInMonths,
              values: { months: defaultMonths },
            }),
            bulletStyle: 'blue',
          },
        ]

  if (giveRightsAnswer === YES) {
    boxChartKeys.push({
      label: () => ({
        ...giveDaysStringKey,
        values: { day: giveDaysAnswer },
      }),
      bulletStyle: 'grayWithLines',
    })
  }

  const numberOfBoxes =
    requestRightsAnswer === YES ? defaultMonths + 1 : defaultMonths

  return (
    <Box marginY={3} key={'YourRightsBoxChart'}>
      <BoxChart
        application={application}
        titleLabel={() => ({
          ...m.monthsTotal,
          values: { months: numberOfBoxes },
        })}
        boxes={numberOfBoxes}
        calculateBoxStyle={(index) => {
          if (index === defaultMonths - 1 && giveRightsAnswer === YES) {
            return 'grayWithLines'
          }
          if (index === defaultMonths && requestRightsAnswer === 'yes') {
            return 'greenWithLines'
          }
          return 'blue'
        }}
        keys={boxChartKeys as BoxChartKey[]}
      />
      {showDisclaimer && (
        <Box marginTop={5}>
          <Text> {formatMessage(m.rightsTotalSmallPrint)}</Text>
        </Box>
      )}
    </Box>
  )
}

export default YourRightsBoxChart
