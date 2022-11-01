import React, { FC, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { useFormContext } from 'react-hook-form'
import { Box } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import { getApplicationAnswers } from '../../lib/parentalLeaveUtils'
import { parentalLeaveFormMessages } from '../../lib/messages'
import Slider from '../components/Slider'
import BoxChart, { BoxChartKey } from '../components/BoxChart'
import {
  maxDaysToGiveOrReceive,
  defaultMonths,
  maxMonths,
  daysInMonth,
  multipleBirthsDefaultDays,
  defaultMultipleBirthsMonths,
} from '../../config'
import { YES } from '../../constants'

const RequestDaysSlider: FC<FieldBaseProps> = ({ field, application }) => {
  const { id } = field
  const { formatMessage } = useLocale()
  const { register } = useFormContext()
  const {
    requestDays,
    multipleBirths,
    hasMultipleBirths,
  } = getApplicationAnswers(application.answers)
  const multipleBirthsCounter = multipleBirths - 1
  const multipleBirthsDays = multipleBirthsCounter * multipleBirthsDefaultDays
  const maxMultipleBirthsMonths =
    multipleBirthsCounter * defaultMultipleBirthsMonths + defaultMonths

  let maxDays = maxDaysToGiveOrReceive
  let maxUsedMonths = maxMonths
  if (hasMultipleBirths === YES) {
    maxDays += multipleBirthsDays
    maxUsedMonths += multipleBirthsCounter * defaultMultipleBirthsMonths
  }

  const [chosenRequestDays, setChosenRequestDays] = useState<number>(
    requestDays === 0 ? 1 : requestDays,
  )

  const requestedMonths = defaultMonths + chosenRequestDays / daysInMonth

  const daysStringKey =
    chosenRequestDays > 1
      ? parentalLeaveFormMessages.shared.requestRightsDays
      : parentalLeaveFormMessages.shared.requestRightsDay

  const daysMultipleBirthKey =
    chosenRequestDays > multipleBirthsDays + 1
      ? parentalLeaveFormMessages.shared.requestMultipleBirthsDay
      : parentalLeaveFormMessages.shared.requestMultipleBirthsDays

  const boxChartKeys: BoxChartKey[] = [
    {
      label: () => ({
        ...parentalLeaveFormMessages.shared.yourRightsInMonths,
        values: { months: defaultMonths },
      }),
      bulletStyle: 'blue',
    },
    {
      label: () => ({
        ...daysMultipleBirthKey,
        values: {
          day:
            chosenRequestDays < multipleBirthsDays
              ? chosenRequestDays
              : multipleBirthsDays,
        },
      }),
      bulletStyle: 'purple',
    },
    {
      label: () => ({
        ...daysStringKey,
        values: {
          day:
            chosenRequestDays > multipleBirthsDays
              ? chosenRequestDays - multipleBirthsDays
              : 0,
        },
      }),
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
          boxes={Math.ceil(maxUsedMonths)}
          calculateBoxStyle={(index) => {
            if (index < defaultMonths) {
              return 'blue'
            }

            if (index < requestedMonths) {
              if (index < maxMultipleBirthsMonths) {
                return 'purple'
              }
              return 'greenWithLines'
            }

            return 'grayWithLines'
          }}
          keys={boxChartKeys as BoxChartKey[]}
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
