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
import { medicalAndRehabilitationPaymentsFormMessage } from '../lib/messages'
import {
  SelfAssessmentQuestionnaire,
  SelfAssessmentQuestionnaireAnswers,
} from '../types'
import {
  AttachmentLabel,
  AttachmentTypes,
  NOT_APPLICABLE,
  NotApplicable,
} from './constants'

export const getApplicationAnswers = (answers: Application['answers']) => {
  const applicantPhonenumber =
    getValueViaPath<string>(answers, 'applicantInfo.phonenumber') ?? ''

  const applicantEmail =
    getValueViaPath<string>(answers, 'applicantInfo.email') ?? ''

  const bank = getValueViaPath<BankInfo>(answers, 'paymentInfo.bank')
  const paymentInfo = getValueViaPath<PaymentInfo>(answers, 'paymentInfo')

  const personalAllowance = getValueViaPath<YesOrNo>(
    answers,
    'paymentInfo.personalAllowance',
  )

  const personalAllowanceUsage =
    getValueViaPath<string>(answers, 'paymentInfo.personalAllowanceUsage') ?? ''

  const taxLevel =
    getValueViaPath<TaxLevelOptions>(answers, 'paymentInfo.taxLevel') ??
    TaxLevelOptions.INCOME

  const incomePlan =
    getValueViaPath<IncomePlanRow[]>(answers, 'incomePlanTable') ?? []

  const isSelfEmployed = getValueViaPath<YesOrNo>(
    answers,
    'questions.isSelfEmployed',
  )

  const calculatedRemunerationDate = getValueViaPath<string>(
    answers,
    'questions.calculatedRemunerationDate',
  )

  const isPartTimeEmployed = getValueViaPath<YesOrNo>(
    answers,
    'questions.isPartTimeEmployed',
  )

  const isStudying = getValueViaPath<YesOrNo>(answers, 'questions.isStudying')

  const isStudyingFileUpload = getValueViaPath<FileType[]>(
    answers,
    'questions.isStudyingFileUpload',
  )

  const hasUtilizedEmployeeSickPayRights = getValueViaPath<
    YesOrNo | NotApplicable
  >(answers, 'employeeSickPay.hasUtilizedEmployeeSickPayRights')

  const employeeSickPayEndDate = getValueViaPath<string>(
    answers,
    'employeeSickPay.endDate',
  )

  const hasUtilizedUnionSickPayRights = getValueViaPath<
    YesOrNo | NotApplicable
  >(answers, 'unionSickPay.hasUtilizedUnionSickPayRights')

  const unionSickPayEndDate = getValueViaPath<string>(
    answers,
    'unionSickPay.endDate',
  )

  const unionNationalId = getValueViaPath<string>(
    answers,
    'unionSickPay.unionNationalId',
  )

  const unionSickPayFileUpload = getValueViaPath<FileType[]>(
    answers,
    'unionSickPay.fileupload',
  )

  const rehabilitationPlanConfirmation = getValueViaPath<string[]>(
    answers,
    'rehabilitationPlanConfirmation',
  )

  const hadAssistance = getValueViaPath<YesOrNo>(
    answers,
    'selfAssessment.hadAssistance',
  )

  const highestLevelOfEducation = getValueViaPath<string>(
    answers,
    'selfAssessment.highestLevelOfEducation',
  )

  const comment = getValueViaPath<string>(answers, 'comment')

  const questionnaire =
    getValueViaPath<SelfAssessmentQuestionnaireAnswers[]>(
      answers,
      'selfAssessment.questionnaire',
    ) ?? []

  const mainProblem = getValueViaPath<string>(
    answers,
    'selfAssessment.mainProblem',
  )

  const hasPreviouslyReceivedRehabilitationOrTreatment =
    getValueViaPath<YesOrNo>(
      answers,
      'selfAssessment.hasPreviouslyReceivedRehabilitationOrTreatment',
    )

  const previousRehabilitationOrTreatment = getValueViaPath<string>(
    answers,
    'selfAssessment.previousRehabilitationOrTreatment',
  )

  const previousRehabilitationSuccessful = getValueViaPath<YesOrNo>(
    answers,
    'selfAssessment.previousRehabilitationSuccessful',
  )

  const previousRehabilitationSuccessfulFurtherExplanations =
    getValueViaPath<string>(
      answers,
      'selfAssessment.previousRehabilitationSuccessfulFurtherExplanations',
    )

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
  const applicantName = getValueViaPath<string>(
    externalData,
    'nationalRegistry.data.fullName',
  )

  const applicantNationalId = getValueViaPath<string>(
    externalData,
    'nationalRegistry.data.nationalId',
  )

  const applicantAddress = getValueViaPath<string>(
    externalData,
    'nationalRegistry.data.address.streetAddress',
  )

  const applicantPostalCode = getValueViaPath<string>(
    externalData,
    'nationalRegistry.data.address.postalCode',
  )

  const applicantLocality = getValueViaPath<string>(
    externalData,
    'nationalRegistry.data.address.locality',
  )

  const applicantMunicipality = `${applicantPostalCode}, ${applicantLocality}`

  const bankInfo = getValueViaPath<BankInfo>(
    externalData,
    'socialInsuranceAdministrationApplicant.data.bankAccount',
  )

  const userProfileEmail = getValueViaPath<string>(
    externalData,
    'userProfile.data.email',
  )

  const userProfilePhoneNumber = getValueViaPath<string>(
    externalData,
    'userProfile.data.mobilePhoneNumber',
  )

  const spouseName = getValueViaPath<string>(
    externalData,
    'nationalRegistrySpouse.data.name',
  )

  const spouseNationalId = getValueViaPath<string>(
    externalData,
    'nationalRegistrySpouse.data.nationalId',
  )

  const maritalStatus = getValueViaPath<string>(
    externalData,
    'nationalRegistrySpouse.data.maritalStatus',
  )

  const hasSpouse = getValueViaPath<object>(
    externalData,
    'nationalRegistrySpouse.data',
  )

  const categorizedIncomeTypes =
    getValueViaPath<CategorizedIncomeTypes[]>(
      externalData,
      'socialInsuranceAdministrationCategorizedIncomeTypes.data',
    ) ?? []

  const currencies =
    getValueViaPath<string[]>(
      externalData,
      'socialInsuranceAdministrationCurrencies.data',
    ) ?? []

  const incomePlanConditions = getValueViaPath<IncomePlanConditions>(
    externalData,
    'socialInsuranceAdministrationIncomePlanConditions.data',
  )

  const selfAssessmentQuestionnaire =
    getValueViaPath<SelfAssessmentQuestionnaire[]>(
      externalData,
      'socialInsuranceAdministrationQuestionnairesSelfAssessment.data',
    ) ?? []

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

export const getYesNoNotApplicableTranslation = (value?: string) => {
  if (value === NOT_APPLICABLE) {
    return medicalAndRehabilitationPaymentsFormMessage.shared.notApplicable
  } else if (value === YES) {
    return socialInsuranceAdministrationMessage.shared.yes
  }
  return socialInsuranceAdministrationMessage.shared.no
}

export const getSickPayEndDateLabel = (hasUtilizedSickPayRights?: YesOrNo) => {
  return hasUtilizedSickPayRights === YES
    ? medicalAndRehabilitationPaymentsFormMessage.shared.sickPayDidEndDate
    : medicalAndRehabilitationPaymentsFormMessage.shared.sickPayDoesEndDate
}
