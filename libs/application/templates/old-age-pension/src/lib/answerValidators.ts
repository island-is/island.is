import {
  AnswerValidator,
  buildValidationError,
} from '@island.is/application/core'
import { Application, Answer, StaticText } from '@island.is/application/types'

import * as kennitala from 'kennitala'
import isEmpty from 'lodash/isEmpty'

import { validatorErrorMessages } from './messages'
import {
  getAgeBetweenTwoDates,
  getApplicationAnswers,
  getStartDateAndEndDate,
} from './oldAgePensionUtils'
import {
  earlyRetirementMaxAge,
  earlyRetirementMinAge,
  MONTHS,
  YES,
} from './constants'

const PERIOD = 'period'
const FILEUPLOADPERIOD = 'fileUploadPeriod'

const buildError = (message: StaticText, path: string) =>
  buildValidationError(`${path}`)(message)

export const answerValidators: Record<string, AnswerValidator> = {
  [PERIOD]: (newAnswer: unknown, application: Application) => {
    const obj = newAnswer as Record<string, Answer>

    const { startDate, endDate } = getStartDateAndEndDate(application.applicant)
    const { year, month } = obj

    if (!startDate) {
      return buildError(
        validatorErrorMessages.periodStartDateNeeded,
        'period.year',
      )
    }

    if (!endDate) {
      return buildError(
        validatorErrorMessages.periodEndDateNeeded,
        'period.year',
      )
    }

    const startDateYear = startDate.getFullYear()
    const endDateYear = endDate.getFullYear()

    if (startDateYear > +year || endDateYear < +year) {
      return buildError(validatorErrorMessages.periodYear, 'period.year')
    }

    const newStartDate = new Date(startDate.getFullYear(), startDate.getMonth())
    const newEndDate = new Date(endDate.getFullYear(), endDate.getMonth())
    const selectedDate = new Date(
      +year,
      MONTHS.findIndex((e) => e === month),
    )

    if (newStartDate > selectedDate || newEndDate < selectedDate) {
      return buildError(validatorErrorMessages.periodMonth, 'period.month')
    }

    return undefined
  },
  [FILEUPLOADPERIOD]: (newAnswer: unknown, application: Application) => {
    const obj = newAnswer as Record<string, Answer>

    const { selectedMonth, selectedYear, isFishermen } = getApplicationAnswers(
      application.answers,
    )
    const dateOfBirth = kennitala.info(application.applicant).birthday

    const dateOfBirth00 = new Date(
      dateOfBirth.getFullYear(),
      dateOfBirth.getMonth(),
    )
    const selectedDate = new Date(+selectedYear, +selectedMonth)
    const age = getAgeBetweenTwoDates(selectedDate, dateOfBirth00)

    if (obj.pension) {
      if (isEmpty((obj as { pension: unknown[] }).pension)) {
        return buildError(
          validatorErrorMessages.requireAttachment,
          'fileUploadPeriod.pension',
        )
      }
    }

    if (
      age >= earlyRetirementMinAge &&
      age <= earlyRetirementMaxAge &&
      obj.earlyRetirement
    ) {
      if (isEmpty((obj as { earlyRetirement: unknown[] }).earlyRetirement)) {
        return buildError(
          validatorErrorMessages.requireAttachment,
          'fileUploadPeriod.earlyRetirement',
        )
      }
    }

    if (isFishermen === YES && obj.fishermen) {
      if (isEmpty((obj as { fishermen: unknown[] }).fishermen)) {
        return buildError(
          validatorErrorMessages.requireAttachment,
          'fileUploadPeriod.fishermen',
        )
      }
    }

    return undefined
  },
}
