import {
  buildCustomField,
  buildDescriptionField,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { Application } from '@island.is/application/types'

export const propertiesFields = [
  buildDescriptionField({
    id: 'propertiesHeader',
    title: m.realEstateAndLand,
    titleVariant: 'h3',
    description: m.realEstateAndLandDescription,
  }),
  buildCustomField(
    {
      title: '',
      id: 'estateAssetsCards',
      component: 'Cards',
      doesNotRequireAnswer: true,
    },
    {
      cards: ({ externalData }: Application) =>
        ((externalData.syslumennOnEntry.data as any)?.estate.assets ?? []).map(
          (asset: any) => ({
            title: asset.description,
            description: [asset.assetNumber],
          }),
        ),
    },
  ),
  buildDescriptionField({
    id: 'propertiesHeader',
    title: m.vehicles,
    titleVariant: 'h3',
    description: m.vehiclesDescription,
  }),
  buildCustomField(
    {
      title: '',
      id: 'estateVehicleCards',
      component: 'Cards',
      doesNotRequireAnswer: true,
    },
    {
      cards: ({ externalData }: Application) =>
        (
          (externalData.syslumennOnEntry.data as any)?.estate.vehicles ?? []
        ).map((asset: any) => ({
          title: asset.description,
          description: [asset.assetNumber],
        })),
    },
  ),
]
