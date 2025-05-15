import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'

export const pickPlateSubSection = buildSubSection({
  id: 'pickPlateSubSection',
  title: information.labels.pickPlate.sectionTitle,
  children: [
    buildMultiField({
      id: 'pickPlateMultiField',
      title: information.labels.pickPlate.title,
      description: information.labels.pickPlate.description,
      children: [
        buildCustomField({
          id: 'pickPlate',
          component: 'PlateField',
          doesNotRequireAnswer: true,
        }),
      ],
    }),
  ],
})
