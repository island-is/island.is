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
import { Application, ExternalData, Option } from '@island.is/application/types'
import { Locale } from '@island.is/shared/types'
import { medicalAndRehabilitationPaymentsFormMessage } from '../lib/messages'
import {
  Countries,
  EctsUnits,
  EducationLevels,
  SelfAssessmentQuestionnaire,
  SelfAssessmentQuestionnaireAnswers,
} from '../types'
import {
  EligibleReasonCodes,
  NOT_APPLICABLE,
  NotApplicable,
  SelfAssessmentCurrentEmploymentStatus,
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

  const unionNationalId = getValueViaPath<string>(
    answers,
    'unionSickPay.unionNationalId',
  )

  const certificateForSicknessAndRehabilitationReferenceId =
    getValueViaPath<string>(
      answers,
      'certificateForSicknessAndRehabilitationReferenceId',
    )

  const rehabilitationPlanConfirmation = getValueViaPath<string[]>(
    answers,
    'rehabilitationPlanConfirmation',
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

  const currentEmploymentStatus =
    getValueViaPath<SelfAssessmentCurrentEmploymentStatus[]>(
      answers,
      'selfAssessment.currentEmploymentStatus',
    ) ?? []

  const currentEmploymentStatusAdditional = getValueViaPath<string>(
    answers,
    'selfAssessment.currentEmploymentStatusAdditional',
  )

  const lastEmploymentTitle = getValueViaPath<string>(
    answers,
    'selfAssessment.lastEmploymentTitle',
  )

  const lastEmploymentYear = getValueViaPath<string>(
    answers,
    'selfAssessment.lastEmploymentYear',
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
    unionNationalId,
    certificateForSicknessAndRehabilitationReferenceId,
    rehabilitationPlanConfirmation,
    hadAssistance,
    educationalLevel,
    comment,
    questionnaire,
    mainProblem,
    hasPreviouslyReceivedRehabilitationOrTreatment,
    previousRehabilitationOrTreatment,
    previousRehabilitationSuccessful,
    previousRehabilitationSuccessfulFurtherExplanations,
    currentEmploymentStatus,
    currentEmploymentStatusAdditional,
    lastEmploymentTitle,
    lastEmploymentYear,
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
    getValueViaPath<EctsUnits[]>(
      externalData,
      'socialInsuranceAdministrationEctsUnits.data',
    ) ?? []

  const educationLevels =
    getValueViaPath<EducationLevels[]>(
      externalData,
      'socialInsuranceAdministrationEducationLevels.data',
    ) ?? []

  const marpApplicationType = getValueViaPath<string>(
    externalData,
    'socialInsuranceAdministrationMARPApplicationType.data.applicationType',
  )

  const isEligible = getValueViaPath<Eligible>(
    externalData,
    'socialInsuranceAdministrationIsApplicantEligible.data',
  )

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
    marpApplicationType,
    isEligible,
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

export const getSelfAssessmentCurrentEmploymentStatusOptions = () => {
  const options: Option[] = [
    {
      value: SelfAssessmentCurrentEmploymentStatus.NEVER_HAD_A_PAID_JOB,
      label:
        medicalAndRehabilitationPaymentsFormMessage.selfAssessment.neverOption,
    },
    {
      value: SelfAssessmentCurrentEmploymentStatus.SELF_EMPLOYED,
      label:
        medicalAndRehabilitationPaymentsFormMessage.selfAssessment
          .selfEmployedOption,
    },
    {
      value: SelfAssessmentCurrentEmploymentStatus.FULL_TIME_WORKER,
      label:
        medicalAndRehabilitationPaymentsFormMessage.selfAssessment
          .fullTimeOption,
    },
    {
      value: SelfAssessmentCurrentEmploymentStatus.PART_TIME_WORKER,
      label:
        medicalAndRehabilitationPaymentsFormMessage.selfAssessment
          .partTimeOption,
    },
    {
      value: SelfAssessmentCurrentEmploymentStatus.CURRENTLY_STUDYING,
      label:
        medicalAndRehabilitationPaymentsFormMessage.selfAssessment
          .studyingOption,
    },
    {
      value: SelfAssessmentCurrentEmploymentStatus.JOB_SEARCH_REGISTERED,
      label:
        medicalAndRehabilitationPaymentsFormMessage.selfAssessment
          .jobSearchRegisteredOption,
    },
    {
      value: SelfAssessmentCurrentEmploymentStatus.JOB_SEARCH_NOT_REGISTERED,
      label:
        medicalAndRehabilitationPaymentsFormMessage.selfAssessment
          .jobSearchNotRegisteredOption,
    },
    {
      value: SelfAssessmentCurrentEmploymentStatus.VOLOUNTEER_OR_TEST_WORK,
      label:
        medicalAndRehabilitationPaymentsFormMessage.selfAssessment
          .volunteerOrTestWorkOption,
    },
    {
      value: SelfAssessmentCurrentEmploymentStatus.NO_PARTICIPATION,
      label:
        medicalAndRehabilitationPaymentsFormMessage.selfAssessment
          .noParticipationOption,
    },
    {
      value: SelfAssessmentCurrentEmploymentStatus.OTHER,
      label:
        medicalAndRehabilitationPaymentsFormMessage.selfAssessment.otherOption,
    },
  ]
  return options
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
export const getSelfAssessmentLastEmploymentYearOptions = () => {
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
    case EligibleReasonCodes.APPLICANT_AGE_OUT_OF_RANGE:
      return medicalAndRehabilitationPaymentsFormMessage.notEligible
        .applicantAgeOutOfRangeDescription
    case EligibleReasonCodes.BASE_CERT_NOT_FOUND:
      return medicalAndRehabilitationPaymentsFormMessage.notEligible
        .baseCertNotFoundDescription
    case EligibleReasonCodes.BASE_CERT_DATE_INVALID:
      return medicalAndRehabilitationPaymentsFormMessage.notEligible
        .baseCertDateInvalidDescription
    case EligibleReasonCodes.BASE_CERT_OLDER_THAN_7YEARS:
      return medicalAndRehabilitationPaymentsFormMessage.notEligible
        .baseCertOlderThanSevenYearsDescription
    case EligibleReasonCodes.BASE_CERT_OLDER_THAN_6MONTHS:
      return medicalAndRehabilitationPaymentsFormMessage.notEligible
        .baseCertOlderThanSixMonthsDescription
    default:
      return undefined
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
