import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'

export const descriptionSection = buildSection({
  id: 'descriptionSection',
  title: 'Description',
  children: [
    buildMultiField({
      id: 'description',
      title: 'The description field',
      children: [
        buildDescriptionField({
          id: 'description',
          title: 'Default title size ',
          description: 'Description inserted as a regular string',
          marginBottom: [2],
          tooltip: 'Tooltip text',
          titleTooltip: 'Title tooltip text',
        }),
        buildDescriptionField({
          id: 'description',
          title: 'h1 title size',
          titleVariant: 'h1',
          description: m.regularTextExample,
          marginBottom: [2],
        }),
        buildDescriptionField({
          id: 'description',
          title: 'h2 title size (same as default)',
          titleVariant: 'h2',
          description: m.markdownHeadingExample,
          marginBottom: [2],
        }),
        buildDescriptionField({
          id: 'description',
          title: 'h3 title size',
          titleVariant: 'h3',
          description: m.markdownBulletListExample,
          marginBottom: [2],
        }),
        buildDescriptionField({
          id: 'description',
          title: 'h4 title size',
          titleVariant: 'h4',
          description: m.markdownNumberedListExample,
          marginBottom: [2],
        }),
        buildDescriptionField({
          id: 'description',
          title: 'h5 title size',
          titleVariant: 'h5',
          description: {
            ...m.markdownMiscExample,
            values: { value1: 'MY VALUE' },
          },
          marginBottom: [2],
        }),
        buildDescriptionField({
          id: 'description',
          title: '',
          description: m.markdownCodeExample,
          marginBottom: [2],
        }),
      ],
    }),
  ],
})
