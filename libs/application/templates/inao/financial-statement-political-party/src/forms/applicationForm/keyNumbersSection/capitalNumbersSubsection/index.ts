import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { m } from '../../../../lib/messages'
import { CAPITALNUMBERS } from '@island.is/application/templates/inao/shared'

export const capitalNumbersSubsection = buildSubSection({
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
          title: '',
          description: '',
          component: 'KeyNumbersCapital',
          childInputIds: Object.values(CAPITALNUMBERS),
        }),
      ],
    }),
  ],
})
