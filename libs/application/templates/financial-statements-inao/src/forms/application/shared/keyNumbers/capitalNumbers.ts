import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { CAPITALNUMBERS } from '../../../../lib/constants'
import { m } from '../../../../lib/messages'

export const capitalNumberSection = buildSubSection({
  id: 'keynumbers.capitalNumbers',
  title: m.capitalNumbers,
  children: [
    buildMultiField({
      id: 'capitalNumber',
      title: m.capitalNumbersSectionTitle,
      description: m.fillOutAppopriate,
      children: [
        buildCustomField({
          id: 'capitalNumberField',
          description: '',
          component: 'KeyNumbersCapital',
          childInputIds: Object.values(CAPITALNUMBERS),
        }),
      ],
    }),
  ],
})
