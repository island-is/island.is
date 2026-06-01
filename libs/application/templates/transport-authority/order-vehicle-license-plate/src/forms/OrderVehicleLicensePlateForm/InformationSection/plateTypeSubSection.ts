import {
  buildMultiField,
  buildSubSection,
  buildCustomField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'

export const plateTypeSubSection = buildSubSection({
  id: 'plateType',
  title: information.labels.plateType.sectionTitle,
  children: [
    buildMultiField({
      id: 'plateTypeMultiField',
      title: information.labels.plateType.title,
      description: information.general.description,
      children: [
        buildCustomField({
          id: 'plateType',
          component: 'PlateTypeField',
        }),
      ],
    }),
  ],
})
