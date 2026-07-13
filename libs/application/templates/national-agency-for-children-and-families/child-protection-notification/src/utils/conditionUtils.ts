import { NO, YES } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { KnowsNationalId } from './constants'
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
