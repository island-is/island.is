import differenceInDays from 'date-fns/differenceInDays'
import parseISO from 'date-fns/parseISO'
import isValid from 'date-fns/isValid'
import {
  AnswerValidator,
  AnswerValidationError,
} from '@island.is/application/core'
import { getExpectedDateOfBirth } from '../parentalLeaveUtils'

function buildValidationError(
  path: string,
): (message: string) => AnswerValidationError {
  return (message) => ({
    message,
    path,
  })
}

const FIRST_PERIOD_START = 'periods[0].startDate'
const FIRST_PERIOD_END = 'periods[0].endDate'

export const answerValidators: Record<string, AnswerValidator> = {
  [FIRST_PERIOD_START]: (newAnswer: unknown, application) => {
    const buildError = buildValidationError(FIRST_PERIOD_START)
    const expectedDateOfBirth = getExpectedDateOfBirth(application)
    if (!expectedDateOfBirth) {
      return buildError('There is no expected date of birth')
    }
    const firstStartDate = newAnswer as string
    if (typeof newAnswer !== 'string' || !isValid(parseISO(firstStartDate))) {
      return buildError('Answer is not a valid date')
    }

    if (firstStartDate < expectedDateOfBirth) {
      return buildError('Start date cannot be before expected date of birth')
    }
    if (differenceInDays(parseISO(firstStartDate), new Date()) < 14) {
      return buildError(
        'You cannot apply for a period so close into the future',
      )
    }
    return undefined
  },
  [FIRST_PERIOD_END]: (newAnswer: unknown, application) => {
    const buildError = buildValidationError(FIRST_PERIOD_END)
    const expectedDateOfBirth = getExpectedDateOfBirth(application)
    if (!expectedDateOfBirth) {
      return buildError('There is no expected date of birth')
    }
    const firstEndDate = newAnswer as string
    if (typeof newAnswer !== 'string' || !isValid(parseISO(firstEndDate))) {
      return buildError('Answer is not a valid date')
    }

    if (firstEndDate < expectedDateOfBirth) {
      return buildError('Start date cannot be before expected date of birth')
    }
    if (differenceInDays(parseISO(firstEndDate), new Date()) < 14) {
      return buildError(
        'You cannot apply for a period so close into the future',
      )
    }
    const firstStartDate = application.answers.periods[0].startDate
    if (
      differenceInDays(parseISO(firstEndDate), parseISO(firstStartDate)) < 14
    ) {
      return buildError('You cannot apply for a period shorter than 14 days')
    }
    return undefined
  },
  // Maybe it is enough to have a single 'periods' answer validator to handle all answers for periods?
}
