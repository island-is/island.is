import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'

export const TestSubSection = buildSubSection({
  id: 'test',
  title: 'test',
  children: [
    buildMultiField({
      id: 'testMultiField',
      title: 'test',
      description: 'test',
      children: [
        buildDescriptionField({
          id: 'test.title',
          title: 'test',
          titleVariant: 'h5',
        }),
      ],
    }),
  ],
})
