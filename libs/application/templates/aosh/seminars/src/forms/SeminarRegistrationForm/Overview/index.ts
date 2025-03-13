import {
  buildCustomField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { overview } from '../../../lib/messages'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: overview.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'overviewSection.multiField',
      title: overview.general.pageTitle,
      children: [
        buildCustomField({
          id: 'overview',
          title: '',
          component: 'Overview',
        }),
      ],
    }),
  ],
})
