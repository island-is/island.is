import React, { FC, useState } from 'react'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import { Controller, useFormContext } from 'react-hook-form'
import BoxChart, { BoxChartKey } from '../components/BoxChart'
import { Box, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { RadioController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { m, mm } from '../../lib/messages'
import Slider from '../components/Slider'

type ValidAnswers = 'yes' | 'no' | undefined

const RequestRights: FC<FieldBaseProps> = ({ error, field, application }) => {
  const { formatMessage } = useLocale()
  const currentAnswer = getValueViaPath(
    application.answers,
    field.id,
    undefined,
  ) as ValidAnswers

  const { clearErrors } = useFormContext()

  const [statefulAnswer, setStatefulAnswer] = useState<ValidAnswers>(
    currentAnswer,
  )

  const [chosenRequestDays, setChosenRequestDays] = useState<number>(1)

  const numberOfBoxes = statefulAnswer === 'no' ? 6 : 7

  const boxChartKeys: BoxChartKey[] = [
    {
      label: () => ({ ...m.yourRightsInMonths, values: { months: '6' } }),
      bulletStyle: 'blue',
    },
  ]
  if (statefulAnswer === 'yes') {
    boxChartKeys.push({
      label: m.requestRightsMonths,
      bulletStyle: 'greenWithLines',
    })
  }
  return (
    <Box marginTop={3} marginBottom={2} key={field.id}>
      <Box paddingY={3}>
        <RadioController
          id={field.id}
          defaultValue={
            statefulAnswer !== undefined ? [statefulAnswer] : undefined
          }
          options={[
            { label: formatMessage(m.requestRightsYes), value: 'yes' },
            { label: formatMessage(m.requestRightsNo), value: 'no' },
          ]}
          onSelect={(newAnswer) => setStatefulAnswer(newAnswer as ValidAnswers)}
          largeButtons
        />
      </Box>
      {statefulAnswer === 'yes' && (
        <Box marginBottom={12}>
          <Text marginBottom={4} variant="h3">
            How many days would you like to request?
          </Text>
          <Controller
            defaultValue={chosenRequestDays}
            name={'requestDays'}
            render={({ onChange, value }) => (
              <Slider
                label={{
                  singular: 'Day',
                  plural: 'Days',
                }}
                min={1}
                max={30}
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
                  clearErrors('requestDays')
                  onChange(newValue)
                  setChosenRequestDays(newValue)
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
        boxes={numberOfBoxes}
        calculateBoxStyle={(index) => {
          if (index === 6) {
            if (statefulAnswer === 'yes') {
              return 'greenWithLines'
            }
            return 'grayWithLines'
          }
          return 'blue'
        }}
        keys={boxChartKeys as BoxChartKey[]}
      />
    </Box>
  )
}

export default RequestRights
