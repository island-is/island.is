import { getValueViaPath, YES, YesOrNo } from '@island.is/application/core'
import { TaxLevelOptions } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { getYesNoOptions } from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import {
  Attachments,
  BankInfo,
  CategorizedIncomeTypes,
  FileType,
  IncomePlanConditions,
  IncomePlanRow,
  PaymentInfo,
} from '@island.is/application/templates/social-insurance-administration-core/types'
import { Application } from '@island.is/application/types'
import {
  SelfAssessmentQuestionnaireAnswers,
  SelfAssessmentQuestionnaire,
} from '../types'
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

  const applicantEmail = getValueViaPath(
    answers,
    'applicantInfo.email',
  ) as string

  const bank = getValueViaPath(answers, 'paymentInfo.bank') as string
  const paymentInfo = getValueViaPath(answers, 'paymentInfo') as PaymentInfo

  const personalAllowance = getValueViaPath(
    answers,
    'paymentInfo.personalAllowance',
  ) as YesOrNo

  const personalAllowanceUsage = getValueViaPath(
    answers,
    'paymentInfo.personalAllowanceUsage',
  ) as string

  const taxLevel = getValueViaPath(
    answers,
    'paymentInfo.taxLevel',
  ) as TaxLevelOptions

  const incomePlan = getValueViaPath(
    answers,
    'incomePlanTable',
    [],
  ) as IncomePlanRow[]

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

  const hasUtilizedEmployeeSickPayRights = getValueViaPath(
    answers,
    'employeeSickPay.hasUtilizedEmployeeSickPayRights',
  ) as YesOrNo | NotApplicable

  const employeeSickPayEndDate = getValueViaPath(
    answers,
    'employeeSickPay.endDate',
  ) as string

  const hasUtilizedUnionSickPayRights = getValueViaPath(
    answers,
    'unionSickPay.hasUtilizedUnionSickPayRights',
  ) as YesOrNo | NotApplicable

  const unionSickPayEndDate = getValueViaPath(
    answers,
    'unionSickPay.endDate',
  ) as string

  const unionNationalId = getValueViaPath(
    answers,
    'unionSickPay.unionNationalId',
  ) as string

  const unionSickPayFileUpload = getValueViaPath(
    answers,
    'unionSickPay.fileupload',
  ) as FileType[]

  const rehabilitationPlanConfirmation = getValueViaPath(
    answers,
    'rehabilitationPlanConfirmation',
  ) as string[]

  const hadAssistance = getValueViaPath(
    answers,
    'selfAssessment.hadAssistance',
  ) as YesOrNo

  const highestLevelOfEducation = getValueViaPath(
    answers,
    'selfAssessment.highestLevelOfEducation',
  ) as string

  const comment = getValueViaPath(answers, 'comment') as string

  const questionnaire = getValueViaPath(
    answers,
    'selfAssessment.questionnaire',
    [],
  ) as SelfAssessmentQuestionnaireAnswers[]

  const mainProblem = getValueViaPath(
    answers,
    'selfAssessment.mainProblem',
  ) as string

  const hasPreviouslyReceivedRehabilitationOrTreatment = getValueViaPath(
    answers,
    'selfAssessment.hasPreviouslyReceivedRehabilitationOrTreatment',
  ) as YesOrNo

  const previousRehabilitationOrTreatment = getValueViaPath(
    answers,
    'selfAssessment.previousRehabilitationOrTreatment',
  ) as string

  const previousRehabilitationSuccessful = getValueViaPath(
    answers,
    'selfAssessment.previousRehabilitationSuccessful',
  ) as YesOrNo

  const previousRehabilitationSuccessfulFurtherExplanations = getValueViaPath(
    answers,
    'selfAssessment.previousRehabilitationSuccessfulFurtherExplanations',
  ) as string

  return {
    applicantPhonenumber,
    applicantEmail,
    bank,
    paymentInfo,
    personalAllowance,
    personalAllowanceUsage,
    taxLevel,
    incomePlan,
    isSelfEmployed,
    calculatedRemunerationDate,
    isPartTimeEmployed,
    isStudying,
    isStudyingFileUpload,
    hasUtilizedEmployeeSickPayRights,
    employeeSickPayEndDate,
    hasUtilizedUnionSickPayRights,
    unionSickPayEndDate,
    unionNationalId,
    unionSickPayFileUpload,
    rehabilitationPlanConfirmation,
    hadAssistance,
    highestLevelOfEducation,
    comment,
    questionnaire,
    mainProblem,
    hasPreviouslyReceivedRehabilitationOrTreatment,
    previousRehabilitationOrTreatment,
    previousRehabilitationSuccessful,
    previousRehabilitationSuccessfulFurtherExplanations,
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

  const categorizedIncomeTypes = getValueViaPath(
    externalData,
    'socialInsuranceAdministrationCategorizedIncomeTypes.data',
    [],
  ) as CategorizedIncomeTypes[]

  const currencies = getValueViaPath(
    externalData,
    'socialInsuranceAdministrationCurrencies.data',
  ) as Array<string>

  const incomePlanConditions = getValueViaPath(
    externalData,
    'socialInsuranceAdministrationIncomePlanConditions.data',
  ) as IncomePlanConditions

  const selfAssessmentQuestionnaire = getValueViaPath(
    externalData,
    'socialInsuranceAdministrationQuestionnairesSelfAssessment.data',
  ) as SelfAssessmentQuestionnaire[]

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
    categorizedIncomeTypes,
    currencies,
    incomePlanConditions,
    selfAssessmentQuestionnaire,
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
  const {
    isStudying,
    isStudyingFileUpload,
    hasUtilizedUnionSickPayRights,
    unionSickPayFileUpload,
  } = getApplicationAnswers(answers)
  const attachments: Attachments[] = []

  if (isStudying === YES) {
    getAttachmentDetails(
      isStudyingFileUpload,
      AttachmentTypes.STUDY_CONFIRMATION,
    )
  }

  if (hasUtilizedUnionSickPayRights === YES) {
    getAttachmentDetails(
      unionSickPayFileUpload,
      AttachmentTypes.UNION_SICK_PAY_CONFIRMATION,
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

export const getSickPayEndDateLabel = (hasUtilizedSickPayRights: YesOrNo) => {
  return hasUtilizedSickPayRights === YES
    ? medicalAndRehabilitationPaymentsFormMessage.shared.sickPayDidEndDate
    : medicalAndRehabilitationPaymentsFormMessage.shared.sickPayDoesEndDate
}
