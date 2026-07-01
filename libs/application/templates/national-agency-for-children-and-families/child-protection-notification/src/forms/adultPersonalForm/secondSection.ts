import {
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
} from '@island.is/application/core'
import { sharedMessages } from '../../lib/messages'

export const secondSection = buildSection({
  id: 'secondSection',
  title: 'Second section',
  children: [
    buildMultiField({
      id: 'secondSection',
      title: 'Second section',
      nextButtonText: sharedMessages.nextButton,
      children: [
        buildDescriptionField({
          id: 'description',
          title: 'Description',
          description: 'This is a description, should come from messages.ts',
        }),
        buildRadioField({
          id: 'radio',
          title: 'Radio',
          description:
            'This is a radio desctiption, should come from messages.ts',
          options: [
            {
              label: 'Option 1',
              value: 'option1',
            },
            {
              label: 'Option 2',
              value: 'option2',
            },
          ],
        }),
      ],
    }),
  ],
})
