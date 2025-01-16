import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { m } from '../../../lib/utils/messages'
import { CAPITALNUMBERS } from '../../../lib/utils/constants'

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
