import React, { FC, useState } from 'react'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import { Controller, useFormContext } from 'react-hook-form'
import { Box, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import { parentalLeaveFormMessages } from '../../lib/messages'
import Slider from '../components/Slider'
import BoxChart, { BoxChartKey } from '../components/BoxChart'
import { maxDaysToGiveOrReceive, defaultMonths, maxMonths } from '../../config'

const RequestDaysSlider: FC<FieldBaseProps> = ({ field, application }) => {
  const maxDays = maxDaysToGiveOrReceive
  const { id } = field
  const { formatMessage } = useLocale()
  const currentAnswer = getValueViaPath(
    application.answers,
    field.id,
    1,
  ) as number

  const { clearErrors } = useFormContext()

  const [chosenRequestDays, setChosenRequestDays] = useState<number>(
    currentAnswer,
  )

  const daysStringKey =
    chosenRequestDays > 1
      ? parentalLeaveFormMessages.shared.requestRightsDays
      : parentalLeaveFormMessages.shared.requestRightsDay

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
    <Box marginBottom={6}>
      <Text marginBottom={4} variant="h3">
        {formatMessage(parentalLeaveFormMessages.shared.requestRightsDaysTitle)}
      </Text>
      <Box marginBottom={12}>
        <Controller
          defaultValue={chosenRequestDays}
          name={id}
          render={({ onChange, value }) => (
            <Slider
              label={{
                singular: formatMessage(parentalLeaveFormMessages.shared.day),
                plural: formatMessage(parentalLeaveFormMessages.shared.days),
              }}
              min={1}
              max={maxDays}
              step={1}
              currentIndex={value || chosenRequestDays}
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
                setChosenRequestDays(newValue)
              }}
            />
          )}
        />
      </Box>
      <BoxChart
        application={application}
        boxes={maxMonths}
        calculateBoxStyle={(index) => {
          if (index === defaultMonths) {
            return 'greenWithLines'
          }
          return 'blue'
        }}
        keys={boxChartKeys as BoxChartKey[]}
      />
    </Box>
  )
}

export default RequestDaysSlider
