import React, { FC, useEffect,useState } from 'react'
import { useFormContext } from 'react-hook-form'

import {
  extractRepeaterIndexFromField,
  FieldBaseProps,
  NO_ANSWER,
} from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  FieldDescription,
  RadioController,
} from '@island.is/shared/form-fields'

import { StartDateOptions } from '../../constants'
import { parentalLeaveFormMessages } from '../../lib/messages'
import {
  getApplicationAnswers,
  getExpectedDateOfBirth,
} from '../../lib/parentalLeaveUtils'

type ValidAnswers = StartDateOptions | undefined

const FirstPeriodStart: FC<FieldBaseProps> = ({
  error,
  field,
  application,
}) => {
  const { register, unregister, setValue } = useFormContext()
  const { formatMessage } = useLocale()
  const expectedDateOfBirth = getExpectedDateOfBirth(application)
  const { rawPeriods } = getApplicationAnswers(application.answers)
  const currentIndex = extractRepeaterIndexFromField(field)
  const currentPeriod = rawPeriods[currentIndex]

  const [statefulAnswer, setStatefulAnswer] = useState<
    ValidAnswers | undefined
  >(
    currentPeriod?.firstPeriodStart
      ? (currentPeriod.firstPeriodStart as ValidAnswers)
      : undefined,
  )

  const onSelect = (answer: string) => {
    setStatefulAnswer(answer as ValidAnswers)
  }

  const renderHiddenStartDateInput =
    statefulAnswer === StartDateOptions.ESTIMATED_DATE_OF_BIRTH ||
    statefulAnswer === StartDateOptions.ACTUAL_DATE_OF_BIRTH

  const startDateFieldId = `periods[${currentIndex}].startDate`

  useEffect(() => {
    if (!renderHiddenStartDateInput) {
      unregister(startDateFieldId)
      setValue(startDateFieldId, undefined)
    }
  }, [renderHiddenStartDateInput, startDateFieldId, unregister, setValue])

  return (
    <Box marginY={3} key={field.id}>
      <FieldDescription
        description={formatMessage(
          parentalLeaveFormMessages.firstPeriodStart.description,
        )}
      />
      <Box paddingTop={3} marginBottom={3}>
        <RadioController
          id={field.id}
          error={error}
          defaultValue={
            statefulAnswer !== undefined ? [statefulAnswer] : NO_ANSWER
          }
          options={[
            {
              label: formatMessage(
                parentalLeaveFormMessages.firstPeriodStart
                  .estimatedDateOfBirthOption,
              ),
              value: StartDateOptions.ESTIMATED_DATE_OF_BIRTH,
            },
            {
              label: formatMessage(
                parentalLeaveFormMessages.firstPeriodStart.dateOfBirthOption,
              ),
              value: StartDateOptions.ACTUAL_DATE_OF_BIRTH,
            },
            {
              label: formatMessage(
                parentalLeaveFormMessages.firstPeriodStart.specificDateOption,
              ),
              tooltip: formatMessage(
                parentalLeaveFormMessages.firstPeriodStart
                  .specificDateOptionTooltip,
              ),
              value: StartDateOptions.SPECIFIC_DATE,
            },
          ]}
          onSelect={onSelect}
          largeButtons
        />

        {renderHiddenStartDateInput && (
          <input
            type="hidden"
            ref={register}
            value={
              statefulAnswer === StartDateOptions.ESTIMATED_DATE_OF_BIRTH ||
              statefulAnswer === StartDateOptions.ACTUAL_DATE_OF_BIRTH
                ? expectedDateOfBirth
                : undefined
            }
            name={startDateFieldId}
          />
        )}
      </Box>
    </Box>
  )
}

export default FirstPeriodStart
