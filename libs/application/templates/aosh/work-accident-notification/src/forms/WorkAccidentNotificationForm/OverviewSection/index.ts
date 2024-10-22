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
      id: 'addEmployeeMultiField',
      title: overview.general.moreInjuredTitle,
      description: overview.general.moreInjuredDescription,
      children: [
        buildCustomField({
          id: 'addEmployee',
          title: '',
          component: 'AddEmployee',
        }),
      ],
    }),
    buildMultiField({
      id: 'overview',
      title: overview.general.pageTitle,
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
