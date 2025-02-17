import {
  buildSection,
  buildMultiField,
  buildDescriptionField,
  buildCustomField,
  buildSubmitField,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'
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
          description: m.overviewDescription,
        }),
        buildCustomField({
          id: 'customComponent',
          component: 'Overview',
        }),
        buildSubmitField({
          id: 'submitApplication',
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.overviewSubmit,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
