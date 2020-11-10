import React, { FC } from 'react'
import BoxChart, { BoxChartKey } from '../components/BoxChart'
import { Box, Text } from '@island.is/island-ui/core'
import { Application, getValueViaPath } from '@island.is/application/core'

interface YourRightsBoxChartProps {
  application: Application
  showDisclaimer?: boolean
}

const YourRightsBoxChart: FC<YourRightsBoxChartProps> = ({
  application,
  showDisclaimer = false,
}) => {
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
          { label: '6 personal months', bulletStyle: 'blue' },
          {
            label: '1 shared month requested from other parent',
            bulletStyle: 'greenWithLines',
          },
        ]
      : giveRightsAnswer === 'yes'
      ? [{ label: '5 personal months', bulletStyle: 'blue' }]
      : [{ label: '6 personal months', bulletStyle: 'blue' }]

  const numberOfBoxes =
    requestRightsAnswer === 'yes' ? 7 : giveRightsAnswer === 'yes' ? 5 : 6

  return (
    <Box marginY={3} key={'YourRightsBoxChart'}>
      <BoxChart
        titleLabel={`Total: ${numberOfBoxes} months *`}
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
          <Text>
            * The other parent has to approve if you requested extra month from
            their share. If they reject your request, you will have to change
            your application.
          </Text>
        </Box>
      )}
    </Box>
  )
}

export default YourRightsBoxChart
