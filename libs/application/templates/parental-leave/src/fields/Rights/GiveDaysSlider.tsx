import React, { FC, useState } from 'react'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import { Controller, useFormContext } from 'react-hook-form'
import { Box, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import Slider from '../components/Slider'
import BoxChart, { BoxChartKey } from '../components/BoxChart'
import { maxDaysToGiveOrReceive, defaultMonths, minMonths } from '../../config'

const GiveDaysSlider: FC<FieldBaseProps> = ({ field, application }) => {
  const maxDays = maxDaysToGiveOrReceive
  const { id } = field
  const { formatMessage } = useLocale()
  const currentAnswer = getValueViaPath(
    application.answers,
    field.id,
    1,
  ) as number

  const { clearErrors } = useFormContext()

  const [chosenGiveDays, setChosenGiveDays] = useState<number>(currentAnswer)

  const daysStringKey = chosenGiveDays > 1 ? m.giveRightsDays : m.giveRightsDay

  const yourRightsWithGivenDaysStringKey =
    maxDays - chosenGiveDays === 1
      ? m.yourRightsInMonthsAndDay
      : m.yourRightsInMonthsAndDays

  const boxChartKeys: BoxChartKey[] = [
    {
      label: () => ({
        ...yourRightsWithGivenDaysStringKey,
        values: { months: minMonths, day: maxDays - chosenGiveDays },
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
        {formatMessage(m.giveRightsDaysTitle)}
      </Text>
      <Box marginBottom={12}>
        <Controller
          defaultValue={chosenGiveDays}
          name={id}
          render={({ onChange, value }) => (
            <Slider
              label={{
                singular: formatMessage(m.day),
                plural: formatMessage(m.days),
              }}
              min={1}
              max={maxDays}
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
          if (index === defaultMonths - 1) {
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
