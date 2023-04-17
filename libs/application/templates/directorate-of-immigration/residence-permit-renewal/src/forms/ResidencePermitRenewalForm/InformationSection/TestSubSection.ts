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
      id: 'vehicleMultiField',
      title: information.labels.test.pageTitle,
      description: information.general.description,
      children: [
        buildDescriptionField({
          id: 'vehicle.title',
          title: information.labels.test.title,
          titleVariant: 'h5',
        }),
      ],
    }),
  ],
})
