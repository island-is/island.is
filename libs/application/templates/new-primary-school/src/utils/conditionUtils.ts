import { YES } from '@island.is/application/core'
import { ExternalData, FormValue } from '@island.is/application/types'
import {
  LanguageEnvironmentOptions,
  PayerOption,
  SchoolType,
} from './constants'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  getOtherGuardian,
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

export const hasPayer = (answers: FormValue) => {
  const { selectedSchoolType } = getApplicationAnswers(answers)

  // TODO: Need to update when we get config/school type from Júní - Need to check if "Arnarskóli" (Sérskóli)
  return selectedSchoolType === SchoolType.PRIVATE_SCHOOL
}

export const hasOtherPayer = (answers: FormValue) => {
  const { payer } = getApplicationAnswers(answers)

  return payer === PayerOption.OTHER
}

export const needsPayerApproval = (answers: FormValue) => {
  return hasPayer(answers) && hasOtherPayer(answers)
}
