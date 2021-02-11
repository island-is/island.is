import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { duration } from '../../lib/messages'
import { DescriptionText } from '../components'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import {
  DatePickerController,
  RadioController,
} from '@island.is/shared/form-fields'

export type ValidAnswers = 'permanent' | 'temporary' | undefined
const Duration = ({ field, application, error }: FieldBaseProps) => {
  const currentAnswer = getValueViaPath(
    application.answers,
    field.id,
    undefined,
  ) as ValidAnswers
  const { formatMessage } = useIntl()

  const [statefulAnswer, setStatefulAnswer] = useState<ValidAnswers>(
    currentAnswer,
  )
  return (
    <>
      <Box marginTop={3} marginBottom={5}>
        <DescriptionText text={duration.general.description} />
      </Box>
      <Box marginTop={3} marginBottom={2}>
        <RadioController
          id={`${field.id}[0]`}
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
          onSelect={(newAnswer) => setStatefulAnswer(newAnswer as ValidAnswers)}
          largeButtons
        />

        {statefulAnswer === 'temporary' && (
          <Box>
            <DatePickerController
              id={`${field.id}[1]`}
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
