import { buildOverviewField, YES } from '@island.is/application/core'
import { childMessages, otherInformationMessages } from '../lib/messages'
import { getApplicationAnswers } from './getApplicationAnswers'
import { childItems, otherInformationItems } from './overviewItems'

export const overviewFields = (editable?: boolean) => {
  return [
    buildOverviewField({
      id: 'overview.child',
      title: childMessages.sectionTitle,
      backId: editable ? 'child' : undefined,
      items: childItems,
    }),
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
