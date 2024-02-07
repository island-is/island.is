import {
  buildSection,
  buildCustomField,
  buildMultiField,
  buildSubmitField,
} from '@island.is/application/core'
import { review } from '../../lib/messages'
import { DefaultEvents } from '@island.is/application/types'

export const ReviewSection = buildSection({
  id: 'review',
  title: review.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'reviewMultiField',
      title: review.general.pageTitle,
      description: review.general.description,
      space: 1,
      children: [
        buildCustomField({
          id: 'review',
          component: 'Review',
          title: '',
        }),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          title: 'TODO',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: 'TODO',
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
