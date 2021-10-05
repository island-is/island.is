import {
  AnswerValidationError,
  Application,
  StaticTextObject,
} from '@island.is/application/core'
import isWithinInterval from 'date-fns/isWithinInterval'
import parseISO from 'date-fns/parseISO'
import addMonths from 'date-fns/addMonths'
import addDays from 'date-fns/addDays'
import subtractDays from 'date-fns/subDays'
import { StartDateOptions, YES, NO } from '../constants'
import { getExpectedDateOfBirth } from './parentalLeaveUtils'
import {
  minimumPeriodStartBeforeExpectedDateOfBirth,
  minimumRatio,
  minPeriodDays,
  usageMaxMonths,
  usageMinMonths,
} from '../config'
import { errorMessages } from './messages'

import { Period } from '../types'

export const dateIsWithinOtherPeriods = (
  date: Date,
  periods: Period[],
  periodIndex?: number,
) => {
  for (const currentPeriod of periods) {
    if (currentPeriod.rawIndex === periodIndex) {
      continue
    }

    if (!currentPeriod.startDate || !currentPeriod.endDate) {
      return false
    }

    const currentPeriodStart = parseISO(currentPeriod.startDate)
    const currentPeriodEnd = parseISO(currentPeriod.endDate)

    const currentPeriodRange = {
      start: currentPeriodStart,
      end: currentPeriodEnd,
    }

    return isWithinInterval(date, currentPeriodRange)
  }

  return false
}

const validFirstPeriodStartValues = [
  StartDateOptions.ESTIMATED_DATE_OF_BIRTH,
  StartDateOptions.ACTUAL_DATE_OF_BIRTH,
  StartDateOptions.SPECIFIC_DATE,
]

export const validatePeriod = (
  period: Period,
  isFirstPeriod: boolean,
  existingPeriods: Period[],
  application: Application,
  buildError: (
    field: string | null,
    message: StaticTextObject,
    values?: Record<string, unknown>,
  ) => AnswerValidationError,
) => {
  const expectedDateOfBirth = getExpectedDateOfBirth(application)

  if (!expectedDateOfBirth) {
    return buildError(null, errorMessages.dateOfBirth)
  }

  const dob = parseISO(expectedDateOfBirth)
  const minimumStartDate = subtractDays(
    dob,
    minimumPeriodStartBeforeExpectedDateOfBirth,
  )

  const maximumStartDate = addMonths(dob, usageMaxMonths - usageMinMonths)
  const maximumEndDate = addMonths(dob, usageMaxMonths)

  const {
    firstPeriodStart,
    startDate,
    useLength,
    duration,
    percentage,
    endDate,
    days,
    ratio,
  } = period

  if (isFirstPeriod) {
    if (!firstPeriodStart) {
      return buildError(
        'firstPeriodStart',
        errorMessages.periodsFirstPeriodStartDateDefinitionMissing,
      )
    } else if (
      !validFirstPeriodStartValues.includes(
        firstPeriodStart as StartDateOptions,
      )
    ) {
      return buildError(
        'firstPeriodStart',
        errorMessages.periodsFirstPeriodStartDateDefinitionInvalid,
      )
    }
  }

  let startDateValue: Date | undefined
  if (startDate !== undefined) {
    if (isFirstPeriod) {
      startDateValue =
        firstPeriodStart === StartDateOptions.ACTUAL_DATE_OF_BIRTH ||
        firstPeriodStart === StartDateOptions.ESTIMATED_DATE_OF_BIRTH
          ? dob
          : parseISO(startDate)
    } else {
      startDateValue = parseISO(startDate)
    }

    if (startDateValue < minimumStartDate) {
      return buildError('startDate', errorMessages.periodsStartDate)
    }

    if (
      dateIsWithinOtherPeriods(startDateValue, existingPeriods, period.rawIndex)
    ) {
      return buildError('startDate', errorMessages.periodsStartDateOverlaps)
    }

    if (startDateValue > maximumStartDate) {
      return buildError('startDate', errorMessages.periodsPeriodRange, {
        usageMaxMonths: usageMaxMonths - usageMinMonths,
      })
    }
  } else {
    return buildError('startDate', errorMessages.periodsStartMissing)
  }

  if (endDate === '') {
    return buildError('endDate', errorMessages.periodsEndDateRequired)
  }

  if (endDate !== undefined) {
    if (useLength !== YES && useLength !== NO) {
      return buildError(
        'endDate',
        errorMessages.periodsEndDateDefinitionMissing,
      )
    }

    if (useLength === YES && duration === undefined) {
      return buildError(
        'endDate',
        errorMessages.periodsEndDateDefinitionInvalid,
      )
    }

    const endDateValue = parseISO(endDate)

    if (
      dateIsWithinOtherPeriods(endDateValue, existingPeriods, period.rawIndex)
    ) {
      return buildError(
        useLength === YES ? 'endDateDuration' : 'endDate',
        errorMessages.periodsEndDateOverlapsPeriod,
      )
    }

    if (endDateValue > maximumEndDate) {
      return buildError(
        useLength === YES ? 'endDateDuration' : 'endDate',
        errorMessages.periodsPeriodRange,
        {
          usageMaxMonths,
        },
      )
    }

    if (endDateValue < startDateValue) {
      return buildError(
        useLength === YES ? 'endDateDuration' : 'endDate',
        errorMessages.periodsEndDateBeforeStartDate,
      )
    }

    if (endDateValue < addDays(startDateValue, minPeriodDays)) {
      return buildError(
        useLength === YES ? 'endDateDuration' : 'endDate',
        errorMessages.periodsEndDateMinimumPeriod,
      )
    }
  }

  if (ratio !== undefined) {
    const ratioValue = Number(ratio)

    if (days === undefined) {
      return buildError('ratio', errorMessages.periodsRatioDaysMissing)
    }

    if (percentage === undefined) {
      return buildError('ratio', errorMessages.periodsRatioPercentageMissing)
    }

    const dayValue = Number(days)
    const percentageValue = Number(percentage)

    if (dayValue < minPeriodDays) {
      return buildError('days', errorMessages.periodsEndDateMinimumPeriod)
    }

    if (ratioValue > percentageValue) {
      return buildError('ratio', errorMessages.periodsRatioExceedsMaximum)
    }

    if (ratioValue < minimumRatio * 100) {
      return buildError('ratio', errorMessages.periodsRatioBelowMinimum)
    }
  }
}
