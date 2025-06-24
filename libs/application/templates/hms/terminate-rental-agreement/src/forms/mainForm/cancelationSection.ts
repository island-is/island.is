import {
  buildSection,
  buildMultiField,
  getValueViaPath,
  buildDateField,
  buildTextField,
} from '@island.is/application/core'
import * as m from '../../lib/messages'
import { TerminationTypes } from '../../types'

export const cancelationSection = buildSection({
  condition: (answers) => {
    const terminationType = getValueViaPath<string>(
      answers,
      'terminationType.answer',
    )
    return terminationType === TerminationTypes.CANCELATION
  },
  id: 'cancelationSection',
  title: m.cancelationMessages.title,
  children: [
    buildMultiField({
      id: 'cancelationMultiField',
      title: m.cancelationMessages.title,
      children: [
        buildDateField({
          id: 'cancelation.cancelationDate',
          title: m.cancelationMessages.dateTitle,
        }),
        buildTextField({
          id: 'cancelation.cancelationReason',
          title: m.cancelationMessages.reasonTitle,
          placeholder: m.cancelationMessages.reasonPlaceholder,
          variant: 'textarea',
          rows: 8,
        }),
      ],
    }),
  ],
})
