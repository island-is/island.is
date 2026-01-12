import {
  buildMultiField,
  buildSubSection,
  buildCustomField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { Routes } from '../../../lib/constants'

export const CountriesOfResidenceSubSection = buildSubSection({
  id: Routes.COUNTRIESOFRESIDENCE,
  title: information.labels.countriesOfResidence.subSectionTitle,
  children: [
    buildMultiField({
      id: Routes.COUNTRIESOFRESIDENCE,
      title: information.labels.countriesOfResidence.pageTitle,
      children: [
        buildCustomField({
          id: 'countriesOfResidence',
          component: 'ResidenceCountries',
        }),
      ],
    }),
  ],
})
