import { getValueViaPath, NO, YES, YesOrNo } from '@island.is/application/core'
import { TaxLevelOptions } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { getYesNoOptions } from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import {
  BankInfo,
  CategorizedIncomeTypes,
  Eligible,
  IncomePlanConditions,
  IncomePlanRow,
  PaymentInfo,
} from '@island.is/application/templates/social-insurance-administration-core/types'
import { Application, ExternalData } from '@island.is/application/types'
import { Locale } from '@island.is/shared/types'
import { medicalAndRehabilitationPaymentsFormMessage } from '../lib/messages'
import {
  Countries,
  CurrentEmploymentStatusLang,
  EducationLevels,
  LabeledValue,
  SelfAssessmentQuestionnaire,
  SelfAssessmentQuestionnaireAnswers,
} from '../types'
import { EligibleReasonCodes, NOT_APPLICABLE, NotApplicable } from './constants'

export const getApplicationAnswers = (answers: Application['answers']) => {
  const applicantPhonenumber =
    getValueViaPath<string>(answers, 'applicantInfo.phonenumber') ?? ''

  const applicantEmail =
    getValueViaPath<string>(answers, 'applicantInfo.email') ?? ''

  const paymentInfo = getValueViaPath<PaymentInfo>(answers, 'paymentInfo.bank')

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

  const isReceivingBenefitsFromAnotherCountry = getValueViaPath<YesOrNo>(
    answers,
    'benefitsFromAnotherCountry.isReceivingBenefitsFromAnotherCountry',
  )

  const countries =
    getValueViaPath<Countries[]>(
      answers,
      'benefitsFromAnotherCountry.countries',
    ) ?? []

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

  const educationalInstitution = getValueViaPath<string>(
    answers,
    'questions.educationalInstitution',
  )

  const ectsUnits = getValueViaPath<string>(answers, 'questions.ectsUnits')

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

  const unionInfo =
    getValueViaPath<string>(answers, 'unionSickPay.unionInfo') ?? ''

  const certificateForSicknessAndRehabilitationReferenceId =
    getValueViaPath<string>(
      answers,
      'certificateForSicknessAndRehabilitation.referenceId',
    )

  const isAlmaCertificate = getValueViaPath<string>(
    answers,
    'certificateForSicknessAndRehabilitation.isAlmaCertificate',
  )

  const rehabilitationPlanConfirmation = getValueViaPath<string[]>(
    answers,
    'rehabilitationPlan.confirmation',
  )

  const rehabilitationPlanReferenceId = getValueViaPath<string>(
    answers,
    'rehabilitationPlan.referenceId',
  )

  const confirmedTreatmentConfirmation = getValueViaPath<string[]>(
    answers,
    'confirmedTreatment.confirmation',
  )

  const confirmedTreatmentReferenceId = getValueViaPath<string>(
    answers,
    'confirmedTreatment.referenceId',
  )

  const confirmationOfPendingResolutionConfirmation = getValueViaPath<string[]>(
    answers,
    'confirmationOfPendingResolution.confirmation',
  )

  const confirmationOfPendingResolutionReferenceId = getValueViaPath<string>(
    answers,
    'confirmationOfPendingResolution.referenceId',
  )

  const confirmationOfIllHealthConfirmation = getValueViaPath<string[]>(
    answers,
    'confirmationOfIllHealth.confirmation',
  )

  const confirmationOfIllHealthReferenceId = getValueViaPath<string>(
    answers,
    'confirmationOfIllHealth.referenceId',
  )

  const hadAssistance = getValueViaPath<YesOrNo>(
    answers,
    'selfAssessment.hadAssistance',
  )

  const educationalLevel = getValueViaPath<string>(
    answers,
    'selfAssessment.educationalLevel',
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

  const currentEmploymentStatuses =
    getValueViaPath<string[]>(
      answers,
      'selfAssessment.currentEmploymentStatuses',
    ) ?? []

  const currentEmploymentStatusExplanation = getValueViaPath<string>(
    answers,
    'selfAssessment.currentEmploymentStatusExplanation',
  )

  const lastProfession = getValueViaPath<string>(
    answers,
    'selfAssessment.lastProfession',
  )

  const lastProfessionDescription = getValueViaPath<string>(
    answers,
    'selfAssessment.lastProfessionDescription',
  )

  const lastActivityOfProfession = getValueViaPath<string>(
    answers,
    'selfAssessment.lastActivityOfProfession',
  )

  const lastActivityOfProfessionDescription = getValueViaPath<string>(
    answers,
    'selfAssessment.lastActivityOfProfessionDescription',
  )

  const lastProfessionYear = getValueViaPath<string>(
    answers,
    'selfAssessment.lastProfessionYear',
  )

  return {
    applicantPhonenumber,
    applicantEmail,
    paymentInfo,
    personalAllowance,
    personalAllowanceUsage,
    taxLevel,
    incomePlan,
    isReceivingBenefitsFromAnotherCountry,
    countries,
    isSelfEmployed,
    calculatedRemunerationDate,
    isPartTimeEmployed,
    isStudying,
    educationalInstitution,
    ectsUnits,
    hasUtilizedEmployeeSickPayRights,
    employeeSickPayEndDate,
    hasUtilizedUnionSickPayRights,
    unionSickPayEndDate,
    unionInfo,
    certificateForSicknessAndRehabilitationReferenceId,
    isAlmaCertificate,
    rehabilitationPlanConfirmation,
    rehabilitationPlanReferenceId,
    confirmedTreatmentConfirmation,
    confirmedTreatmentReferenceId,
    confirmationOfPendingResolutionConfirmation,
    confirmationOfPendingResolutionReferenceId,
    confirmationOfIllHealthConfirmation,
    confirmationOfIllHealthReferenceId,
    hadAssistance,
    educationalLevel,
    comment,
    questionnaire,
    mainProblem,
    hasPreviouslyReceivedRehabilitationOrTreatment,
    previousRehabilitationOrTreatment,
    previousRehabilitationSuccessful,
    previousRehabilitationSuccessfulFurtherExplanations,
    currentEmploymentStatuses,
    currentEmploymentStatusExplanation,
    lastProfession,
    lastProfessionDescription,
    lastActivityOfProfession,
    lastActivityOfProfessionDescription,
    lastProfessionYear,
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
    'socialInsuranceAdministrationResidenceInformation.data.address',
  )

  const applicantPostalCode = getValueViaPath<string>(
    externalData,
    'socialInsuranceAdministrationResidenceInformation.data.postalCode',
  )

  const applicantMunicipality = getValueViaPath<string>(
    externalData,
    'socialInsuranceAdministrationResidenceInformation.data.municipality',
  )

  const apartmentNumber = getValueViaPath<string>(
    externalData,
    'socialInsuranceAdministrationResidenceInformation.data.apartmentNumber',
  )

  const applicantLocation = `${applicantPostalCode}, ${applicantMunicipality}`

  const applicantAddressAndApartment = `${applicantAddress}, ${apartmentNumber}`

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
      'socialInsuranceAdministrationMARPQuestionnairesSelfAssessment.data',
    ) ?? []

  const ectsUnits =
    getValueViaPath<LabeledValue[]>(
      externalData,
      'socialInsuranceAdministrationEctsUnits.data',
    ) ?? []

  const educationLevels =
    getValueViaPath<EducationLevels[]>(
      externalData,
      'socialInsuranceAdministrationEducationLevels.data',
    ) ?? []

  const employmentStatuses =
    getValueViaPath<CurrentEmploymentStatusLang[]>(
      externalData,
      'socialInsuranceAdministrationEmploymentStatuses.data',
    ) ?? []

  const marpApplicationType = getValueViaPath<string>(
    externalData,
    'socialInsuranceAdministrationMARPApplicationType.data.applicationType',
  )

  const marpConfirmationType = getValueViaPath<string>(
    externalData,
    'socialInsuranceAdministrationMARPApplicationType.data.confirmationType',
  )

  const isEligible = getValueViaPath<Eligible>(
    externalData,
    'socialInsuranceAdministrationIsApplicantEligible.data',
  )

  const professions =
    getValueViaPath<LabeledValue[]>(
      externalData,
      'socialInsuranceAdministrationProfessions.data',
    ) ?? []

  const activitiesOfProfessions =
    getValueViaPath<LabeledValue[]>(
      externalData,
      'socialInsuranceAdministrationActivitiesOfProfessions.data',
    ) ?? []

  return {
    applicantName,
    applicantNationalId,
    applicantAddress,
    applicantPostalCode,
    apartmentNumber,
    applicantMunicipality,
    applicantLocation,
    applicantAddressAndApartment,
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
    ectsUnits,
    educationLevels,
    employmentStatuses,
    marpApplicationType,
    marpConfirmationType,
    isEligible,
    professions,
    activitiesOfProfessions,
  }
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

export const hasUtilizedRights = (
  hasUtilizedSickPayRights?: YesOrNo | NotApplicable,
) => {
  return hasUtilizedSickPayRights === YES ? new Date() : undefined
}

export const hasNotUtilizedRights = (
  hasUtilizedSickPayRights?: YesOrNo | NotApplicable,
) => {
  return hasUtilizedSickPayRights === NO ? new Date() : undefined
}

// Returns an array of year options from current year to 30 years in the past
export const getSelfAssessmentLastProfessionYearOptions = () => {
  const currentYear = new Date().getFullYear()

  return Array.from({ length: 31 }, (_, index) => {
    const year = currentYear - index
    return {
      value: year.toString(),
      label: year.toString(),
    }
  })
}

export const isEligible = (externalData: ExternalData): boolean => {
  const { isEligible } = getApplicationExternalData(externalData)

  return !!isEligible && isEligible.isEligible
}

export const eligibleText = (externalData: ExternalData) => {
  const { isEligible } = getApplicationExternalData(externalData)

  switch (isEligible?.reasonCode) {
    case EligibleReasonCodes.APPLICANT_ALREADY_HAS_PENDING_APPLICATION:
      return medicalAndRehabilitationPaymentsFormMessage.notEligible
        .applicantAlreadyHasPendingApplicationDescription
    case EligibleReasonCodes.APPLICANT_AGE_OUT_OF_RANGE:
      return medicalAndRehabilitationPaymentsFormMessage.notEligible
        .applicantAgeOutOfRangeDescription
    case EligibleReasonCodes.NO_LEGAL_DOMICILE_IN_ICELAND:
      return medicalAndRehabilitationPaymentsFormMessage.notEligible
        .noLegalDomicileinIcelandDescription
    case EligibleReasonCodes.HAS_ACTIVE_PAYMENTS:
      return medicalAndRehabilitationPaymentsFormMessage.notEligible
        .hasActivePaymentsDescription
    case EligibleReasonCodes.INACTIVE_PAYMENTS_FOR_TOO_LONG:
      return medicalAndRehabilitationPaymentsFormMessage.notEligible
        .baseCertOlderThanSevenYearsDescription
    case EligibleReasonCodes.BASE_CERT_NOT_FOUND:
      return medicalAndRehabilitationPaymentsFormMessage.notEligible
        .baseCertNotFoundDescription
    case EligibleReasonCodes.BASE_CERT_DATE_INVALID:
      return medicalAndRehabilitationPaymentsFormMessage.notEligible
        .baseCertDateInvalidDescription
    case EligibleReasonCodes.BASE_CERT_OLDER_THAN_7YEARS:
      return medicalAndRehabilitationPaymentsFormMessage.notEligible
        .baseCertOlderThanSevenYearsDescription
    case EligibleReasonCodes.BASE_CERT_DISABILITY_DATE_EMPTY:
      return medicalAndRehabilitationPaymentsFormMessage.notEligible
        .baseCertDisabilityDateEmptyDescription
    case EligibleReasonCodes.LATEST_MEDICAL_DOCUMENT_NOT_FOUND:
      return medicalAndRehabilitationPaymentsFormMessage.notEligible
        .latestMedicalDocumentNotFoundDescription
    case EligibleReasonCodes.ERROR_PROCESSING_CLIENT:
      return medicalAndRehabilitationPaymentsFormMessage.notEligible
        .errorProcessingClientDescription
    case EligibleReasonCodes.UNEXPECTED_ERROR:
      return medicalAndRehabilitationPaymentsFormMessage.notEligible
        .unexpectedErrorDescription
    default:
      return medicalAndRehabilitationPaymentsFormMessage.notEligible
        .unexpectedErrorDescription
  }
}

export const getSelfAssessmentQuestionnaireQuestions = (
  externalData: ExternalData,
  locale: Locale = 'is',
) => {
  const { selfAssessmentQuestionnaire } =
    getApplicationExternalData(externalData)

  return (
    selfAssessmentQuestionnaire.find(
      (questionnaire) => questionnaire.language.toLowerCase() === locale,
    )?.questions ?? []
  )
}

export const getEmploymentStatuses = (
  externalData: ExternalData,
  locale: Locale = 'is',
) => {
  const { employmentStatuses } = getApplicationExternalData(externalData)

  return (
    employmentStatuses.find(
      (status) => status.languageCode.toLowerCase() === locale,
    )?.employmentStatuses ?? []
  )
}
