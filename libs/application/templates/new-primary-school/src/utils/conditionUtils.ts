import { YES } from '@island.is/application/core'
import {
  Application,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import {
  ApplicationFeatureKey,
  LanguageEnvironmentOptions,
  OrganizationSubType,
  PayerOption,
} from './constants'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  getOtherGuardian,
  getSelectedSchoolData,
} from './newPrimarySchoolUtils'

export const isCurrentSchoolRegistered = (externalData: ExternalData) => {
  const { primaryOrgId } = getApplicationExternalData(externalData)
  return !!primaryOrgId
}

export const isWelfareContactSelected = (answers: FormValue): boolean => {
  const { hasDiagnoses, hasHadSupport, hasWelfareContact } =
    getApplicationAnswers(answers)

  return (
    (hasDiagnoses === YES || hasHadSupport === YES) && hasWelfareContact === YES
  )
}

export const hasOtherGuardian = (
  answers: FormValue,
  externalData: ExternalData,
): boolean => {
  const otherGuardian = getOtherGuardian(answers, externalData)
  return !!otherGuardian
}

export const hasForeignLanguages = (answers: FormValue) => {
  const { languageEnvironment } = getApplicationAnswers(answers)

  if (!languageEnvironment) {
    return false
  }

  return languageEnvironment !== LanguageEnvironmentOptions.ONLY_ICELANDIC
}

export const showPreferredLanguageFields = (answers: FormValue) => {
  const { languageEnvironment, selectedLanguages } =
    getApplicationAnswers(answers)

  if (!selectedLanguages) {
    return false
  }

  if (
    languageEnvironment ===
      LanguageEnvironmentOptions.ONLY_OTHER_THAN_ICELANDIC &&
    selectedLanguages.length >= 1 &&
    selectedLanguages.filter((language) => language.code).length >= 1
  ) {
    return true
  }

  if (
    languageEnvironment === LanguageEnvironmentOptions.ICELANDIC_AND_OTHER &&
    selectedLanguages.length >= 2 &&
    selectedLanguages.filter((language) => language.code).length >= 2
  ) {
    return true
  }

  return false
}

export const showCaseManagerFields = (answers: FormValue) => {
  const { hasCaseManager } = getApplicationAnswers(answers)

  return isWelfareContactSelected(answers) && hasCaseManager === YES
}

export const shouldShowPage = (
  answers: FormValue,
  externalData: ExternalData,
  key: ApplicationFeatureKey,
): boolean => {
  const { selectedSchoolId } = getApplicationAnswers(answers)

  if (!selectedSchoolId) return false

  const selectedSchoolSettings = getSelectedSchoolData(
    externalData,
    selectedSchoolId,
  )?.settings

  if (!selectedSchoolSettings) return false

  return selectedSchoolSettings.applicationConfigs[0].applicationFeatures.some(
    (feature) => feature.key === key,
  )
}

export const hasOtherPayer = (answers: FormValue) => {
  const { payer } = getApplicationAnswers(answers)

  return payer === PayerOption.OTHER
}

export const needsPayerApproval = (application: Application) => {
  return (
    shouldShowPage(
      application.answers,
      application.externalData,
      ApplicationFeatureKey.PAYMENT_INFO,
    ) && hasOtherPayer(application.answers)
  )
}

export const subTypeWithExpectedEndDate = (
  selectedSubType: OrganizationSubType | ''
) => {
  if (!selectedSubType) return false

  return (
    selectedSubType === OrganizationSubType.INTERNATIONAL_SCHOOL ||
    selectedSubType === OrganizationSubType.SPECIAL_EDUCATION_BEHAVIOR_DEPARTMENT ||
    selectedSubType === OrganizationSubType.SPECIAL_EDUCATION_BEHAVIOR_SCHOOL
  )
}