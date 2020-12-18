import React, { FC } from 'react'
import BoxChart, { BoxChartKey } from '../components/BoxChart'
import { Box, Text } from '@island.is/island-ui/core'
import { Application, getValueViaPath } from '@island.is/application/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

interface YourRightsBoxChartProps {
  application: Application
  showDisclaimer?: boolean
}

const YourRightsBoxChart: FC<YourRightsBoxChartProps> = ({
  application,
  showDisclaimer = false,
}) => {
  const { formatMessage } = useLocale()

  const maxDaysToGive = 30

  // Yes/No
  const requestRightsAnswer = getValueViaPath(
    application.answers,
    'requestRights',
    undefined,
  )
  // How many days requested?
  const requestDaysAnswer = getValueViaPath(
    application.answers,
    'requestDays',
    undefined,
  ) as number

  // Yes/No
  const giveRightsAnswer = getValueViaPath(
    application.answers,
    'giveRights',
    undefined,
  )
  // How many days given?
  const giveDaysAnswer = getValueViaPath(
    application.answers,
    'giveDays',
    undefined,
  ) as number

  const requestDaysStringKey =
    requestDaysAnswer === 1 ? m.requestRightsDay : m.requestRightsDays

  const yourRightsWithGivenDaysStringKey =
    maxDaysToGive - giveDaysAnswer === 1
      ? m.yourRightsInMonthsAndDay
      : m.yourRightsInMonthsAndDays

  const giveDaysStringKey =
    giveDaysAnswer === 1 ? m.giveRightsDay : m.giveRightsDays

  const boxChartKeys =
    requestRightsAnswer === 'yes'
      ? [
          {
            label: () => ({ ...m.yourRightsInMonths, values: { months: '6' } }),
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
      : giveRightsAnswer === 'yes'
      ? [
          {
            label: () => ({
              ...yourRightsWithGivenDaysStringKey,
              values: {
                months: '5',
                day: maxDaysToGive - giveDaysAnswer,
              },
            }),
            bulletStyle: 'blue',
          },
        ]
      : [
          {
            label: () => ({
              ...m.yourRightsInMonths,
              values: { months: '6' },
            }),
            bulletStyle: 'blue',
          },
        ]

  if (giveRightsAnswer === 'yes') {
    boxChartKeys.push({
      label: () => ({
        ...giveDaysStringKey,
        values: { day: giveDaysAnswer },
      }),
      bulletStyle: 'grayWithLines',
    })
  }

  const numberOfBoxes = requestRightsAnswer === 'yes' ? 7 : 6

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
          if (index === 5 && giveRightsAnswer === 'yes') {
            return 'grayWithLines'
          }
          if (index === 6 && requestRightsAnswer === 'yes') {
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
