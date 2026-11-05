import { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { useFormContext } from 'react-hook-form'
import { Box } from '@island.is/island-ui/core'
import {
  getMaxMultipleBirthsAndDefaultMonths,
  getMaxMultipleBirthsInMonths,
} from '../../lib/parentalLeaveUtils'
import { parentalLeaveFormMessages } from '../../lib/messages'
import BoxChart, { BoxChartKey } from '../components/BoxChart'
import {
  defaultMonths,
  daysInMonth,
  maxDaysToGiveOrReceive,
} from '../../config'
import { useEffectOnce } from 'react-use'
import { YES } from '@island.is/application/core'

const RequestDaysBoxChart: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const alreadySelectedMonths = getMaxMultipleBirthsAndDefaultMonths(
    application.answers,
  )
  const maxMonths =
    alreadySelectedMonths + Math.ceil(maxDaysToGiveOrReceive / daysInMonth)
  const multipleBirthsInMonths = getMaxMultipleBirthsInMonths(
    application.answers,
  )
  const { setValue, watch } = useFormContext()

  useEffectOnce(() => {
    setValue('requestRights.isRequestingRights', YES)
  })

  const chosenRequestDays = watch('requestRights.requestDays')

  const requestedMonths =
    defaultMonths + multipleBirthsInMonths + chosenRequestDays / daysInMonth

  const daysStringKey =
    chosenRequestDays > 1
      ? parentalLeaveFormMessages.shared.requestRightsDays
      : parentalLeaveFormMessages.shared.requestRightsDay

  const boxChartKeysWithMultipleBirths: BoxChartKey[] = [
    {
      label: () => ({
        ...parentalLeaveFormMessages.shared.yourRightsInMonths,
        values: { months: defaultMonths },
      }),
      bulletStyle: 'blue',
    },
    {
      label: () => ({
        ...parentalLeaveFormMessages.shared.yourMultipleBirthsRightsInMonths,
        values: { months: multipleBirthsInMonths },
      }),
      bulletStyle: 'purple',
    },
    {
      label: () => ({ ...daysStringKey, values: { day: chosenRequestDays } }),
      bulletStyle: 'greenWithLines',
    },
  ]

  const boxChartKeys: BoxChartKey[] = [
    {
      label: () => ({
        ...parentalLeaveFormMessages.shared.yourRightsInMonths,
        values: { months: defaultMonths },
      }),
      bulletStyle: 'blue',
    },
    {
      label: () => ({ ...daysStringKey, values: { day: chosenRequestDays } }),
      bulletStyle: 'greenWithLines',
    },
  ]

  return (
    <Box marginBottom={6} marginTop={5}>
      <BoxChart
        application={application}
        boxes={Math.ceil(maxMonths)}
        calculateBoxStyle={(index) => {
          if (index < defaultMonths) {
            return 'blue'
          }

          if (index < alreadySelectedMonths) {
            return 'purple'
          }

          if (index < requestedMonths) {
            return 'greenWithLines'
          }

          return 'grayWithLines'
        }}
        keys={
          defaultMonths === alreadySelectedMonths
            ? boxChartKeys
            : boxChartKeysWithMultipleBirths
        }
      />
    </Box>
  )
}

export default RequestDaysBoxChart
