import {
  buildCheckboxField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { Application, SignatureCollectionArea } from '@island.is/api/schema'

export const constituency = buildSection({
  id: 'constituency',
  title: m.constituency,
  children: [
    buildMultiField({
      id: 'constituency',
      title: m.selectConstituency,
      description: m.selectConstituencyDescription,
      children: [
        buildCheckboxField({
          id: 'constituency',
          large: true,
          defaultValue: ({ externalData }: Application) => {
            const collectionAreas = getValueViaPath<SignatureCollectionArea[]>(
              externalData,
              'parliamentaryCollection.data.areas',
            )
            return collectionAreas?.map((area) => `${area.id}|${area.name}`)
          },
          options: ({ externalData }) => {
            const collectionAreas =
              getValueViaPath<SignatureCollectionArea[]>(
                externalData,
                'parliamentaryCollection.data.areas',
              ) || []

            return collectionAreas.map((area) => ({
              value: `${area.id}|${area.name}`,
              label: area.name,
            }))
          },
        }),
      ],
    }),
  ],
})
