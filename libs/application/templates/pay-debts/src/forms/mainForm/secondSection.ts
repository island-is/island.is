import {
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
} from '@island.is/application/core'

export const secondSection = buildSection({
  id: 'secondSection',
  title: 'Second section',
  children: [
    buildMultiField({
      id: 'secondSection',
      title: 'Second section',
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
            // Best practice is to import options from utils/options.ts
            // Making the template more readable and easier to maintain
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
