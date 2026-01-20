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
  getApplicationAnswers,
  getBeginningOfThisMonth,
  isParentalGrant,
  isFosterCareAndAdoption,
  getExpectedDateOfBirthOrAdoptionDateOrBirthDate,
} from '../../lib/parentalLeaveUtils'
import { parentalLeaveFormMessages } from '../../lib/messages'
import { StartDateOptions } from '../../constants'

type ValidAnswers = StartDateOptions | undefined

const FirstPeriodStart: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  error,
  field,
  application,
}) => {
  const { register, unregister, setValue } = useFormContext()
  const { formatMessage } = useLocale()
  const expectedDateOfBirthOrAdoptionDateOrBirthDate =
    getExpectedDateOfBirthOrAdoptionDateOrBirthDate(application)
  const { rawPeriods } = getApplicationAnswers(application.answers)
  const currentIndex = extractRepeaterIndexFromField(field)
  const currentPeriod = rawPeriods[currentIndex]

  let isDisable = true
  if (expectedDateOfBirthOrAdoptionDateOrBirthDate) {
    const expectedDateTime = new Date(
      expectedDateOfBirthOrAdoptionDateOrBirthDate,
    ).getTime()
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

  const isGrant = isParentalGrant(application)

  const renderHiddenStartDateInput =
    statefulAnswer === StartDateOptions.ESTIMATED_DATE_OF_BIRTH ||
    statefulAnswer === StartDateOptions.ACTUAL_DATE_OF_BIRTH ||
    statefulAnswer === StartDateOptions.ADOPTION_DATE

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
          isFosterCareAndAdoption(application)
            ? isGrant
              ? parentalLeaveFormMessages.firstPeriodStart
                  .grantAdoptionDescription
              : parentalLeaveFormMessages.firstPeriodStart.adoptionDescription
            : isGrant
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
          options={
            isFosterCareAndAdoption(application)
              ? [
                  {
                    label: formatMessage(
                      parentalLeaveFormMessages.firstPeriodStart
                        .adoptionDateOption,
                    ),
                    value: StartDateOptions.ADOPTION_DATE,
                    disabled: isDisable,
                  },
                  {
                    label: formatMessage(
                      parentalLeaveFormMessages.firstPeriodStart
                        .specificDateOption,
                    ),
                    value: StartDateOptions.SPECIFIC_DATE,
                  },
                ]
              : [
                  {
                    label: formatMessage(
                      parentalLeaveFormMessages.firstPeriodStart
                        .dateOfBirthOption,
                    ),
                    value: StartDateOptions.ACTUAL_DATE_OF_BIRTH,
                    disabled: isDisable,
                  },
                  {
                    label: formatMessage(
                      parentalLeaveFormMessages.firstPeriodStart
                        .estimatedDateOfBirthOption,
                    ),
                    value: StartDateOptions.ESTIMATED_DATE_OF_BIRTH,
                    tooltip: formatMessage(
                      parentalLeaveFormMessages.firstPeriodStart
                        .specificDateOptionTooltip,
                    ),
                    disabled: isDisable,
                  },
                  {
                    label: formatMessage(
                      parentalLeaveFormMessages.firstPeriodStart
                        .specificDateOption,
                    ),
                    tooltip: formatMessage(
                      parentalLeaveFormMessages.firstPeriodStart
                        .specificDateOptionTooltip,
                    ),
                    value: StartDateOptions.SPECIFIC_DATE,
                  },
                ]
          }
          onSelect={onSelect}
          largeButtons
        />

        {renderHiddenStartDateInput && (
          <input
            type="hidden"
            value={expectedDateOfBirthOrAdoptionDateOrBirthDate}
            {...register(startDateFieldId)}
          />
        )}
      </Box>
    </Box>
  )
}

export default FirstPeriodStart
