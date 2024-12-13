import {
  buildCustomField,
  buildHiddenInput,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { school } from '../../../lib/messages'
import { Routes } from '../../../shared'

export const schoolSection = buildSection({
  id: 'schoolSection',
  title: school.general.sectionTitle,
  children: [
    buildMultiField({
      id: Routes.SCHOOL,
      title: school.general.pageTitle,
      description: school.general.description,
      children: [
        buildHiddenInput({ id: 'selection.first' }),
        buildHiddenInput({ id: 'selection.second' }),
        buildHiddenInput({ id: 'selection.third' }),
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
