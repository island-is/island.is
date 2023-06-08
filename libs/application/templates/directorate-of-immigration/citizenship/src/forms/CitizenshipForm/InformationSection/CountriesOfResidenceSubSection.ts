import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
  buildRadioField,
  buildSelectField,
  buildCustomField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { Answer } from '@island.is/application/types'

export const CountriesOfResidenceSubSection = buildSubSection({
  id: 'countriesOfResidence',
  title: information.labels.countriesOfResidence.subSectionTitle,
  children: [
    buildMultiField({
      id: 'countriesOfResidenceMultiField',
      title: information.labels.countriesOfResidence.pageTitle,
      children: [
        buildCustomField({
          id: 'countriesOfResidence',
          title: '',
          component: 'ResidenceCountries',
        }),
      ],
    }),
  ],
})
