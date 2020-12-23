import React, { FC, useState } from 'react'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import { Controller, useFormContext } from 'react-hook-form'
import { Box, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import Slider from '../components/Slider'
import BoxChart, { BoxChartKey } from '../components/BoxChart'

const GiveDaysSlider: FC<FieldBaseProps> = ({ field, application }) => {
  const maxDays = 45
  const { id } = field
  const { formatMessage } = useLocale()
  const currentAnswer = getValueViaPath(
    application.answers,
    field.id,
    undefined,
  ) as number

  const maxDaysToGive = 45

  const { clearErrors } = useFormContext()

  const [chosenGiveDays, setChosenGiveDays] = useState<number>(
    currentAnswer || 1,
  )

  const daysStringKey = chosenGiveDays > 1 ? m.giveRightsDays : m.giveRightsDay

  const yourRightsWithGivenDaysStringKey =
    maxDaysToGive - chosenGiveDays === 1
      ? m.yourRightsInMonthsAndDay
      : m.yourRightsInMonthsAndDays

  const boxChartKeys: BoxChartKey[] = [
    {
      label: () => ({
        ...yourRightsWithGivenDaysStringKey,
        values: { months: '5', day: maxDaysToGive - chosenGiveDays },
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
        boxes={6}
        calculateBoxStyle={(index) => {
          if (index === 5) {
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
