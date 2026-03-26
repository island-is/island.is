import {
  AnswerValidator,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import { m } from './messages'
import { BE } from './constants'

const checkHealthCertificateUploaded = (
  application: Parameters<AnswerValidator>[1],
): ReturnType<AnswerValidator> => {
  // File uploads save to application.answers immediately via the
  // attachment API, so this reflects the current uploaded state
  const files = getValueViaPath<Array<{ name: string; key: string }>>(
    application.answers,
    'healthCertificate',
  )

  if (!files || files.length === 0) {
    return {
      message: m.healthCertificateRequired,
      path: 'healthCertificate',
    }
  }

  return undefined
}

export const answerValidators: Record<string, AnswerValidator> = {
  // Fires when health declaration answers are submitted.
  // Catches the case where a health question is answered "yes".
  healthDeclaration: (newAnswer, application) => {
    const applicationFor = getValueViaPath<string>(
      application.answers,
      'applicationFor',
    )
    if (applicationFor !== BE) return undefined

    const healthDeclaration = (newAnswer as Record<string, string>) ?? {}
    const anyHealthQuestionYes = Object.values(healthDeclaration).includes(YES)

    if (!anyHealthQuestionYes) return undefined

    return checkHealthCertificateUploaded(application)
  },

  // Fires when hasHealthRemarks is submitted (via hidden input).
  // Catches the case where the applicant has health remarks from
  // external data — even on the first visit to the step, since
  // newAnswer carries the current value rather than reading from
  // the not-yet-saved application.answers.
  hasHealthRemarks: (newAnswer, application) => {
    const applicationFor = getValueViaPath<string>(
      application.answers,
      'applicationFor',
    )
    if (applicationFor !== BE) return undefined

    if (newAnswer !== YES) return undefined

    return checkHealthCertificateUploaded(application)
  },
}
