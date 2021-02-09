import React, { useState } from 'react'
import { duration } from '../../lib/messages'
import { DescriptionText } from '../components'
import {
  FieldBaseProps,
  getValueViaPath,
} from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  DatePickerController,
  RadioController,
} from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'

export type ValidAnswers = 'permanent' | 'temporary' | undefined
const Duration = ({ field, application, error }: FieldBaseProps) => {
  const currentAnswer = getValueViaPath(
    application.answers,
    field.id,
    undefined,
  ) as ValidAnswers
  const { formatMessage } = useLocale()

  const [statefulAnswer, setStatefulAnswer] = useState<ValidAnswers>(
    currentAnswer,
  )
  const description = duration.general.description.defaultMessage
  return (
    <>
      <DescriptionText textNode={description} />
      <Box marginTop={3} marginBottom={2}>
          <RadioController
            id="selectDuration[0]"
            defaultValue={
              statefulAnswer !== undefined ? [statefulAnswer] : undefined
            }
            options={[
              {
                value: 'permanent',
                label: formatMessage(duration.permanentInput.label),
                subLabel: formatMessage(duration.permanentInput.subLabel),
                tooltip: formatMessage(duration.permanentInput.tooltip),
              },
              {
                value: 'temporary',
                label: formatMessage(duration.temporaryInput.label),
                subLabel: formatMessage(duration.temporaryInput.subLabel),
                tooltip: formatMessage(duration.temporaryInput.tooltip),
              },
            ]}
            onSelect={(newAnswer) =>
              setStatefulAnswer(newAnswer as ValidAnswers)
            }
            largeButtons
          />

        {statefulAnswer === 'temporary' && (
          <Box>
            <DatePickerController
              id="selectDuration[1]"
              backgroundColor="blue"
              label={formatMessage(duration.dateInput.label)}
              placeholder={formatMessage(duration.dateInput.placeholder)}
              error={error}
            />
          </Box>
        )}
      </Box>
    </>
  )
}

export default Duration
