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
  PreviousEmployment,
  SelfAssessmentQuestionnaireAnswers,
} from '../types/interfaces'

export const getApplicationAnswers = (answers: Application['answers']) => {
  const applicantPhonenumber =
    getValueViaPath<string>(answers, 'applicant.phoneNumber') ?? ''

  const applicantEmail =
    getValueViaPath<string>(answers, 'applicant.email') ?? ''

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
    applicantPhonenumber,
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
  const residenceHistory = getValueViaPath(
    externalData,
    'nationalRegistryResidenceHistory.data',
    [],
  ) as NationalRegistryResidenceHistory[]

  const individual = getValueViaPath<NationalRegistryIndividual>(externalData, 'nationalRegistry.data')
  const spouse = getValueViaPath<NationalRegistrySpouse>(externalData, 'nationalRegistrySpouse.data')

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

  const hasSpouse = getValueViaPath(
    externalData,
    'nationalRegistrySpouse.data',
  ) as object

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

  const isEligible = getValueViaPath<Eligible>(
    externalData,
    'socialInsuranceAdministrationIsApplicantEligible.data',
  ) as Eligible

  const categorizedIncomeTypes = getValueViaPath<Array<CategorizedIncomeTypes>>(
    externalData,
    'socialInsuranceAdministrationCategorizedIncomeTypes.data',
  ) as CategorizedIncomeTypes[]

  const incomePlanConditions = getValueViaPath(
    externalData,
    'socialInsuranceAdministrationIncomePlanConditions.data',
  ) as IncomePlanConditions

  const countries =
    (getValueViaPath<CountryValue[]>(
      externalData,
      'socialInsuranceAdministrationCountries.data',
    ) as CountryValue[]) ?? []

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
    hasSpouse,
    bankInfo,
    userProfileEmail,
    userProfilePhoneNumber,
    isEligible,
    countries,
    categorizedIncomeTypes,
    incomePlanConditions,
  }
}
