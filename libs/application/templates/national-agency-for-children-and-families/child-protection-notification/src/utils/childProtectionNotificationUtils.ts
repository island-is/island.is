import { NO, YES } from '@island.is/application/core'
import { ExternalData, FormValue } from '@island.is/application/types'
import {
  memmMessages,
  reasonForNotificationMessages,
  sharedMessages,
} from '../lib/messages'
import {
  isKnowsNationalId,
  isReasonForNotificationSubCategorySelected,
  isSystemNationalId,
  isUnborn,
} from './conditionUtils'
import { DO_NOT_KNOW, NOT_APPLICABLE } from './constants'
import { getApplicationAnswers } from './getApplicationAnswers'

export const getYesNoOptions = () => [
  { value: YES, label: sharedMessages.radioYes },
  { value: NO, label: sharedMessages.radioNo },
]

export const getYesNoDoNotKnowOptions = () => [
  ...getYesNoOptions(),
  { value: DO_NOT_KNOW, label: sharedMessages.radioDoNotKnow },
]

export const getYesNoDoNotKnowNotApplicableOptions = () => [
  ...getYesNoDoNotKnowOptions(),
  { value: NOT_APPLICABLE, label: memmMessages.reception.optionNotApplicable },
]

export const getSelectedReasonForNotificationCategoryCodes = (
  answers: FormValue,
) => {
  const { reasonForNotification } = getApplicationAnswers(answers)

  return Object.entries(reasonForNotification).reduce<string[]>(
    (selectedCategoryCodes, [categoryCode, categoryValue]) => {
      if (
        !categoryValue ||
        typeof categoryValue !== 'object' ||
        Array.isArray(categoryValue)
      ) {
        return selectedCategoryCodes
      }

      // A category is considered selected when at least one of its subCategories is checked.
      const hasCheckedSubCategory = Object.entries(categoryValue).some(
        ([subCategoryCode]) =>
          isReasonForNotificationSubCategorySelected(
            answers,
            categoryCode,
            subCategoryCode,
          ),
      )

      if (hasCheckedSubCategory) {
        selectedCategoryCodes.push(categoryCode)
      }

      return selectedCategoryCodes
    },
    [],
  )
}

export const getHasDiscussedWithParentsTitle = (
  answers: FormValue,
  externalData: ExternalData,
) =>
  isUnborn(answers)
    ? reasonForNotificationMessages.notificationHistory
        .hasDiscussedWithExpectantParents
    : isKnowsNationalId(answers) && isSystemNationalId(externalData)
    ? reasonForNotificationMessages.notificationHistory
        .hasDiscussedWithCustodians
    : reasonForNotificationMessages.notificationHistory
        .hasDiscussedWithGuardians

export const getAreParentsInformedTitle = (
  answers: FormValue,
  externalData: ExternalData,
) =>
  isUnborn(answers)
    ? reasonForNotificationMessages.notificationHistory
        .areExpectantParentsInformed
    : isKnowsNationalId(answers) && isSystemNationalId(externalData)
    ? reasonForNotificationMessages.notificationHistory.areCustodiansInformed
    : reasonForNotificationMessages.notificationHistory.areGuardiansInformed
