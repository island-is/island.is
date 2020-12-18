import React, { FC, useState } from 'react'
import {
  FieldBaseProps,
  formatText,
  getValueViaPath,
} from '@island.is/application/core'
import { Controller, useFormContext } from 'react-hook-form'
import BoxChart, { BoxChartKey } from '../components/BoxChart'
import { Box, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import { RadioController } from '@island.is/shared/form-fields'
import { m, mm } from '../../lib/messages'
import Slider from '../components/Slider'

type ValidAnswers = 'yes' | 'no' | undefined

const GiveRights: FC<FieldBaseProps> = ({ error, field, application }) => {
  const currentAnswer = getValueViaPath(
    application.answers,
    field.id,
    undefined,
  ) as ValidAnswers

  const { clearErrors } = useFormContext()
  const { formatMessage } = useLocale()

  const [statefulAnswer, setStatefulAnswer] = useState<ValidAnswers>(
    currentAnswer,
  )

  const giveDaysAnswerId = 'giveDays'
  const requestDaysAnswer = getValueViaPath(
    application.answers,
    giveDaysAnswerId,
    undefined,
  ) as number

  const [chosenGiveDays, setChosenGiveDays] = useState<number>(
    requestDaysAnswer || 1,
  )

  const daysStringKey = chosenGiveDays > 1 ? m.giveRightsDays : m.giveRightsDay

  const boxChartKeys =
    statefulAnswer === 'yes'
      ? [
          {
            label: () => ({ ...m.yourRightsInMonths, values: { months: '5' } }),
            bulletStyle: 'blue',
          },
          {
            label: () => ({
              ...daysStringKey,
              values: { day: chosenGiveDays },
            }),

            bulletStyle: 'grayWithLines',
          },
        ]
      : [
          {
            label: () => ({ ...m.yourRightsInMonths, values: { months: '6' } }),
            bulletStyle: 'blue',
          },
        ]

  return (
    <Box marginTop={3} marginBottom={2} key={field.id}>
      <Box paddingY={3}>
        <RadioController
          id={field.id}
          defaultValue={
            statefulAnswer !== undefined ? [statefulAnswer] : undefined
          }
          options={[
            {
              label: formatText(m.giveRightsYes, application, formatMessage),
              value: 'yes',
            },
            {
              label: formatText(m.giveRightsNo, application, formatMessage),
              value: 'no',
            },
          ]}
          onSelect={(newAnswer) => setStatefulAnswer(newAnswer as ValidAnswers)}
          largeButtons
        />
      </Box>
      {statefulAnswer === 'yes' && (
        <Box marginBottom={12}>
          <Text marginBottom={4} variant="h3">
            {formatMessage(m.giveRightsDaysTitle)}
          </Text>
          <Controller
            defaultValue={chosenGiveDays}
            name={giveDaysAnswerId}
            render={({ onChange, value }) => (
              <Slider
                label={{
                  singular: formatMessage(m.day),
                  plural: formatMessage(m.days),
                }}
                min={1}
                max={30}
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
                  clearErrors(giveDaysAnswerId)
                  onChange(newValue)
                  setChosenGiveDays(newValue)
                }}
              />
            )}
          />
        </Box>
      )}
      {error && (
        <Box color="red400" padding={2}>
          <Text color="red400">{formatMessage(mm.errors.requiredAnswer)}</Text>
        </Box>
      )}
      <BoxChart
        application={application}
        boxes={6}
        calculateBoxStyle={(index) => {
          if (index === 5) {
            if (statefulAnswer === 'yes') {
              return 'grayWithLines'
            } else if (statefulAnswer === undefined) return 'grayWithLines'
          }
          return 'blue'
        }}
        keys={boxChartKeys as BoxChartKey[]}
      />
    </Box>
  )
}

export default GiveRights
