import { Answer, Application } from '@island.is/application/types'
import {
  AnswerValidationConstants,
  PARENTAL_GRANT_STUDENTS,
  SINGLE,
  States,
  UnEmployedBenefitTypes,
  YES,
} from '../../constants'
import {
  getApplicationAnswers,
  isParentWithoutBirthParent,
} from '../parentalLeaveUtils'
import isEmpty from 'lodash/isEmpty'
import { buildError } from './utils'
import { errorMessages } from '../messages'
const { FILEUPLOAD } = AnswerValidationConstants

export const fileUploadValidationSection = (
  newAnswer: unknown,
  application: Application,
) => {
  const obj = newAnswer as Record<string, Answer>

  const {
    isSelfEmployed,
    applicationType,
    isRecivingUnemploymentBenefits,
    unemploymentBenefits,
    otherParent,
    additionalDocuments,
  } = getApplicationAnswers(application.answers)
  if (isSelfEmployed === YES && obj.selfEmployedFile) {
    if (isEmpty((obj as { selfEmployedFile: unknown[] }).selfEmployedFile))
      return buildError(
        errorMessages.requiredAttachment,
        'selfEmployedFile',
        FILEUPLOAD,
      )

    return undefined
  }

  if (applicationType === PARENTAL_GRANT_STUDENTS && obj.studentFile) {
    if (isEmpty((obj as { studentFile: unknown[] }).studentFile))
      return buildError(
        errorMessages.requiredAttachment,
        'studentFile',
        FILEUPLOAD,
      )
    return undefined
  }

  if (otherParent === SINGLE && obj.singleParent) {
    if (isEmpty((obj as { singleParent: unknown[] }).singleParent))
      return buildError(
        errorMessages.requiredAttachment,
        'singleParent',
        FILEUPLOAD,
      )

    return undefined
  }

  if (isRecivingUnemploymentBenefits) {
    if (
      (unemploymentBenefits === UnEmployedBenefitTypes.union ||
        unemploymentBenefits === UnEmployedBenefitTypes.healthInsurance) &&
      obj.benefitsFile
    ) {
      if (isEmpty((obj as { benefitsFile: unknown[] }).benefitsFile))
        return buildError(
          errorMessages.requiredAttachment,
          'benefitsFile',
          FILEUPLOAD,
        )

      return undefined
    }
  }

  if (
    isParentWithoutBirthParent(application.answers) &&
    obj.parentWithoutBirthParent
  ) {
    if (
      isEmpty(
        (obj as { parentWithoutBirthParent: unknown[] })
          .parentWithoutBirthParent,
      )
    )
      return buildError(
        errorMessages.requiredAttachment,
        'parentWithoutBirthParent',
        FILEUPLOAD,
      )

    return undefined
  }

  if (application.state === States.ADDITIONAL_DOCUMENTS_REQUIRED) {
    if (
      additionalDocuments ||
      isEmpty((obj as { additionalDocuments: unknown[] }).additionalDocuments)
    ) {
      return {
        path: 'additionalDocumentsScreen.fileUpload.additionalDocuments',
        message: errorMessages.requiredAttachment,
      }
    }

    return undefined
  }

  return undefined
}
