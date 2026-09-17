import React, { FC, useEffect, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import parseISO from 'date-fns/parseISO'
import addDays from 'date-fns/addDays'
import addMonths from 'date-fns/addMonths'
import format from 'date-fns/format'

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

export const PeriodDateRange: FC<
  React.PropsWithChildren<PeriodDateRangeProps>
> = ({ field, application }) => {
  const { formatMessage } = useLocale()
  const { setValue, register } = useFormContext()
  const currentIndex = getPeriodIndex(field)
  const { periods, rawPeriods } = getApplicationAnswers(application.answers)

  const startFieldId = `periods[${currentIndex}].startDate`
  const endFieldId = `periods[${currentIndex}].endDate`
  const firstPeriodStartFieldId = `periods[${currentIndex}].firstPeriodStart`
  const useLengthFieldId = `periods[${currentIndex}].useLength`

  const currentPeriod = rawPeriods[currentIndex]

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

  const selectedStartDate = currentPeriod?.startDate
    ? parseISO(currentPeriod.startDate)
    : defaultStartDate

  const selectedEndDate = currentPeriod?.endDate
    ? parseISO(currentPeriod.endDate)
    : defaultStartDate
    ? addDays(defaultStartDate, 14)
    : null

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
        selectedRange={{
          startDate: selectedStartDate ?? null,
          endDate: selectedEndDate,
        }}
        handleChange={handleChange}
      />
      <input type="hidden" {...register(startFieldId)} />
      <input type="hidden" {...register(endFieldId)} />
      <input type="hidden" {...register(firstPeriodStartFieldId)} />
      <input type="hidden" {...register(useLengthFieldId)} />
    </Box>
  )
}
