import { Application, StaticTextObject } from '@island.is/application/types'
import { Period } from '../../types'
import { errorMessages } from '../messages'
import {
  AnswerValidationError,
  buildValidationError,
  getValueViaPath,
} from '@island.is/application/core'
import isArray from 'lodash/isArray'
import {
  calculateDaysUsedByPeriods,
  filterValidPeriods,
  getAvailableRightsInDays,
  getExpectedDateOfBirthOrAdoptionDateOrBirthDate,
} from '../parentalLeaveUtils'
import {
  ValidateField,
  validateFieldInDictionary,
  validatePeriod,
} from './utils'
import { AnswerValidationConstants } from '../../constants'
const { VALIDATE_LATEST_PERIOD } = AnswerValidationConstants

const validatePeriodRepeaterFields = (
  periods: Period[] | undefined,
): AnswerValidationError | undefined => {
  const periodDictionary = periods as unknown as Record<string, Period>
  const validations: ValidateField<Period>[] = [
    {
      fieldName: 'startDate',
      validationFn: (p) => isNaN(Date.parse(p.startDate)),
      message: errorMessages.periodsStartMissing,
    },
    {
      fieldName: 'useLength',
      validationFn: (p) => !p.useLength,
      message: errorMessages.periodsUseLengthMissing,
    },
    {
      fieldName: 'endDate',
      validationFn: (p) => isNaN(Date.parse(p.endDate)),
      message: errorMessages.periodsEndDateRequired,
    },
    {
      fieldName: 'ratio',
      validationFn: (p) => !p.ratio,
      message: errorMessages.periodsRatioMissing,
    },
  ]

  for (const { fieldName, validationFn, message } of validations) {
    const result = validateFieldInDictionary(
      periodDictionary,
      'periods',
      fieldName,
      validationFn,
      message,
    )
    if (result) {
      return result
    }
  }
}

export const validateLatestPeriodValidationSection = (
  newAnswer: unknown,
  application: Application,
) => {
  let periods = newAnswer as Period[] | undefined

  // If added new a period, sometime the old periods in newAnswer are 'null'
  // If that happen, take the periods in application and use them
  const filterPeriods = periods?.filter(
    (period) => !!period?.startDate || !!period?.firstPeriodStart,
  )

  const validationError = validatePeriodRepeaterFields(periods)
  if (validationError) {
    return validationError
  }

  if (filterPeriods?.length !== periods?.length) {
    periods = getValueViaPath(application.answers, 'periods')
    periods = periods?.filter((period) => !!period?.startDate)
  }

  if (!isArray(periods)) {
    return {
      path: 'periods',
      message: errorMessages.periodsNotAList,
    }
  }

  if (periods?.length === 0) {
    // Nothing to validate
    return undefined
  }

  let daysUsedByPeriods, rights
  try {
    daysUsedByPeriods = calculateDaysUsedByPeriods(periods)
    rights = getAvailableRightsInDays(application)
  } catch (e) {
    return {
      path: 'periods',
      message: e,
      values: {},
    }
  }

  if (daysUsedByPeriods > rights) {
    return {
      path: 'periods',
      message: errorMessages.periodsExceedRights,
      values: {
        daysUsedByPeriods,
        rights,
      },
    }
  }

  const latestPeriodIndex = periods.length - 1
  const latestPeriod = periods[latestPeriodIndex]
  const expectedDateOfBirthOrAdoptionDateOrBirthDate =
    getExpectedDateOfBirthOrAdoptionDateOrBirthDate(application)

  if (!expectedDateOfBirthOrAdoptionDateOrBirthDate) {
    return {
      path: 'periods',
      message: errorMessages.dateOfBirth,
    }
  }

  const otherPeriods = periods.slice(0, latestPeriodIndex)
  const validOtherPeriods = filterValidPeriods(otherPeriods)

  const isFirstPeriod = validOtherPeriods.length === 0

  const buildError = buildValidationError(
    VALIDATE_LATEST_PERIOD,
    latestPeriodIndex,
  )

  const buildFieldError = (
    field: string | null,
    message: StaticTextObject,
    values: Record<string, unknown> = {},
  ): AnswerValidationError => {
    if (field !== null) {
      return buildError(message, field, values)
    }

    return {
      path: VALIDATE_LATEST_PERIOD,
      message,
      values,
    }
  }

  // Stop checking periods synced from VMST
  if ('approved' in latestPeriod) {
    return undefined
  }

  const validatedField = validatePeriod(
    latestPeriod,
    isFirstPeriod,
    validOtherPeriods,
    application,
    buildFieldError,
  )

  if (validatedField !== undefined) {
    return validatedField
  }
  return undefined
}
