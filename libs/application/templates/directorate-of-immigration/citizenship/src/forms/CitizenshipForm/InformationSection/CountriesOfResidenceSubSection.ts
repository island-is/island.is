import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
  buildRadioField,
  buildSelectField,
  buildCustomField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'

export const CountriesOfResidenceSubSection = buildSubSection({
  id: 'countriesOfResidence',
  title: information.labels.countriesOfResidence.subSectionTitle,
  children: [
    buildMultiField({
      id: 'countriesOfResidenceMultiField',
      title: information.labels.countriesOfResidence.pageTitle,
      children: [
        buildRadioField({
          id: 'countriesOfResidence.radio',
          title: information.labels.countriesOfResidence.questionTitle,
          description: '',
          width: 'half',
          options: [
            {
              value: 'YES',
              label: 'Já',
            },
            {
              value: 'NO',
              label: 'Nei',
            },
          ],
        }),
        buildCustomField({
          id: 'countriesOfResidence.select',
          title: '',
          component: 'CountrySelect',
        }),
      ],
    }),
  ],
})
