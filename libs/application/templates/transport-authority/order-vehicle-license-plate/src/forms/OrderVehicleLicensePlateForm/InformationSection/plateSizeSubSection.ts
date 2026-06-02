import {
  buildMultiField,
  buildSubSection,
  buildCustomField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'

export const plateSizeSubSection = buildSubSection({
  id: 'plateSize',
  title: information.labels.plateSize.sectionTitle,
  children: [
    buildMultiField({
      id: 'plateSizeMultiField',
      title: information.labels.plateSize.title,
      description: information.labels.plateSize.description,
      children: [
        buildCustomField({
          id: 'plateSize',
          component: 'PickPlateSize',
        }),
      ],
    }),
  ],
})
