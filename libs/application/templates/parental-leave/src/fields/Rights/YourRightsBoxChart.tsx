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
  const requestRightsAnswer = getValueViaPath(
    application.answers,
    'requestRights',
    undefined,
  )
  const giveRightsAnswer = getValueViaPath(
    application.answers,
    'giveRights',
    undefined,
  )

  const boxChartKeys =
    requestRightsAnswer === 'yes'
      ? [
          {
            label: () => ({ ...m.yourRightsInMonths, values: { months: '6' } }),
            bulletStyle: 'blue',
          },
          {
            label: m.requestRightsMonths,
            bulletStyle: 'greenWithLines',
          },
        ]
      : [
          {
            label: () => ({
              ...m.yourRightsInMonths,
              values: { months: giveRightsAnswer === 'yes' ? '5' : '6' },
            }),
            bulletStyle: 'blue',
          },
        ]

  const numberOfBoxes =
    requestRightsAnswer === 'yes' ? 7 : giveRightsAnswer === 'yes' ? 5 : 6

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
          if (index === 6) {
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
