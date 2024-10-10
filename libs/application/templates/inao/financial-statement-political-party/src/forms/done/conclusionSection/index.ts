import {
  buildCustomField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'

export const conclusionSection = buildSection({
  id: 'conclusionSection',
  title: '',
  children: [
    buildMultiField({
      id: 'conclusion',
      title: m.received,
      children: [
        buildCustomField({
          id: 'overview',
          component: 'Success',
          title: m.applicationAccept,
        }),
      ],
    }),
  ],
})
