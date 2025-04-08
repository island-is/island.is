import { getValueViaPath, YES, YesOrNo } from '@island.is/application/core'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { getYesNoOptions } from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import {
  Attachments,
  BankInfo,
  FileType,
} from '@island.is/application/templates/social-insurance-administration-core/types'
import { Application } from '@island.is/application/types'
import {
  AttachmentLabel,
  AttachmentTypes,
  NOT_APPLICABLE,
  NotApplicable,
} from './constants'
import { medicalAndRehabilitationPaymentsFormMessage } from './messages'

export const getApplicationAnswers = (answers: Application['answers']) => {
  const applicantPhonenumber = getValueViaPath(
    answers,
    'applicantInfo.phonenumber',
  ) as string

  const isSelfEmployed = getValueViaPath(
    answers,
    'questions.isSelfEmployed',
  ) as YesOrNo

  const calculatedRemunerationDate = getValueViaPath(
    answers,
    'questions.calculatedRemunerationDate',
  ) as string

  const isPartTimeEmployed = getValueViaPath(
    answers,
    'questions.isPartTimeEmployed',
  ) as YesOrNo

  const isStudying = getValueViaPath(answers, 'questions.isStudying') as YesOrNo

  const isStudyingFileUpload = getValueViaPath(
    answers,
    'questions.isStudyingFileUpload',
  ) as FileType[]

  const employeeSickPayOption = getValueViaPath(
    answers,
    'employeeSickPay.option',
  ) as YesOrNo | NotApplicable

  const employeeSickPayDoesEndDate = getValueViaPath(
    answers,
    'employeeSickPay.doesEndDate',
  ) as string

  const employeeSickPayDidEndDate = getValueViaPath(
    answers,
    'employeeSickPay.didEndDate',
  ) as string

  const comment = getValueViaPath(answers, 'comment') as string

  return {
    applicantPhonenumber,
    isSelfEmployed,
    calculatedRemunerationDate,
    isPartTimeEmployed,
    isStudying,
    isStudyingFileUpload,
    employeeSickPayOption,
    employeeSickPayDoesEndDate,
    employeeSickPayDidEndDate,
    comment,
  }
}

export const getApplicationExternalData = (
  externalData: Application['externalData'],
) => {
  const applicantName = getValueViaPath(
    externalData,
    'nationalRegistry.data.fullName',
  ) as string

  const applicantNationalId = getValueViaPath(
    externalData,
    'nationalRegistry.data.nationalId',
  ) as string

  const applicantAddress = getValueViaPath(
    externalData,
    'nationalRegistry.data.address.streetAddress',
  ) as string

  const applicantPostalCode = getValueViaPath(
    externalData,
    'nationalRegistry.data.address.postalCode',
  ) as string

  const applicantLocality = getValueViaPath(
    externalData,
    'nationalRegistry.data.address.locality',
  ) as string

  const applicantMunicipality = applicantPostalCode + ', ' + applicantLocality

  const bankInfo = getValueViaPath(
    externalData,
    'socialInsuranceAdministrationApplicant.data.bankAccount',
  ) as BankInfo

  const userProfileEmail = getValueViaPath(
    externalData,
    'userProfile.data.email',
  ) as string

  const userProfilePhoneNumber = getValueViaPath(
    externalData,
    'userProfile.data.mobilePhoneNumber',
  ) as string

  const spouseName = getValueViaPath(
    externalData,
    'nationalRegistrySpouse.data.name',
  ) as string

  const spouseNationalId = getValueViaPath(
    externalData,
    'nationalRegistrySpouse.data.nationalId',
  ) as string

  const maritalStatus = getValueViaPath(
    externalData,
    'nationalRegistrySpouse.data.maritalStatus',
  ) as string

  const hasSpouse = getValueViaPath(
    externalData,
    'nationalRegistrySpouse.data',
  ) as object

  return {
    applicantName,
    applicantNationalId,
    applicantAddress,
    applicantPostalCode,
    applicantLocality,
    applicantMunicipality,
    bankInfo,
    userProfileEmail,
    userProfilePhoneNumber,
    spouseName,
    spouseNationalId,
    maritalStatus,
    hasSpouse,
  }
}

export const getAttachments = (application: Application) => {
  const getAttachmentDetails = (
    attachmentsArr: FileType[] | undefined,
    attachmentType: AttachmentTypes,
  ) => {
    if (attachmentsArr && attachmentsArr.length > 0) {
      attachments.push({
        attachments: attachmentsArr,
        label: AttachmentLabel[attachmentType],
      })
    }
  }

  const { answers } = application
  const { isStudying, isStudyingFileUpload } = getApplicationAnswers(answers)
  const attachments: Attachments[] = []

  if (isStudying === YES) {
    getAttachmentDetails(
      isStudyingFileUpload,
      AttachmentTypes.STUDY_CONFIRMATION,
    )
  }

  return attachments
}

export const getYesNoNotApplicableOptions = () => {
  return [
    ...getYesNoOptions(),
    {
      value: NOT_APPLICABLE,
      dataTestId: 'sickPay-option-not-applicable',
      label: medicalAndRehabilitationPaymentsFormMessage.shared.notApplicable,
    },
  ]
}

export const getYesNoNotApplicableTranslation = (value: string) => {
  if (value === NOT_APPLICABLE) {
    return medicalAndRehabilitationPaymentsFormMessage.shared.notApplicable
  } else if (value === YES) {
    return socialInsuranceAdministrationMessage.shared.yes
  }
  return socialInsuranceAdministrationMessage.shared.no
}
