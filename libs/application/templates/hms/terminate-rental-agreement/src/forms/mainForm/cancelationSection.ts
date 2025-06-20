import {
  buildSection,
  buildMultiField,
  getValueViaPath,
  buildDateField,
  buildTextField,
} from '@island.is/application/core'
import { TerminationTypes } from '../../utils/constants'
import * as m from '../../lib/messages'

export const cancelationSection = buildSection({
  condition: (answers) => {
    const terminationType = getValueViaPath<string>(answers, 'terminationType')
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
          id: 'cancelationDate',
          title: m.cancelationMessages.dateTitle,
        }),
        buildTextField({
          id: 'cancelationReason',
          title: m.cancelationMessages.reasonTitle,
          placeholder: m.cancelationMessages.reasonPlaceholder,
          variant: 'textarea',
          rows: 8,
        }),
      ],
    }),
  ],
})
