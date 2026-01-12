import {
  buildSection,
  getValueViaPath,
  buildAlertMessageField,
  buildMultiField,
} from '@island.is/application/core'
import * as m from '../../lib/messages'
import { TerminationTypes } from '../../types'

export const cancelWarningSection = buildSection({
  condition: (answers) => {
    const terminationType = getValueViaPath<string>(
      answers,
      'terminationType.answer',
    )
    return terminationType === TerminationTypes.CANCELATION
  },
  id: 'cancelationSection',
  title: m.cancelationMessages.warningSectionTitle,
  children: [
    buildMultiField({
      id: 'cancelationWarningMultiField',
      title: m.cancelationMessages.title,
      children: [
        buildAlertMessageField({
          id: 'cancelation.cancelationWarning',
          title: m.cancelationMessages.warningTitle,
          message: m.cancelationMessages.warningPlaceholder,
          alertType: 'warning',
          marginTop: 'p1',
        }),
      ],
    }),
  ],
})
