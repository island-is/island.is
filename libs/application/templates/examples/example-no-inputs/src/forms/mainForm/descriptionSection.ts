import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { m } from '../../lib/messages'

export const descriptionSection = buildSection({
  id: 'descriptionSubsection',
  title: 'Description',
  children: [
    buildMultiField({
      id: 'descriptionMultiField',
      title: 'BuildDescriptionField',
      children: [
        buildDescriptionField({
          id: 'description1',
          description: m.descriptionFieldDescription,
          marginBottom: [2],
        }),
        buildDescriptionField({
          id: 'description2',
          description: m.descriptionFieldDescription2,
          marginBottom: [2],
        }),

        buildDescriptionField({
          id: 'description3',
          title: 'Default title size ',
          description: 'Description inserted as a regular string',
          marginBottom: [2],
          tooltip: 'Tooltip text',
          titleTooltip: 'Title tooltip text',
        }),
        buildDescriptionField({
          id: 'description4',
          title: 'h1 title size',
          titleVariant: 'h1',
          description: m.regularTextExample,
          marginBottom: [2],
        }),
        buildDescriptionField({
          id: 'description5',
          title: 'h2 title size (same as default)',
          titleVariant: 'h2',
          description: m.markdownHeadingExample,
          marginBottom: [2],
        }),
        buildDescriptionField({
          id: 'description6',
          title: 'h3 title size',
          titleVariant: 'h3',
          description: m.markdownBulletListExample,
          marginBottom: [2],
        }),
        buildDescriptionField({
          id: 'description7',
          title: 'h4 title size',
          titleVariant: 'h4',
          description: m.markdownNumberedListExample,
          marginBottom: [2],
        }),
        buildDescriptionField({
          id: 'description8',
          title: 'h5 title size',
          titleVariant: 'h5',
          description: {
            ...m.markdownMiscExample,
            values: { value1: 'MY VALUE' },
          },
          marginBottom: [2],
        }),
        buildDescriptionField({
          id: 'description9',
          description: m.markdownCodeExample,
          marginBottom: [2],
        }),
      ],
    }),
  ],
})
