import {
  buildSection,
  getValueViaPath,
  buildAlertMessageField,
  buildMultiField,
} from '@island.is/application/core'
import * as m from '../../lib/messages'
import { TerminationTypes } from '../../types'

export const boundTerminationWarningSection = buildSection({
  condition: (answers) => {
    const terminationType = getValueViaPath<string>(
      answers,
      'terminationType.answer',
    )
    return terminationType === TerminationTypes.CANCELATION
  },
  id: 'boundTerminationWarningSection',
  title: m.cancelationMessages.warningSectionTitle,
  children: [
    buildMultiField({
      id: 'boundTerminationWarningMultiField',
      title: m.cancelationMessages.title,
      children: [
        buildAlertMessageField({
          id: 'boundTermination.boundTerminationWarning',
          title: m.cancelationMessages.warningTitle,
          message: m.cancelationMessages.warningPlaceholder,
          alertType: 'warning',
          marginTop: 'p1',
        }),
      ],
    }),
  ],
})
