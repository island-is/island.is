import { getValueViaPath, YesOrNo } from '@island.is/application/core'
import { TaxLevelOptions } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import {
  BankInfo,
  CategorizedIncomeTypes,
  Eligible,
  IncomePlanConditions,
  IncomePlanRow,
  PaymentInfo,
} from '@island.is/application/templates/social-insurance-administration-core/types'
import {
  Application,
  NationalRegistryIndividual,
  NationalRegistryResidenceHistory,
  NationalRegistrySpouse,
} from '@island.is/application/types'
import {
  Country,
  CountryValue,
  LivedAbroad,
  SchemaPaymentInfo,
  PreviousEmployment,
  SelfAssessmentQuestionnaireAnswers,
  SelfAssessmentQuestionnaire,
  EducationLevels,
} from '../types/interfaces'
import {
  EmploymentDto,
  MaritalStatusDto,
  ResidenceDto,
} from '@island.is/clients/social-insurance-administration'

export const getApplicationAnswers = (answers: Application['answers']) => {
  const applicantName = getValueViaPath<string>(answers, 'applicant.name') ?? ''

  const applicantCity = getValueViaPath<string>(answers, 'applicant.city') ?? ''

  const applicantNationalId =
    getValueViaPath<string>(answers, 'applicant.nationalId') ?? ''

  const applicantAddress =
    getValueViaPath<string>(answers, 'applicant.address') ?? ''

  const applicantPhonenumber =
    getValueViaPath<string>(answers, 'applicant.phoneNumber') ?? ''

  const applicantEmail =
    getValueViaPath<string>(answers, 'applicant.email') ?? ''

  const { bank, bankAccountType, ...rest } = getValueViaPath<SchemaPaymentInfo>(
    answers,
    'paymentInfo',
  ) ?? { bank: undefined }

  const paymentInfo: PaymentInfo | undefined = bankAccountType
    ? {
        ...rest,
        bankAccountType,
        ...(bank ?? {}),
      }
    : undefined

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
    getValueViaPath<IncomePlanRow[]>(answers, 'incomePlan') ?? []

  const isReceivingBenefitsFromAnotherCountry = getValueViaPath<YesOrNo>(
    answers,
    'abroadPayments.hasAbroadPayments',
  )

  const countries =
    getValueViaPath<Country[]>(answers, 'abroadPayments.list') ?? []

  const hasAppliedForDisabilityBefore = getValueViaPath<YesOrNo>(
    answers,
    'disabilityAppliedBefore',
  )

  const disabilityRenumerationDateMonth = getValueViaPath<string>(
    answers,
    'disabilityPeriod.month',
  )

  const disabilityRenumerationDateYear = getValueViaPath<string>(
    answers,
    'disabilityPeriod.year',
  )

  const hasLivedAbroad = getValueViaPath<YesOrNo>(
    answers,
    'livedAbroad.hasLivedAbroad',
  )
  const livedAbroadList = getValueViaPath<LivedAbroad[]>(
    answers,
    'livedAbroad.list',
  )

  const inPaidWork = getValueViaPath<YesOrNo>(answers, 'paidWork.inPaidWork')
  const willContinueWorking = getValueViaPath<YesOrNo>(
    answers,
    'paidWork.continuedWork',
  )

  const maritalStatus = getValueViaPath<string>(
    answers,
    'backgroundInfoMaritalStatus.status',
  )

  const residence = getValueViaPath<string>(
    answers,
    'backgroundInfoResidence.status',
  )

  const residenceExtraComment = getValueViaPath<string>(
    answers,
    'backgroundInfoResidence.other',
  )

  const children = getValueViaPath<string>(
    answers,
    'backgroundInfoChildren.count',
  )

  const icelandicCapability = getValueViaPath<string>(
    answers,
    'backgroundInfoIcelandicCapability.capability',
  )

  const language = getValueViaPath<string>(
    answers,
    'backgroundInfoLanguage.language',
  )

  const languageOther = getValueViaPath<string>(
    answers,
    'backgroundInfoLanguage.other',
  )

  const employmentStatus = getValueViaPath<Array<string>>(
    answers,
    'backgroundInfoEmployment.status',
  )

  const employmentStatusOther = getValueViaPath<string>(
    answers,
    'backgroundInfoEmployment.other',
  )

  const previousEmployment = getValueViaPath<PreviousEmployment>(
    answers,
    'backgroundInfoPreviousEmployment',
  )

  const employmentCapability = getValueViaPath<string>(
    answers,
    'backgroundInfoEmploymentCapability.capability',
  )

  const employmentImportance = getValueViaPath<string>(
    answers,
    'backgroundInfoEmploymentImportance.importance',
  )

  const hasHadRehabilitationOrTherapy = getValueViaPath<YesOrNo>(
    answers,
    'backgroundInfoRehabilitationOrTherapy.rehabilitationOrTherapy',
  )

  const rehabilitationOrTherapyResults = getValueViaPath<string>(
    answers,
    'backgroundInfoRehabilitationOrTherapy.rehabilitationResults',
  )

  const rehabilitationOrTherapyDescription = getValueViaPath<string>(
    answers,
    'backgroundInfoRehabilitationOrTherapy.rehabilitationDescription',
  )

  const biggestIssue = getValueViaPath<string>(
    answers,
    'backgroundInfoBiggestIssue.text',
  )

  const educationLevel = getValueViaPath<string>(
    answers,
    'backgroundInfoEducationLevel.level',
  )

  const hadAssistanceForSelfEvaluation = getValueViaPath<YesOrNo>(
    answers,
    'selfEvaluationAssistance.assistance',
  )

  const questionnaire =
    getValueViaPath<SelfAssessmentQuestionnaireAnswers[]>(
      answers,
      'capabilityImpairment.questionAnswers',
    ) ?? []

  const extraInfo = getValueViaPath<string>(answers, 'extraInfo')

  return {
    extraInfo,
    applicantName,
    applicantAddress,
    applicantNationalId,
    applicantPhonenumber,
    applicantCity,
    applicantEmail,
    paymentInfo,
    personalAllowance,
    personalAllowanceUsage,
    taxLevel,
    incomePlan,
    isReceivingBenefitsFromAnotherCountry,
    countries,
    hasAppliedForDisabilityBefore,
    disabilityRenumerationDateYear,
    disabilityRenumerationDateMonth,
    hasLivedAbroad,
    livedAbroadList,
    inPaidWork,
    willContinueWorking,
    maritalStatus,
    residence,
    residenceExtraComment,
    children,
    icelandicCapability,
    language,
    languageOther,
    employmentStatus,
    employmentStatusOther,
    previousEmployment,
    employmentCapability,
    employmentImportance,
    hasHadRehabilitationOrTherapy,
    rehabilitationOrTherapyResults,
    rehabilitationOrTherapyDescription,
    biggestIssue,
    educationLevel,
    hadAssistanceForSelfEvaluation,
    questionnaire,
  }
}

export const getApplicationExternalData = (
  externalData: Application['externalData'],
) => {
  const educationLevels = getValueViaPath<Array<EducationLevels>>(
    externalData,
    'socialInsuranceAdministrationEducationLevels.data',
    [],
  )

  const employmentTypes = getValueViaPath<Array<EmploymentDto>>(
    externalData,
    'socialInsuranceAdministrationEmploymentStatuses.data',
    [],
  )

  const residenceTypes = getValueViaPath<Array<ResidenceDto>>(
    externalData,
    'socialInsuranceAdministrationResidence.data',
    [],
  )

  const maritalStatuses = getValueViaPath<Array<MaritalStatusDto>>(
    externalData,
    'socialInsuranceAdministrationMaritalStatuses.data',
    [],
  )

  const residenceHistory = getValueViaPath<NationalRegistryResidenceHistory[]>(
    externalData,
    'nationalRegistryResidenceHistory.data',
    [],
  )

  const individual = getValueViaPath<NationalRegistryIndividual>(
    externalData,
    'nationalRegistry.data',
  )
  const spouse = getValueViaPath<NationalRegistrySpouse>(
    externalData,
    'nationalRegistrySpouse.data',
  )

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
  const applicantMunicipality = [applicantPostalCode, applicantLocality]
    .filter((v) => !!v && v.length > 0)
    .join(', ')

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

  const isEligible = getValueViaPath<Eligible>(
    externalData,
    'socialInsuranceAdministrationIsApplicantEligible.data',
  )

  const categorizedIncomeTypes = getValueViaPath<Array<CategorizedIncomeTypes>>(
    externalData,
    'socialInsuranceAdministrationCategorizedIncomeTypes.data',
  )

  const incomePlanConditions = getValueViaPath<IncomePlanConditions>(
    externalData,
    'socialInsuranceAdministrationIncomePlanConditions.data',
  )

  const countries = getValueViaPath<CountryValue[]>(
    externalData,
    'socialInsuranceAdministrationCountries.data',
    [],
  )

  const questionnaire = getValueViaPath<SelfAssessmentQuestionnaire[]>(
    externalData,
    'socialInsuranceAdministrationDisabilityPensionSelfAssessmentQuestions.data',
    [],
  )

  return {
    residenceHistory,
    applicantName,
    individual,
    spouse,
    applicantNationalId,
    applicantAddress,
    applicantPostalCode,
    applicantLocality,
    applicantMunicipality,
    bankInfo,
    userProfileEmail,
    userProfilePhoneNumber,
    isEligible,
    countries,
    categorizedIncomeTypes,
    incomePlanConditions,
    questionnaire,
    maritalStatuses,
    residenceTypes,
    employmentTypes,
    educationLevels,
  }
}
