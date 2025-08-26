import { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { useFormContext } from 'react-hook-form'
import { Box } from '@island.is/island-ui/core'
import { parentalLeaveFormMessages } from '../../lib/messages'
import BoxChart, { BoxChartKey } from '../components/BoxChart'
import {
  maxDaysToGiveOrReceive,
  defaultMonths,
  daysInMonth,
} from '../../config'
import { useEffectOnce } from 'react-use'
import { YES } from '@island.is/application/core'

const GiveDaysBoxChart: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { setValue, watch } = useFormContext()
  const giveDays = watch('giveRights.giveDays')

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
      <BoxChart
        application={application}
        boxes={defaultMonths}
        calculateBoxStyle={(index) => {
          if (index >= remainingMonths) {
            return 'greenWithLines'
          }
          return 'blue'
        }}
        keys={boxChartKeys as BoxChartKey[]}
      />
    </Box>
  )
}

export default GiveDaysBoxChart
