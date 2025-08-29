import { YES } from '@island.is/application/core'
import { ExternalData, FormValue } from '@island.is/application/types'
import {
  CaseWorkerInputTypeEnum,
  LanguageEnvironmentOptions,
} from './constants'
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

  const hasDiagnosesCalculated =
    (!hasDiagnoses && socialProfile?.hasDiagnoses === true) ||
    hasDiagnoses === YES

  const hasHadSupportCalculated =
    (!hasHadSupport && socialProfile?.hasHadSupport === true) ||
    hasHadSupport === YES

  const hasWelfareContactCalculated =
    (!hasWelfareContact &&
      !!getDefaultSupportCaseworker(
        externalData,
        CaseWorkerInputTypeEnum.SupportManager,
      )) ||
    hasWelfareContact === YES

  return (
    (hasDiagnosesCalculated || hasHadSupportCalculated) &&
    hasWelfareContactCalculated
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

export const showCaseManagerFields = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const { hasCaseManager } = getApplicationAnswers(answers)
  const caseWorker = getDefaultSupportCaseworker(
    externalData,
    CaseWorkerInputTypeEnum.CaseManager,
  )

  return (
    isWelfareContactSelected(answers, externalData) &&
    (hasCaseManager === YES || caseWorker !== undefined)
  )
}
