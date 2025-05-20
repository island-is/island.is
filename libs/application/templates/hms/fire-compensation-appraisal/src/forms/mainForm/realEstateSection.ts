import {
  buildMultiField,
  buildSection,
  buildSelectField,
  getValueViaPath,
} from '@island.is/application/core'
import { Fasteign } from '@island.is/clients/assets'

export const realEstateSection = buildSection({
  id: 'realEstateSection',
  title: 'Fasteign',
  children: [
    buildMultiField({
      condition: (answers, externalData) => {
        console.log(externalData)
        return true
      },
      id: 'realEstate',
      title: 'Fasteign',
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
        }),
      ],
    }),
  ],
})
