import {
  buildForm,
  buildSection,
  buildCustomField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { externalData, review } from '../../lib/messages'

export const OverviewForm: Form = buildForm({
  id: 'OverviewForm',
  mode: FormModes.IN_PROGRESS,
  children: [
    buildSection({
      id: 'externalData',
      title: externalData.dataProvider.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'reviewSection',
      title: review.general.sectionTitle,
      children: [
        buildCustomField({
          component: 'Overview',
          id: 'overview',
          description: '',
        }),
      ],
    }),
  ],
})
