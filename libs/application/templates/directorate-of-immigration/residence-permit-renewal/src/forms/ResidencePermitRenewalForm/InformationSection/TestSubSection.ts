import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'

export const TestSubSection = buildSubSection({
  id: 'test',
  title: information.labels.test.sectionTitle,
  children: [
    buildMultiField({
      id: 'testMultiField',
      title: information.labels.test.pageTitle,
      description: information.general.description,
      children: [
        buildDescriptionField({
          id: 'test.title',
          title: information.labels.test.title,
          titleVariant: 'h5',
        }),
      ],
    }),
  ],
})
