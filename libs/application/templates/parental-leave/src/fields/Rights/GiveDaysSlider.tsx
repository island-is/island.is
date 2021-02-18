import React, { FC, useState } from 'react'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import { Controller, useFormContext } from 'react-hook-form'
import { Box, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import { parentalLeaveFormMessages } from '../../lib/messages'
import Slider from '../components/Slider'
import BoxChart, { BoxChartKey } from '../components/BoxChart'
import { maxDaysToGiveOrReceive, defaultMonths, minMonths } from '../../config'

const GiveDaysSlider: FC<FieldBaseProps> = ({ field, application }) => {
  const { id } = field
  const { formatMessage } = useLocale()
  const currentAnswer = getValueViaPath(
    application.answers,
    field.id,
    1,
  ) as number

  const { clearErrors } = useFormContext()
  const [chosenGiveDays, setChosenGiveDays] = useState<number>(currentAnswer)
  const daysStringKey =
    chosenGiveDays > 1
      ? parentalLeaveFormMessages.shared.giveRightsDays
      : parentalLeaveFormMessages.shared.giveRightsDay
  const yourRightsWithGivenDaysStringKey =
    maxDaysToGiveOrReceive - chosenGiveDays === 1
      ? parentalLeaveFormMessages.shared.yourRightsInMonthsAndDay
      : parentalLeaveFormMessages.shared.yourRightsInMonthsAndDays
  const boxChartKeys: BoxChartKey[] = [
    {
      label: () => ({
        ...yourRightsWithGivenDaysStringKey,
        values: {
          months: minMonths,
          day: maxDaysToGiveOrReceive - chosenGiveDays,
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
    <Box marginBottom={6}>
      <Text marginBottom={4} variant="h3">
        {formatMessage(parentalLeaveFormMessages.shared.giveRightsDaysTitle)}
      </Text>
      <Box marginBottom={12}>
        <Controller
          defaultValue={chosenGiveDays}
          name={id}
          render={({ onChange, value }) => (
            <Slider
              label={{
                singular: formatMessage(parentalLeaveFormMessages.shared.day),
                plural: formatMessage(parentalLeaveFormMessages.shared.days),
              }}
              min={1}
              max={maxDaysToGiveOrReceive}
              step={1}
              currentIndex={value || chosenGiveDays}
              showMinMaxLabels
              showToolTip
              trackStyle={{ gridTemplateRows: 8 }}
              calculateCellStyle={() => {
                return {
                  background: theme.color.dark200,
                }
              }}
              onChange={(newValue: number) => {
                clearErrors(id)
                onChange(newValue)
                setChosenGiveDays(newValue)
              }}
            />
          )}
        />
      </Box>
      <BoxChart
        application={application}
        boxes={defaultMonths}
        calculateBoxStyle={(index) => {
          if (index === minMonths) {
            return 'grayWithLines'
          }
          return 'blue'
        }}
        keys={boxChartKeys as BoxChartKey[]}
      />
    </Box>
  )
}

export default GiveDaysSlider
