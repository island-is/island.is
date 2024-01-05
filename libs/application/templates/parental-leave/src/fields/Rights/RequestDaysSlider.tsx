import React, { FC, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { Controller, useFormContext } from 'react-hook-form'
import { Box } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import {
  getApplicationAnswers,
  getMaxMultipleBirthsAndDefaultMonths,
  getMaxMultipleBirthsInMonths,
} from '../../lib/parentalLeaveUtils'
import { parentalLeaveFormMessages } from '../../lib/messages'
import Slider from '../components/Slider'
import BoxChart, { BoxChartKey } from '../components/BoxChart'
import {
  defaultMonths,
  daysInMonth,
  maxDaysToGiveOrReceive,
} from '../../config'
import { YES } from '../../constants'
import { useEffectOnce } from 'react-use'

const RequestDaysSlider: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  field,
  application,
}) => {
  const maxDays = maxDaysToGiveOrReceive
  const alreadySelectedMonths = getMaxMultipleBirthsAndDefaultMonths(
    application.answers,
  )
  const maxMonths =
    alreadySelectedMonths + Math.ceil(maxDaysToGiveOrReceive / daysInMonth)
  const multipleBirthsInMonths = getMaxMultipleBirthsInMonths(
    application.answers,
  )
  const { id } = field
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()
  const { requestDays } = getApplicationAnswers(application.answers)

  useEffectOnce(() => {
    setValue('requestRights.isRequestingRights', YES)
  })

  const [chosenRequestDays, setChosenRequestDays] = useState<number>(
    requestDays === 0 ? 1 : requestDays,
  )

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
      <Box marginBottom={12}>
        <Controller
          defaultValue={chosenRequestDays}
          name={id}
          render={({ field: { onChange, value } }) => (
            <Slider
              label={{
                singular: formatMessage(parentalLeaveFormMessages.shared.day),
                plural: formatMessage(parentalLeaveFormMessages.shared.days),
              }}
              min={1}
              max={maxDays}
              step={1}
              currentIndex={value}
              showMinMaxLabels
              showToolTip
              trackStyle={{ gridTemplateRows: 8 }}
              calculateCellStyle={() => {
                return {
                  background: theme.color.dark200,
                }
              }}
              onChange={(newValue: number) => {
                onChange(newValue.toString())
                setChosenRequestDays(newValue)
              }}
            />
          )}
        />
      </Box>
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

export default RequestDaysSlider
