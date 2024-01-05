import { Answer, Application, YES } from '@island.is/application/types'
import isEmpty from 'lodash/isEmpty'
import {
  AnswerValidationConstants,
  HouseholdSupplementHousing,
} from '../constants'
import { getApplicationAnswers } from '../householdSupplementUtils'
import { buildError } from './utils'
import { errorMessages } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'

export const fileUploadValidationSection = (
  newAnswer: unknown,
  application: Application,
) => {
  const obj = newAnswer as Record<string, Answer>
  const { FILEUPLOAD } = AnswerValidationConstants
  const { householdSupplementHousing, householdSupplementChildren } =
    getApplicationAnswers(application.answers)

  if (householdSupplementChildren === YES && obj.schoolConfirmation) {
    if (
      isEmpty((obj as { schoolConfirmation: unknown[] }).schoolConfirmation)
    ) {
      return buildError(
        errorMessages.requireAttachment,
        `${FILEUPLOAD}.schoolConfirmation`,
      )
    }
  }

  if (
    householdSupplementHousing === HouseholdSupplementHousing.RENTER &&
    obj.leaseAgreement
  ) {
    if (isEmpty((obj as { leaseAgreement: unknown[] }).leaseAgreement)) {
      return buildError(
        errorMessages.requireAttachment,
        `${FILEUPLOAD}.leaseAgreement`,
      )
    }
  }

  return undefined
}
