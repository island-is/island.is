import React, { FC, useEffect, useMemo } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import parseISO from 'date-fns/parseISO'
import addDays from 'date-fns/addDays'
import addMonths from 'date-fns/addMonths'
import format from 'date-fns/format'
import isValid from 'date-fns/isValid'

import { FieldBaseProps, CustomField } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { Box, DatePicker } from '@island.is/island-ui/core'

import { parentalLeaveFormMessages } from '../../lib/messages'
import {
  getApplicationAnswers,
  getAllPeriodDates,
  getExpectedDateOfBirthOrAdoptionDateOrBirthDate,
  getMinimumStartDate,
  getPeriodIndex,
} from '../../lib/parentalLeaveUtils'
import { usageMaxMonths } from '../../config'
import { StartDateOptions } from '../../constants'

type PeriodDateRangeProps = FieldBaseProps & CustomField

const toDateString = (date: Date) =>
  isValid(date) ? format(date, 'yyyy-MM-dd') : undefined

export const PeriodDateRange: FC<
  React.PropsWithChildren<PeriodDateRangeProps>
> = ({ field, application }) => {
  const { formatMessage } = useLocale()
  const { setValue, register, control } = useFormContext()
  const currentIndex = getPeriodIndex(field)
  const { periods, rawPeriods } = getApplicationAnswers(application.answers)

  const startFieldId = `periods[${currentIndex}].startDate`
  const endFieldId = `periods[${currentIndex}].endDate`
  const firstPeriodStartFieldId = `periods[${currentIndex}].firstPeriodStart`
  const useLengthFieldId = `periods[${currentIndex}].useLength`

  const currentPeriod = rawPeriods[currentIndex]

  // The picked range lives in form state until the screen is submitted, so it
  // is read from there rather than from `application.answers`.
  const watchedStartDate: string | undefined = useWatch({
    control,
    name: startFieldId,
  })
  const watchedEndDate: string | undefined = useWatch({
    control,
    name: endFieldId,
  })

  const expectedDob =
    getExpectedDateOfBirthOrAdoptionDateOrBirthDate(application)

  // Determine initial start date:
  // - First period: estimated birthdate
  // - Subsequent periods: day after previous period's endDate
  const defaultStartDate = useMemo(() => {
    if (currentIndex > 0 && periods[currentIndex - 1]?.endDate) {
      return addDays(parseISO(periods[currentIndex - 1].endDate), 1)
    }
    if (expectedDob) {
      return parseISO(expectedDob)
    }
    return new Date()
  }, [currentIndex, periods, expectedDob])

  // Min date for the date picker
  const minDate = useMemo(() => {
    return getMinimumStartDate(application)
  }, [application])

  // Max date: child's 2nd birthday - 1 day
  const maxDate = useMemo(() => {
    if (expectedDob) {
      return addDays(addMonths(parseISO(expectedDob), usageMaxMonths), -1)
    }
    return undefined
  }, [expectedDob])

  // Exclude dates already used by other periods (not the current one)
  const excludeDates = useMemo(() => {
    const otherPeriods = periods.filter((_, index) => index !== currentIndex)
    return getAllPeriodDates(otherPeriods)
  }, [periods, currentIndex])

  // DatePicker resets its displayed range whenever this object changes, so it
  // is memoized on primitive values only: form state first (what the user just
  // picked), then saved answers, then the default.
  const startDateValue =
    watchedStartDate ||
    currentPeriod?.startDate ||
    toDateString(defaultStartDate)
  const endDateValue =
    watchedEndDate ||
    currentPeriod?.endDate ||
    (startDateValue
      ? toDateString(addDays(parseISO(startDateValue), 14))
      : undefined)

  const selectedRange = useMemo(
    () => ({
      startDate: startDateValue ? parseISO(startDateValue) : null,
      endDate: endDateValue ? parseISO(endDateValue) : null,
    }),
    [startDateValue, endDateValue],
  )

  // Pre-fill start and end dates if not already set
  useEffect(() => {
    if (!currentPeriod?.startDate && defaultStartDate) {
      setValue(startFieldId, format(defaultStartDate, 'yyyy-MM-dd'))
    }
    if (!currentPeriod?.endDate && defaultStartDate) {
      const defaultEndDate = addDays(defaultStartDate, 14) // 15 days to meet minimum period length
      setValue(endFieldId, format(defaultEndDate, 'yyyy-MM-dd'))
    }
    // Set firstPeriodStart (required by answer validators)
    if (!currentPeriod?.firstPeriodStart) {
      setValue(
        firstPeriodStartFieldId,
        currentIndex === 0
          ? StartDateOptions.ESTIMATED_DATE_OF_BIRTH
          : StartDateOptions.SPECIFIC_DATE,
      )
    }
    // Set useLength to 'no' (user picks end date directly via range picker)
    if (!currentPeriod?.useLength) {
      setValue(useLengthFieldId, 'no')
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (currentIndex < 0) {
      console.error(
        new Error(
          'Cannot render PeriodDateRange component with a currentIndex of -1',
        ),
      )
    }
  }, [currentIndex])

  if (currentIndex < 0) {
    return null
  }

  const handleChange = (startDate: Date, endDate?: Date) => {
    setValue(startFieldId, format(startDate, 'yyyy-MM-dd'))
    if (endDate) {
      setValue(endFieldId, format(endDate, 'yyyy-MM-dd'))
    }
  }

  return (
    <Box marginTop={2}>
      <DatePicker
        id={`periods-${currentIndex}-dateRange`}
        label={formatMessage(parentalLeaveFormMessages.dateRange.label)}
        placeholderText={formatMessage(
          parentalLeaveFormMessages.dateRange.placeholder,
        )}
        locale="is"
        range
        minDate={minDate}
        maxDate={maxDate}
        excludeDates={excludeDates}
        selectedRange={selectedRange}
        handleChange={handleChange}
      />
      <input type="hidden" {...register(startFieldId)} />
      <input type="hidden" {...register(endFieldId)} />
      <input type="hidden" {...register(firstPeriodStartFieldId)} />
      <input type="hidden" {...register(useLengthFieldId)} />
    </Box>
  )
}
