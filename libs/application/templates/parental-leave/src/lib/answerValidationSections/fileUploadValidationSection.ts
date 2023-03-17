import { Answer, Application } from '@island.is/application/types'
import {
  ADOPTION,
  AnswerValidationConstants,
  NO,
  PARENTAL_GRANT,
  PARENTAL_GRANT_STUDENTS,
  PERMANENT_FOSTER_CARE,
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
    isReceivingUnemploymentBenefits,
    unemploymentBenefits,
    otherParent,
    additionalDocuments,
    noChildrenFoundTypeOfApplication,
    isResidenceGrant,
    employerLastSixMonths,
    employers,
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

  const isNotStillEmployed = employers?.some(
    (employer) => employer.stillEmployed === NO,
  )

  if (
    (applicationType === PARENTAL_GRANT ||
      applicationType === PARENTAL_GRANT_STUDENTS) &&
    employerLastSixMonths === YES &&
    isNotStillEmployed &&
    obj.employmentTerminationCertificateFile
  ) {
    if (
      isEmpty(
        (obj as { employmentTerminationCertificateFile: unknown[] })
          .employmentTerminationCertificateFile,
      )
    )
      return buildError(
        errorMessages.requiredAttachment,
        'employmentTerminationCertificateFile',
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

  if (isReceivingUnemploymentBenefits) {
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

  if (
    noChildrenFoundTypeOfApplication === PERMANENT_FOSTER_CARE &&
    obj.permanentFosterCare
  ) {
    if (
      isEmpty((obj as { permanentFosterCare: unknown[] }).permanentFosterCare)
    )
      return buildError(
        errorMessages.requiredAttachment,
        'permanentFosterCare',
        FILEUPLOAD,
      )
    return undefined
  }

  if (noChildrenFoundTypeOfApplication === ADOPTION && obj.adoption) {
    if (isEmpty((obj as { adoption: unknown[] }).adoption))
      return buildError(
        errorMessages.requiredAttachment,
        'adoption',
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

  if (isResidenceGrant === YES && obj.residenceGrant) {
    if (isEmpty((obj as { residenceGrant: unknown[] }).residenceGrant))
      return buildError(
        errorMessages.requiredAttachment,
        'residenceGrant',
        FILEUPLOAD,
      )

    return undefined
  }

  return undefined
}
