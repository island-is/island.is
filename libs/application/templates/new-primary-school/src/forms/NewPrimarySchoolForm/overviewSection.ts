import {
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { overviewMessages } from '../../lib/messages'
import { overviewFields } from '../../utils/overviewFields'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: overviewMessages.sectionTitle,
  children: [
    buildMultiField({
      id: 'overview',
      title: overviewMessages.sectionTitle,
      description: overviewMessages.description,
      children: [
        ...overviewFields(true),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          title: overviewMessages.submitButton,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: overviewMessages.submitButton,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
