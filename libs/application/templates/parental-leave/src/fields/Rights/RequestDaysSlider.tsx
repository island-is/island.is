import React, { FC, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { useFormContext } from 'react-hook-form'
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

const RequestDaysSlider: FC<FieldBaseProps> = ({ field, application }) => {
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
  const { register } = useFormContext()
  const { requestDays } = getApplicationAnswers(application.answers)

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
    <>
      <Box marginBottom={6} marginTop={5}>
        <Box marginBottom={12}>
          <Slider
            label={{
              singular: formatMessage(parentalLeaveFormMessages.shared.day),
              plural: formatMessage(parentalLeaveFormMessages.shared.days),
            }}
            min={1}
            max={maxDays}
            step={1}
            currentIndex={chosenRequestDays}
            showMinMaxLabels
            showToolTip
            trackStyle={{ gridTemplateRows: 8 }}
            calculateCellStyle={() => {
              return {
                background: theme.color.dark200,
              }
            }}
            onChange={(newValue: number) => {
              setChosenRequestDays(newValue)
            }}
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

      <input
        type="hidden"
        ref={register}
        name={id}
        value={chosenRequestDays.toString()}
      />
      <input
        type="hidden"
        name="requestRights.isRequestingRights"
        ref={register}
        value={YES}
      />
    </>
  )
}

export default RequestDaysSlider
