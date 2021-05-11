import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import addMonths from 'date-fns/addMonths'
import { useLocale } from '@island.is/localization'
import { DescriptionText } from '@island.is/application/templates/family-matters-core/components'
import { duration } from '../../lib/messages'
import { CRCFieldBaseProps } from '../../types'
import { Box } from '@island.is/island-ui/core'
import {
  DatePickerController,
  RadioController,
} from '@island.is/shared/form-fields'

const typeInput = 'selectDuration.type'
const dateInput = 'selectDuration.date'

export const selectDurationInputs = [typeInput, dateInput]

export type ValidAnswers = 'permanent' | 'temporary' | undefined
const Duration = ({ application, errors }: CRCFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { lang } = useLocale()

  const durationTypeError = errors?.selectDuration?.type
  const durationDateError = errors?.selectDuration?.date

  const [statefulAnswer, setStatefulAnswer] = useState<string | undefined>(
    application.answers?.selectDuration?.type,
  )
  return (
    <>
      <Box marginTop={3} marginBottom={5}>
        <DescriptionText text={duration.general.description} />
      </Box>
      <Box marginTop={3} marginBottom={2}>
        <RadioController
          id={`${typeInput}`}
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
          error={durationTypeError}
        />

        {statefulAnswer === 'temporary' && (
          <Box>
            <DatePickerController
              id={`${dateInput}`}
              backgroundColor="blue"
              locale={lang}
              label={formatMessage(duration.dateInput.label)}
              placeholder={formatMessage(duration.dateInput.placeholder)}
              error={durationDateError}
              minDate={addMonths(new Date(), 6)}
            />
          </Box>
        )}
      </Box>
    </>
  )
}

export default Duration
