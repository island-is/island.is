import React, { FC } from 'react'
import { FieldBaseProps, BoxChartKey } from '@island.is/application/types'
import { useFormContext } from 'react-hook-form'
import { Box } from '@island.is/island-ui/core'
import { parentalLeaveFormMessages } from '../../lib/messages'
import { getApplicationAnswers } from '../../lib/parentalLeaveUtils'
import {
  maxDaysToGiveOrReceive,
  defaultMonths,
  daysInMonth,
} from '../../config'
import { YES } from '../../constants'
import { useEffectOnce } from 'react-use'
import { BoxChartFormField } from '@island.is/application/ui-fields'

const GiveDaysSlider: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  field,
  application,
}) => {
  const { setValue } = useFormContext()

  const { giveDays } = getApplicationAnswers(application.answers)

  useEffectOnce(() => {
    setValue('giveRights.isGivingRights', YES)
  })

  const daysStringKey =
    giveDays > 1
      ? parentalLeaveFormMessages.shared.giveRightsDays
      : parentalLeaveFormMessages.shared.giveRightsDay

  const yourRightsWithGivenDaysStringKey =
    maxDaysToGiveOrReceive - giveDays === 1
      ? parentalLeaveFormMessages.shared.yourRightsInMonthsAndDay
      : parentalLeaveFormMessages.shared.yourRightsInMonthsAndDays

  const rightsAfterTransfer = defaultMonths * daysInMonth - giveDays

  const remainingMonths = Math.floor(rightsAfterTransfer / daysInMonth)
  const remainingDays = rightsAfterTransfer % (remainingMonths * daysInMonth)

  const boxChartKeys: BoxChartKey[] = [
    {
      label: () => ({
        ...yourRightsWithGivenDaysStringKey,
        values: {
          months: remainingMonths,
          day: remainingDays,
        },
      }),
      bulletStyle: 'blue',
    },
    {
      label: () => ({ ...daysStringKey, values: { day: giveDays } }),
      bulletStyle: 'greenWithLines',
    },
  ]

  return (
    <Box marginBottom={6} marginTop={3}>
      <BoxChartFormField
        application={application}
        field={{
          boxes: defaultMonths,
          calculateBoxStyle: (index) => {
            if (index >= remainingMonths) {
              return 'greenWithLines'
            }
            return 'blue'
          },
          keys: boxChartKeys as BoxChartKey[],
        }}
      />
    </Box>
  )
}

export default GiveDaysSlider
