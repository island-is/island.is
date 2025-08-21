import { YES } from '@island.is/application/core'
import { ExternalData, FormValue } from '@island.is/application/types'
import { CaseWorkerInputTypeEnum } from '../types'
import { LanguageEnvironmentOptions } from './constants'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  getDefaultSupportCaseworker,
  getOtherGuardian,
} from './newPrimarySchoolUtils'

export const isCurrentSchoolRegistered = (externalData: ExternalData) => {
  const { primaryOrgId } = getApplicationExternalData(externalData)
  return !!primaryOrgId
}

export const isWelfareContactSelected = (
  answers: FormValue,
  externalData: ExternalData,
): boolean => {
  const { hasDiagnoses, hasHadSupport, hasWelfareContact } =
    getApplicationAnswers(answers)

  const { socialProfile } = getApplicationExternalData(externalData)

  return (
    (hasDiagnoses === YES ||
      hasHadSupport === YES ||
      socialProfile?.hasDiagnoses === true ||
      socialProfile?.hasHadSupport === true) &&
    (hasWelfareContact === YES ||
      !!getDefaultSupportCaseworker(
        externalData,
        CaseWorkerInputTypeEnum.SupportManager,
      ))
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
