import {
  buildForm,
  buildSection,
  buildCustomField,
  buildMultiField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { information, externalData, payment, conclusion } from '../lib/messages'

export const ReviewForm: Form = buildForm({
  id: 'ReviewForm',
  title: '',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'reviewSection',
      title: payment.general.sectionTitle,
      children: [
        buildCustomField({
          component: 'Review',
          id: 'review',
          title: '',
          description: '',
        }),
      ],
    }),
    /* buildSection({
      id: 'conclusion',
      title: conclusion.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'conclusion.multifield',
          title: conclusion.general.title,
          children: [
            buildCustomField({
              component: 'Conclusion',
              id: 'Conclusion',
              title: '',
              description: '',
            }),
          ],
        }),
      ],
    }), */
  ],
})
