import {
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
} from '@island.is/application/core'
import { payment as messages } from '../../lib/messages'

export const paymentSection = buildSection({
  id: 'paymentSection',
  title: messages.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'paymentSection',
      title: messages.general.sectionTitle,
      children: [
        buildDescriptionField({
          id: 'description',
          title: messages.description.title,
          description: messages.description.description,
        }),
        buildRadioField({
          id: 'radio',
          title: messages.radio.title,
          description: messages.radio.description,
          options: [
            // Best practice is to import options from utils/options.ts
            // Making the template more readable and easier to maintain
            {
              label: messages.radio.option1Label,
              value: 'option1',
            },
            {
              label: messages.radio.option2Label,
              value: 'option2',
            },
          ],
        }),
      ],
    }),
  ],
})
