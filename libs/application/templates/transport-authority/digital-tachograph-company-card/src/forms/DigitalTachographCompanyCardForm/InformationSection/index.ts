import { buildSection } from '@island.is/application/core'
import { information } from '../../../lib/messages'
import {
  buildDescriptionField,
  buildMultiField,
} from '@island.is/application/core'

export const informationSection = buildSection({
  id: 'informationSection',
  title: information.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'vehicleMultiField',
      title: information.general.pageTitle,
      children: [
        buildDescriptionField({
          id: 'vehicle.title',
          title: 'Hello world!',
          titleVariant: 'h5',
        }),
      ],
    }),
  ],
})
