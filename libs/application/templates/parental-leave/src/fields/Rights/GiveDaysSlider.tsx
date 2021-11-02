import React, { FC, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { useFormContext } from 'react-hook-form'
import { Box } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import { parentalLeaveFormMessages } from '../../lib/messages'
import Slider from '../components/Slider'
import BoxChart, { BoxChartKey } from '../components/BoxChart'
import { getApplicationAnswers } from '../../lib/parentalLeaveUtils'
import {
  maxDaysToGiveOrReceive,
  defaultMonths,
  daysInMonth,
} from '../../config'
import { YES } from '../../constants'

const GiveDaysSlider: FC<FieldBaseProps> = ({ field, application }) => {
  const { id } = field
  const { formatMessage } = useLocale()
  const { register } = useFormContext()
  const { giveDays } = getApplicationAnswers(application.answers)

  const [chosenGiveDays, setChosenGiveDays] = useState<number>(
    giveDays === 0 ? 1 : giveDays,
  )

  const daysStringKey =
    chosenGiveDays > 1
      ? parentalLeaveFormMessages.shared.giveRightsDays
      : parentalLeaveFormMessages.shared.giveRightsDay

  const yourRightsWithGivenDaysStringKey =
    maxDaysToGiveOrReceive - chosenGiveDays === 1
      ? parentalLeaveFormMessages.shared.yourRightsInMonthsAndDay
      : parentalLeaveFormMessages.shared.yourRightsInMonthsAndDays

  const rightsAfterTransfer = defaultMonths * daysInMonth - chosenGiveDays

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
      label: () => ({ ...daysStringKey, values: { day: chosenGiveDays } }),
      bulletStyle: 'greenWithLines',
    },
  ]

  return (
    <>
      <Box marginBottom={6} marginTop={3}>
        <Box marginBottom={12}>
          <Slider
            label={{
              singular: formatMessage(parentalLeaveFormMessages.shared.day),
              plural: formatMessage(parentalLeaveFormMessages.shared.days),
            }}
            min={1}
            max={maxDaysToGiveOrReceive}
            step={1}
            currentIndex={chosenGiveDays}
            showMinMaxLabels
            showToolTip
            trackStyle={{ gridTemplateRows: 8 }}
            calculateCellStyle={() => {
              return {
                background: theme.color.dark200,
              }
            }}
            onChange={(newValue: number) => {
              setChosenGiveDays(newValue)
            }}
          />
        </Box>
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
      <input
        type="hidden"
        name={id}
        ref={register}
        value={chosenGiveDays.toString()}
      />
      <input
        type="hidden"
        name="giveRights.isGivingRights"
        ref={register}
        value={YES}
      />
    </>
  )
}

export default GiveDaysSlider
