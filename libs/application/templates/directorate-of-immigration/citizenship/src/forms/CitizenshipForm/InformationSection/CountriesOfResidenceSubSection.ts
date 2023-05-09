import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'

export const CountriesOfResidenceSubSection = buildSubSection({
  id: 'countriesOfResidence',
  title: information.labels.countriesOfResidence.subSectionTitle,
  children: [
    buildMultiField({
      id: 'countriesOfResidenceMultiField',
      title: information.labels.countriesOfResidence.pageTitle,
      description: information.labels.countriesOfResidence.description,
      children: [
        buildDescriptionField({
          id: 'countriesOfResidence.title',
          title: information.labels.countriesOfResidence.title,
          titleVariant: 'h5',
        }),
      ],
    }),
  ],
})
