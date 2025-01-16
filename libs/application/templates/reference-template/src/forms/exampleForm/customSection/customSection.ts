import {
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'

export const customSection = buildSection({
  id: 'customSection',
  title: 'Custom section',
  children: [
    buildMultiField({
      id: 'customMultiField',
      children: [
        buildDescriptionField({
          id: 'customDescription',
          title: 'Custom Components',
          description: m.customComponentDescription,
          marginBottom: [2],
        }),
        buildDescriptionField({
          id: 'customDescription2',
          description: m.customComponentNumberedList,
          marginBottom: [2],
        }),
        buildCustomField(
          {
            id: 'customComponent',
            title: 'The custom component',
            component: 'ExampleCustomComponent',
          },
          {
            someData: ['foo', 'bar', 'baz'],
          },
        ),
      ],
    }),
  ],
})
