import {
  buildCustomField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { school } from '../../../lib/messages'

export const schoolSection = buildSection({
  id: 'schoolSection',
  title: school.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'schoolMultiField',
      title: school.general.pageTitle,
      description: school.general.description,
      children: [
        buildCustomField({
          component: 'SchoolSelection',
          id: 'selection',
          title: '',
          description: '',
        }),
      ],
    }),
  ],
})
