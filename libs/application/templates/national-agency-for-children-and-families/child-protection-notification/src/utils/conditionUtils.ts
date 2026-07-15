import { NO, YES } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import {
  KnowsNationalId,
  LanguageEnvironmentOptions,
  SCHOOL_TYPES,
  SHOW_LANGUAGE_SECTION_TYPES,
} from './constants'
import { getApplicationAnswers } from './getApplicationAnswers'
import { getSelectedReasonForNotificationCategoryCodes } from './childProtectionNotificationUtils'

export const isKnowsNationalId = (answers: FormValue) =>
  getApplicationAnswers(answers).childKnowsNationalId === KnowsNationalId.YES

export const isUnborn = (answers: FormValue) =>
  getApplicationAnswers(answers).childKnowsNationalId === KnowsNationalId.UNBORN

export const isNoNationalId = (answers: FormValue) =>
  getApplicationAnswers(answers).childKnowsNationalId === KnowsNationalId.NO

export const knowsParentIds = (answers: FormValue) =>
  getApplicationAnswers(answers).parentsKnowsNationalIds === YES

export const doesNotKnowParentIds = (answers: FormValue) =>
  getApplicationAnswers(answers).parentsKnowsNationalIds === NO

export const isSchoolType = (answers: FormValue) =>
  SCHOOL_TYPES.includes(getApplicationAnswers(answers).memmEducationType ?? '')

export const isDayCareProvider = (answers: FormValue) =>
  getApplicationAnswers(answers).memmEducationType === 'daycareProvider'

export const showLanguageSection = (answers: FormValue) =>
  SHOW_LANGUAGE_SECTION_TYPES.includes(
    getApplicationAnswers(answers).memmCultureLanguageUsage ??
      LanguageEnvironmentOptions.ONLY_ICELANDIC,
  )

export const showPreferredLanguage = (answers: FormValue) => {
  if (!showLanguageSection(answers)) return false
  const languages = getApplicationAnswers(answers).memmCultureLanguages
  return (languages?.length ?? 0) > 0
}

export const showWellbeingContactFields = (answers: FormValue) =>
  getApplicationAnswers(answers).memmWellbeingWellbeingContact === YES

export const showWellbeingManagerFields = (answers: FormValue) =>
  getApplicationAnswers(answers).memmWellbeingWellbeingManager === YES

export const showDisabilityService = (answers: FormValue) =>
  getApplicationAnswers(answers).memmWellbeingDisability === YES

export const isReasonForNotificationSubCategorySelected = (
  answers: FormValue,
  categoryCode: string,
  subCategoryCode: string,
) => {
  const { reasonForNotification } = getApplicationAnswers(answers)

  const selectedSubCategories =
    reasonForNotification?.[categoryCode]?.[subCategoryCode]?.subCategory ?? []

  return selectedSubCategories.includes(subCategoryCode)
}

export const shouldShowReasonForNotificationSubCategoryDetails = (
  answers: FormValue,
  categoryCode: string,
  subCategoryCode: string,
  hasSubSubCategories: boolean,
) =>
  hasSubSubCategories &&
  isReasonForNotificationSubCategorySelected(
    answers,
    categoryCode,
    subCategoryCode,
  )

export const shouldShowBiggestConcernField = (answers: FormValue) =>
  !isUnborn(answers) &&
  getSelectedReasonForNotificationCategoryCodes(answers).length > 1
