import { buildOverviewField, YES } from '@island.is/application/core'
import {
  childMessages,
  guardiansMessages,
  otherInformationMessages,
} from '../lib/messages'
import { getApplicationAnswers } from './getApplicationAnswers'
import {
  childItems,
  guardiansItems,
  otherInformationItems,
} from './overviewItems'

const MAX_GUARDIANS = 2

const buildGuardianOverviewFields = (editable?: boolean) =>
  [...Array(MAX_GUARDIANS)].map((_key, index) =>
    buildOverviewField({
      id: `overview.guardians.${index}`,
      title: guardiansMessages.guardianInfo,
      backId: editable ? 'guardians' : undefined,
      items: (answers, externalData, userNationalId) =>
        guardiansItems(answers, externalData, userNationalId, index),
      condition: (answers) => {
        const { waitingListConsent, guardians } = getApplicationAnswers(answers)
        return waitingListConsent === YES && guardians.length > index
      },
    }),
  )

export const overviewFields = (editable?: boolean) => {
  return [
    buildOverviewField({
      id: 'overview.child',
      title: childMessages.sectionTitle,
      backId: editable ? 'child' : undefined,
      items: childItems,
    }),
    ...buildGuardianOverviewFields(editable),
    buildOverviewField({
      id: 'overview.otherInformation',
      title: otherInformationMessages.sectionTitle,
      backId: editable ? 'otherInformation' : undefined,
      items: otherInformationItems,
      condition: (answers) =>
        getApplicationAnswers(answers).waitingListConsent === YES,
    }),
  ]
}
