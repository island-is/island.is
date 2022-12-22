import { buildValidationError } from '@island.is/application/core'
import { AnswerValidationConstants, NO, SINGLE } from '../../constants'
import { isValidEmail } from '../isValidEmail'
import { errorMessages } from '../messages'
import { getApplicationAnswers } from '../parentalLeaveUtils'
import { Application } from '@island.is/application/types'
const { OTHER_PARENT_EMAIL } = AnswerValidationConstants

export const otherParentEmailValidationSection = (
  newAnswer: unknown,
  application: Application,
) => {
  const email = newAnswer as string
  const { otherParent } = getApplicationAnswers(application.answers)
  const hasOtherParent = otherParent !== NO && otherParent !== SINGLE
  if (hasOtherParent && !isValidEmail(email)) {
    return buildValidationError(OTHER_PARENT_EMAIL)(errorMessages.email)
  }
}
