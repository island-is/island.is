import React, { FC } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import addDays from 'date-fns/addDays'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'

import { YES } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { Box, Checkbox } from '@island.is/island-ui/core'
import { dateFormat } from '@island.is/shared/constants'

import { minPeriodDays } from '../../config'
import { StartDateOptions } from '../../constants'
import { parentalLeaveFormMessages } from '../../lib/messages'
import {
  canStartOnActualDateOfBirth,
  getApplicationAnswers,
  getExpectedDateOfBirthOrAdoptionDateOrBirthDate,
  getFirstPeriodStartForDate,
  getPeriodIndex,
} from '../../lib/parentalLeaveUtils'

/**
 * Lets the first period start on the actual date of birth, so VMST moves it
 * with the birth. `PeriodDateRange` then asks only for the end date.
 */
export const PeriodActualDateOfBirth: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ field, application }) => {
  const { formatMessage } = useLocale()
  const { setValue, control } = useFormContext()
  const currentIndex = getPeriodIndex(field)
  const { rawPeriods } = getApplicationAnswers(application.answers)
  const currentPeriod = rawPeriods[currentIndex]

  const startFieldId = `periods[${currentIndex}].startDate`
  const endFieldId = `periods[${currentIndex}].endDate`
  const firstPeriodStartFieldId = `periods[${currentIndex}].firstPeriodStart`
  const adjustLengthFieldId = `periods[${currentIndex}].endDateAdjustLength`

  const [startDate, endDate, firstPeriodStart, adjustLength]: [
    string | undefined,
    string | undefined,
    string | undefined,
    string[] | undefined,
  ] = useWatch({
    control,
    name: [
      startFieldId,
      endFieldId,
      firstPeriodStartFieldId,
      adjustLengthFieldId,
    ],
  })

  const startsOnActualDob =
    (firstPeriodStart ?? currentPeriod?.firstPeriodStart) ===
    StartDateOptions.ACTUAL_DATE_OF_BIRTH
  const keepsLength = (
    adjustLength ??
    currentPeriod?.endDateAdjustLength ??
    []
  ).includes(YES)

  // Also shown when already chosen, e.g. a leave VMST holds, so it can be undone.
  if (
    currentIndex !== 0 ||
    !(startsOnActualDob || canStartOnActualDateOfBirth(application))
  ) {
    return null
  }

  const expectedDob = getExpectedDateOfBirthOrAdoptionDateOrBirthDate(
    application,
  )?.slice(0, 10)

  const handleChange = (checked: boolean) => {
    if (!checked) {
      setValue(
        firstPeriodStartFieldId,
        getFirstPeriodStartForDate(
          application,
          startDate ?? currentPeriod?.startDate,
        ),
      )
      setValue(adjustLengthFieldId, [])
      return
    }

    if (!expectedDob) {
      return
    }

    const end = endDate ?? currentPeriod?.endDate
    setValue(startFieldId, expectedDob)
    if (!end || end <= expectedDob) {
      setValue(
        endFieldId,
        format(addDays(parseISO(expectedDob), minPeriodDays), 'yyyy-MM-dd'),
      )
    }
    setValue(firstPeriodStartFieldId, StartDateOptions.ACTUAL_DATE_OF_BIRTH)
    // VMST keeps the period length when the child is born on another date.
    setValue(adjustLengthFieldId, [YES])
  }

  return (
    <Box marginTop={2}>
      <Checkbox
        id={`periods-${currentIndex}-actualDateOfBirth`}
        name={`periods-${currentIndex}-actualDateOfBirth`}
        large
        backgroundColor="blue"
        label={formatMessage(
          parentalLeaveFormMessages.firstPeriodStart.dateOfBirthOption,
        )}
        subLabel={
          expectedDob
            ? formatMessage(
                parentalLeaveFormMessages.firstPeriodStart
                  .dateOfBirthOptionDescription,
                {
                  expectedDateOfBirth: format(
                    parseISO(expectedDob),
                    dateFormat.is,
                  ),
                },
              )
            : undefined
        }
        checked={startsOnActualDob}
        onChange={(e) => handleChange(e.target.checked)}
      />
      {startsOnActualDob && (
        <Box marginTop={2} paddingLeft={1}>
          <Checkbox
            id={`periods-${currentIndex}-adjustLength`}
            name={`periods-${currentIndex}-adjustLength`}
            label={formatMessage(
              parentalLeaveFormMessages.endDate.adjustPeriodLength,
            )}
            checked={keepsLength}
            onChange={(e) =>
              setValue(adjustLengthFieldId, e.target.checked ? [YES] : [])
            }
          />
        </Box>
      )}
    </Box>
  )
}
