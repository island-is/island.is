import {
  buildCustomField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { m } from '../../lib/utils/messages'

export const conclusionSection = buildSection({
  id: 'conclusionSection',
  title: '',
  children: [
    buildMultiField({
      id: 'conclusion',
      title: m.infoReceived,
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
