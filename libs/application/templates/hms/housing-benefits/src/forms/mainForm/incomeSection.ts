import {
  buildMultiField,
  buildRadioField,
  buildSection,
} from '@island.is/application/core'
import * as m from '../../lib/messages'

export const incomeSection = buildSection({
  id: 'incomeSection',
  title: m.draftMessages.incomeSection.title,
  children: [
    buildMultiField({
      id: 'incomeMultiField',
      title: m.draftMessages.incomeSection.multiFieldTitle,
      children: [
        buildRadioField({
          id: 'incomeRadio',
          title: m.draftMessages.incomeSection.radioTitle,
          options: [{ value: 'yes', label: m.miscMessages.yes }],
        }),
      ],
    }),
  ],
})
