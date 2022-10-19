import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { CAPITALNUMBERS } from '../../../../lib/constants'
import { m } from '../../../../lib/messages'

export const capitalNumberSection = buildSubSection({
  id: 'capitalNumbers',
  title: m.capitalNumbersSectionTitle,
  children: [
    buildMultiField({
      id: 'capitalNumber',
      title: m.capitalNumbers,
      description: m.fillOutAppopriate,
      children: [
        buildCustomField({
          id: 'capitalNumberField',
          title: '',
          description: '',
          component: 'KeyNumbersCapital',
          childInputIds: Object.values(CAPITALNUMBERS),
        }),
      ],
    }),
  ],
})
