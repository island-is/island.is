import React, { FC } from 'react'

import BoxChart, { BoxChartKey } from '../components/BoxChart'
import { getApplicationAnswers } from '../../lib/parentalLeaveUtils'
import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { defaultMonths, additionalSingleParentMonths } from '../../config'
import { parentalLeaveFormMessages } from '../../lib/messages'
import { SINGLE } from '../../constants'

const GiveDaysSlider: FC<FieldBaseProps> = ({ application }) => {
  const { otherParent } = getApplicationAnswers(application.answers)
  const getDefaultMonths = otherParent === SINGLE ? additionalSingleParentMonths + defaultMonths : defaultMonths
  
  const boxChartKeys: BoxChartKey[] = [
    {
      label: () => ({
        ...parentalLeaveFormMessages.shared
          .yourRightsInMonths,
        values: { months: getDefaultMonths },
      }),
      bulletStyle: 'blue',
    },
  ]

  return (
    <>
      <Box marginBottom={6} marginTop={3}>
        <BoxChart
          application={application}
          boxes={getDefaultMonths}
          calculateBoxStyle={() => {
            return 'blue'
          }}
          keys={boxChartKeys as BoxChartKey[]}
        />
      </Box>
    </>
  )
}

export default GiveDaysSlider
