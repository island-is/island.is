import React, { useState } from 'react'
import { MessageDescriptor, useIntl } from 'react-intl'
import addMonths from 'date-fns/addMonths'
import addWeeks from 'date-fns/addWeeks'
import { useLocale } from '@island.is/localization'
import { Box } from '@island.is/island-ui/core'
import {
  DatePickerController,
  RadioController,
} from '@island.is/shared/form-fields'

import { DescriptionText } from '../../components'

type ValidAnswers = 'permanent' | 'temporary' | undefined

type translationGeneralKeys = 'description' | 'sectionTitle' | 'pageTitle'
type translationTypeKeys = 'label' | 'subLabel' | 'tooltip'
type translationDateKeys = 'label' | 'placeholder'

interface Props {
  typeInput: { id: string; error?: string }
  dateInput: { id: string; error?: string }
  translations: {
    general: Record<translationGeneralKeys, MessageDescriptor>
    permanentInput: Record<translationTypeKeys, MessageDescriptor>
    temporaryInput: Record<translationTypeKeys, MessageDescriptor>
    dateInput: Record<translationDateKeys, MessageDescriptor>
  }
  currentAnswer?: ValidAnswers
}
const Duration = ({
  typeInput,
  dateInput,
  translations,
  currentAnswer,
}: Props) => {
  const { formatMessage } = useIntl()
  const { lang } = useLocale()

  const durationTypeError = typeInput.error
  const durationDateError = dateInput.error

  const [statefulAnswer, setStatefulAnswer] =
    useState<ValidAnswers>(currentAnswer)
  return (
    <>
      <Box marginTop={3}>
        <DescriptionText text={translations.general.description} />
      </Box>
      <Box marginTop={5}>
        <RadioController
          id={`${typeInput.id}`}
          defaultValue={
            statefulAnswer !== undefined ? [statefulAnswer] : undefined
          }
          options={[
            {
              value: 'permanent',
              label: formatMessage(translations.permanentInput.label),
              subLabel: formatMessage(translations.permanentInput.subLabel),
              tooltip: formatMessage(translations.permanentInput.tooltip),
            },
            {
              value: 'temporary',
              label: formatMessage(translations.temporaryInput.label),
              subLabel: formatMessage(translations.temporaryInput.subLabel),
              tooltip: formatMessage(translations.temporaryInput.tooltip),
            },
          ]}
          onSelect={(newAnswer) => setStatefulAnswer(newAnswer as ValidAnswers)}
          largeButtons
          backgroundColor="white"
          error={durationTypeError}
        />

        {statefulAnswer === 'temporary' && (
          <Box>
            <DatePickerController
              id={`${dateInput.id}`}
              backgroundColor="blue"
              locale={lang}
              label={formatMessage(translations.dateInput.label)}
              placeholder={formatMessage(translations.dateInput.placeholder)}
              error={durationDateError}
              minDate={addMonths(addWeeks(new Date(), 2), 6)}
            />
          </Box>
        )}
      </Box>
    </>
  )
}

export default Duration
