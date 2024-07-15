import {
  buildCustomField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { overview } from '../../lib/messages'

export const OverviewSection = buildSection({
  id: 'overviewSection',
  title: overview.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'overviewMultifield',
      title: overview.general.title,
      description: overview.general.description,
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
