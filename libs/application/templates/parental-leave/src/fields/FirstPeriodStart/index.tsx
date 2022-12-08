import React, { FC, useState, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import { extractRepeaterIndexFromField } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import {
  FieldDescription,
  RadioController,
} from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'

import {
  getExpectedDateOfBirth,
  getApplicationAnswers,
  getBeginningOfThisMonth,
} from '../../lib/parentalLeaveUtils'
import { parentalLeaveFormMessages } from '../../lib/messages'
import {
  PARENTAL_GRANT,
  PARENTAL_GRANT_STUDENTS,
  StartDateOptions,
} from '../../constants'

type ValidAnswers = StartDateOptions | undefined

const FirstPeriodStart: FC<FieldBaseProps> = ({
  error,
  field,
  application,
}) => {
  const { register, unregister, setValue } = useFormContext()
  const { formatMessage } = useLocale()
  const expectedDateOfBirth = getExpectedDateOfBirth(application)
  const { rawPeriods, applicationType } = getApplicationAnswers(
    application.answers,
  )
  const currentIndex = extractRepeaterIndexFromField(field)
  const currentPeriod = rawPeriods[currentIndex]

  let isDisable = true
  if (expectedDateOfBirth) {
    const expectedDateTime = new Date(expectedDateOfBirth).getTime()
    const beginningOfMonth = getBeginningOfThisMonth()
    const today = new Date()
    isDisable =
      expectedDateTime < today.getTime() &&
      expectedDateTime < beginningOfMonth.getTime()
  }

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

  const isGrant =
    applicationType === PARENTAL_GRANT ||
    applicationType === PARENTAL_GRANT_STUDENTS

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
          isGrant
            ? parentalLeaveFormMessages.firstPeriodStart.grantDescription
            : parentalLeaveFormMessages.firstPeriodStart.description,
        )}
      />
      <Box paddingTop={3} marginBottom={3}>
        <RadioController
          id={field.id}
          error={error}
          defaultValue={
            statefulAnswer !== undefined
              ? [statefulAnswer]
              : StartDateOptions.SPECIFIC_DATE
          }
          options={[
            {
              label: formatMessage(
                parentalLeaveFormMessages.firstPeriodStart
                  .estimatedDateOfBirthOption,
              ),
              value: StartDateOptions.ESTIMATED_DATE_OF_BIRTH,
              disabled: isDisable,
            },
            {
              label: formatMessage(
                parentalLeaveFormMessages.firstPeriodStart.dateOfBirthOption,
              ),
              value: StartDateOptions.ACTUAL_DATE_OF_BIRTH,
              disabled: isDisable,
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
