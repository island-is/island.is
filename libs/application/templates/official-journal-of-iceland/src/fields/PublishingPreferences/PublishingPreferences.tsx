import { Box, Checkbox } from '@island.is/island-ui/core'
import { useState } from 'react'
import { FormGroup } from '../../components/FromGroup/FormGroup'
import { useFormatMessage } from '../../hooks'
import { publishingPreferences } from '../../lib/messages'
import { AnswerOption, InputFields, OJOIFieldBaseProps } from '../../lib/types'
import { getWeekendDates } from '../../lib/utils'
import { FormIntro } from '../../components/FormIntro/FormIntro'
import {
  CheckboxController,
  DatePickerController,
  InputController,
} from '@island.is/shared/form-fields'
import addYears from 'date-fns/addYears'
import { Controller } from 'react-hook-form'
import { CommunicationChannels } from '../../components/CommunicationChannels/CommunicationChannels'
import { getErrorViaPath } from '@island.is/application/core'

export const PublishingPreferences = ({
  application,
  errors,
}: OJOIFieldBaseProps) => {
  const { f } = useFormatMessage(application)

  const { answers } = application

  const today = new Date()
  const maxEndDate = addYears(today, 5)

  return (
    <>
      <FormIntro
        title={f(publishingPreferences.general.formTitle)}
        intro={f(publishingPreferences.general.formIntro)}
      />
      <FormGroup title={f(publishingPreferences.dateChapter.title)}>
        <DatePickerController
          backgroundColor="blue"
          size="sm"
          name={InputFields.publishingPreferences.date}
          id={InputFields.publishingPreferences.date}
          label={f(publishingPreferences.inputs.datepicker.label)}
          minDate={today}
          maxDate={maxEndDate}
          defaultValue={answers.publishingPreferences?.date ?? ''}
          excludeDates={getWeekendDates(today, maxEndDate)}
          error={getErrorViaPath(
            errors,
            InputFields.publishingPreferences.date,
          )}
        />
        <Controller
          name={InputFields.publishingPreferences.fastTrack}
          defaultValue={
            application.answers.publishingPreferences?.fastTrack ??
            AnswerOption.NO
          }
          render={({ field: { onChange, value } }) => {
            return (
              <Checkbox
                onChange={(e) => {
                  onChange(
                    e.target.checked ? AnswerOption.YES : AnswerOption.NO,
                  )
                }}
                checked={value === AnswerOption.YES}
                label={f(publishingPreferences.inputs.fastTrack.label)}
                name={InputFields.publishingPreferences.fastTrack}
                id={InputFields.publishingPreferences.fastTrack}
              />
            )
          }}
        />
      </FormGroup>
      <FormGroup
        title={f(publishingPreferences.communicationChapter.title)}
        description={f(publishingPreferences.communicationChapter.intro)}
      >
        <Box width="full">
          <Controller
            name={InputFields.publishingPreferences.communicationChannels}
            defaultValue={
              application.answers.publishingPreferences
                ?.communicationChannels ?? []
            }
            render={({ field: { onChange, value } }) => {
              return (
                <CommunicationChannels
                  onChange={(channels) => onChange(channels)}
                  channels={
                    application.answers.publishingPreferences
                      ?.communicationChannels ?? []
                  }
                />
              )
            }}
          />
        </Box>
      </FormGroup>
      <FormGroup
        title={f(publishingPreferences.messagesChapter.title)}
        description={f(publishingPreferences.messagesChapter.intro)}
      >
        <Box width="full">
          <InputController
            id={InputFields.publishingPreferences.message}
            name={InputFields.publishingPreferences.message}
            textarea
            rows={4}
            placeholder={f(publishingPreferences.inputs.messages.placeholder)}
            label={f(publishingPreferences.inputs.messages.label)}
          />
        </Box>
      </FormGroup>
    </>
  )
}
