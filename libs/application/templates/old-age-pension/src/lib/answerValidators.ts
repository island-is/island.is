import {
  AnswerValidator,
  buildValidationError,
} from '@island.is/application/core'
import { Application, Answer, StaticText } from '@island.is/application/types'

import { validatorErrorMessages } from './messages'
import { getStartDateAndEndDate } from './oldAgePensionUtils'
import { MONTHS } from './constants'

const PERIOD = 'period'

export const answerValidators: Record<string, AnswerValidator> = {
  [PERIOD]: (newAnswer: unknown, application: Application) => {
    const obj = newAnswer as Record<string, Answer>
    const buildError = (message: StaticText, path: string) =>
      buildValidationError(`${PERIOD}.${path}`)(message)

    const { startDate, endDate } = getStartDateAndEndDate(application.applicant)
    const { year, month } = obj

    if (!startDate) {
      return buildError(validatorErrorMessages.periodStartDateNeeded, 'year')
    }

    if (!endDate) {
      return buildError(validatorErrorMessages.periodEndDateNeeded, 'year')
    }

    const startDateYear = startDate.getFullYear()
    const endDateYear = endDate.getFullYear()

    if (startDateYear > +year || endDateYear < +year) {
      return buildError(validatorErrorMessages.periodYear, 'year')
    }

    const newStartDate = new Date(startDate.getFullYear(), startDate.getMonth())
    const newEndDate = new Date(endDate.getFullYear(), endDate.getMonth())
    const selectedDate = new Date(
      +year,
      MONTHS.findIndex((e) => e === month),
    )

    if (newStartDate > selectedDate || newEndDate < selectedDate) {
      return buildError(validatorErrorMessages.periodMonth, 'month')
    }

    return undefined
  },
}
