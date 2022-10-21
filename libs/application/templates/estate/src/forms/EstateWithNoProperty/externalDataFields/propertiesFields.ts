import {
  buildCustomField,
  buildDescriptionField,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { Application } from '@island.is/application/types'
import { EstateAsset, EstateRegistrant } from '@island.is/clients/syslumenn'

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
        (
          (externalData.syslumennOnEntry.data as { estate: EstateRegistrant })
            ?.estate.assets ?? []
        ).map((asset: EstateAsset) => ({
          title: asset.description,
          description: [asset.assetNumber],
        })),
    },
  ),
  buildDescriptionField({
    id: 'vehiclesHeader',
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
          (externalData.syslumennOnEntry.data as { estate: EstateRegistrant })
            ?.estate.vehicles ?? []
        ).map((vehicle: EstateAsset) => ({
          title: vehicle.description,
          description: [vehicle.assetNumber],
        })),
    },
  ),
]
