import { Answer } from '@island.is/application/types'

import { validatorErrorMessages } from '../messages'
import { AnswerValidationConstants, YES } from '../constants'
import { buildError } from './utils'

export const paymentInfo = (newAnswer: unknown) => {
  const obj = newAnswer as Record<string, Answer>
  const { PAYMENTINFO } = AnswerValidationConstants

  if (obj.personalAllowance === YES) {
    const personalAllow = (obj as { personalAllowanceUsage: string })
      .personalAllowanceUsage
    if (!personalAllow) {
      return buildError(
        validatorErrorMessages.requireAnswer,
        `${PAYMENTINFO}.personalAllowanceUsage`,
      )
    }

    if (+personalAllow < 1 || +personalAllow > 100) {
      return buildError(
        validatorErrorMessages.personalAllowance,
        `${PAYMENTINFO}.personalAllowanceUsage`,
      )
    }
  }

  if (obj.spouseAllowance === YES) {
    const spouseAllow = (obj as { spouseAllowanceUsage: string })
      .spouseAllowanceUsage
    if (!spouseAllow) {
      return buildError(
        validatorErrorMessages.requireAnswer,
        `${PAYMENTINFO}.spouseAllowanceUsage`,
      )
    }

    if (+spouseAllow < 1 || +spouseAllow > 100) {
      return buildError(
        validatorErrorMessages.personalAllowance,
        `${PAYMENTINFO}.spouseAllowanceUsage`,
      )
    }
  }

  return undefined
}
