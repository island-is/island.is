import {
  buildCustomField,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { messages } from '../../lib/messages'

export const overviewSection = buildSection({
  id: 'overview',
  title: messages.overview.sectionTitle,
  children: [
    buildMultiField({
      id: 'overviewMultiField',
      title: messages.overview.title,
      description: messages.overview.intro,
      children: [
        buildCustomField({
          id: 'overview.display',
          title: '',
          component: 'Overview',
        }),
        buildSubmitField({
          id: 'submit',
          title: messages.overview.submitButton,
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: 'SUBMIT',
              name: messages.overview.submitButton,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
