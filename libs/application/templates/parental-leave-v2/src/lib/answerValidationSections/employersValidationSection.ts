import { NO, YES } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import {
  PARENTAL_GRANT,
  PARENTAL_GRANT_STUDENTS,
  PARENTAL_LEAVE,
} from '../../constants'
import { parentalLeaveFormMessages } from '../messages'
import { getApplicationAnswers } from '../parentalLeaveUtils'
import { buildError } from './utils'

/**
 * The employers table can be left empty in the browser, but an applicant who is
 * asked to list employers has at least one: an employee on parental leave, or a
 * grant applicant who had an employer in the last six months.
 */
export const employersValidationSection = (
  newAnswer: unknown,
  application: Application,
) => {
  if (!Array.isArray(newAnswer) || newAnswer.length > 0) {
    return undefined
  }

  const {
    applicationType,
    isSelfEmployed,
    isReceivingUnemploymentBenefits,
    employerLastSixMonths,
  } = getApplicationAnswers(application.answers)

  const isEmployee =
    applicationType === PARENTAL_LEAVE &&
    isSelfEmployed !== YES &&
    isReceivingUnemploymentBenefits === NO
  const isGrantWithEmployer =
    (applicationType === PARENTAL_GRANT ||
      applicationType === PARENTAL_GRANT_STUDENTS) &&
    employerLastSixMonths === YES

  if (isEmployee || isGrantWithEmployer) {
    return buildError(
      parentalLeaveFormMessages.employer.addEmployerError,
      'employers',
    )
  }

  return undefined
}
