import {
  buildDateField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSelectField,
  getValueViaPath,
} from '@island.is/application/core'
import { mainForm as m } from '../../lib/messages'
import { Country } from '../../utils/types'

export const countryAndDateSection = buildSection({
  id: 'countryAndDateSection',
  title: m.countryAndDateSection.sectionTitle,
  children: [
    buildMultiField({
      id: 'countryAndDateSectionMulti',
      title: m.countryAndDateSection.sectionTitle,
      children: [
        buildDescriptionField({
          id: 'countryAndDateDescriptionField',
          description: m.countryAndDateSection.description,
        }),
        buildSelectField({
          id: 'countryAndDate.country',
          title: m.countryAndDateSection.countrySelectLabel,
          width: 'half',
          marginTop: 2,
          required: true,
          options: (application) => {
            const countries =
              getValueViaPath<Country[]>(
                application.externalData,
                'countries.data',
              ) ?? []

            return countries
              .filter((c) => c.orderNumber >= 0)
              .map((country) => ({
                label: country.name,
                value: country.id,
              }))
          },
        }),
        buildDateField({
          id: 'countryAndDate.departureDate',
          title: m.countryAndDateSection.departureDateLabel,
          width: 'half',
          marginTop: 2,
          required: true,
        }),
      ],
    }),
  ],
})
