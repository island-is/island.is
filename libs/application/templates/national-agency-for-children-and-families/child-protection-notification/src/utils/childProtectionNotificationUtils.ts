import { NO, YES } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import {
  memmMessages,
  reasonForNotificationMessages,
  sharedMessages,
} from '../lib/messages'
import { DO_NOT_KNOW, NOT_APPLICABLE } from './constants'
import {
  isKnowsNationalId,
  isReasonForNotificationSubCategorySelected,
  isUnborn,
} from './conditionUtils'
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

export const getHasDiscussedWithParentsTitle = (answers: FormValue) =>
  isUnborn(answers)
    ? reasonForNotificationMessages.notificationHistory
        .hasDiscussedWithExpectantParents
    : isKnowsNationalId(answers) // TODO: Need to check if kerfiskennitala! (If kerfiskennitala, then it is a custodian, otherwise a guardian)
    ? reasonForNotificationMessages.notificationHistory
        .hasDiscussedWithCustodians
    : reasonForNotificationMessages.notificationHistory
        .hasDiscussedWithGuardians

export const getAreParentsInformedTitle = (answers: FormValue) =>
  isUnborn(answers)
    ? reasonForNotificationMessages.notificationHistory
        .areExpectantParentsInformed
    : isKnowsNationalId(answers) // TODO: Need to check if kerfiskennitala! (If kerfiskennitala, then it is a custodian, otherwise a guardian)
    ? reasonForNotificationMessages.notificationHistory.areCustodiansInformed
    : reasonForNotificationMessages.notificationHistory.areGuardiansInformed
