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
      title: '',
      children: [
        buildDescriptionField({
          id: 'customDescription',
          title: 'Custom Components',
          description: m.customComponentDescription,
          marginBottom: [2],
        }),
        buildDescriptionField({
          id: 'customDescription2',
          title: '',
          description: m.customComponentNumberedList,
          marginBottom: [2],
        }),
        buildCustomField(
          {
            id: 'customComponent',
            title: 'The custom component',
            component: 'TestCustomComponent',
          },
          {
            someData: ['foo', 'bar', 'baz'],
          },
        ),
      ],
    }),
  ],
})
