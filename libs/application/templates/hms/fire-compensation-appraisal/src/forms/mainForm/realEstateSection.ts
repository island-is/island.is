import {
  buildMultiField,
  buildSection,
  buildSelectField,
  buildCheckboxField,
  getValueViaPath,
} from '@island.is/application/core'
import { Fasteign } from '@island.is/clients/assets'
import { notkunareiningarOptions } from '../../utils/notkunareiningarUtils'
import * as m from '../../lib/messages/realEstateMessages'

export const realEstateSection = buildSection({
  id: 'realEstateSection',
  title: 'Fasteign',
  children: [
    buildMultiField({
      id: 'realEstate',
      title: m.realEstateMessages.title,
      description: m.realEstateMessages.description,
      children: [
        buildSelectField({
          id: 'realEstate',
          title: 'Fasteign',
          options: (application) => {
            const properties = getValueViaPath<Array<Fasteign>>(
              application.externalData,
              'getProperties.data',
            )

            return (
              properties?.map((property) => ({
                label: property?.sjalfgefidStadfang?.birting ?? '',
                value: property.fasteignanumer ?? '',
              })) ?? []
            )
          },
          clearOnChange: ['useageUnit'],
          marginBottom: 4,
        }),
        buildCheckboxField({
          condition: (answers) => {
            const selectedRealEstateId = getValueViaPath<string>(
              answers,
              'realEstate',
            )
            return selectedRealEstateId !== undefined
          },
          id: 'useageUnit',
          title: 'Notkunareining',
          options: notkunareiningarOptions,
        }),
      ],
    }),
  ],
})
