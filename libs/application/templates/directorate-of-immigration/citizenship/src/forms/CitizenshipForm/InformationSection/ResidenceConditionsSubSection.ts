import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'

export const ResidenceConditionsSubSection = buildSubSection({
  id: 'residenceConditions',
  title: information.labels.residenceConditions.subSectionTitle,
  children: [
    buildMultiField({
      id: 'residenceConditionsMultiField',
      title: information.labels.residenceConditions.pageTitle,
      description: information.labels.residenceConditions.description,
      children: [
        buildDescriptionField({
          id: 'residenceConditions.title',
          title: information.labels.residenceConditions.title,
          titleVariant: 'h5',
        }),
      ],
    }),
  ],
})
