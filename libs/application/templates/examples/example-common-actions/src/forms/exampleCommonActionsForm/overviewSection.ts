import {
  buildSection,
  buildMultiField,
  buildDescriptionField,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'

export const overviewSection = buildSection({
  id: 'overview',
  title: 'Overview',
  children: [
    buildMultiField({
      id: 'overviewMultiField',
      children: [
        buildDescriptionField({
          id: 'overview',
          title: 'Overview',
          description: 'Overview',
        }),
        buildSubmitField({
          id: 'submitApplication',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: 'Submit application',
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
