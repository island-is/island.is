import {
  EstateAsset,
  EstateInfo,
  EstateMember,
} from '@island.is/clients/syslumenn'
import { estateSchema } from '@island.is/application/templates/estate'
import { infer as zinfer } from 'zod'
type EstateSchema = zinfer<typeof estateSchema>
type EstateData = EstateSchema['estate']

const initialMapper = <T>(element: T) => {
  return {
    ...element,
    initial: true,
    enabled: true,
  }
}

export const estateTransformer = (estate: EstateInfo): EstateData => {
  const assets = estate.assets.map((el) => initialMapper<EstateAsset>(el))
  const flyers = estate.flyers.map((el) => initialMapper<EstateAsset>(el))
  const estateMembers = estate.estateMembers.map((el) =>
    initialMapper<EstateMember>(el),
  )
  const ships = estate.ships.map((el) => initialMapper<EstateAsset>(el))
  const vehicles = estate.vehicles.map((el) => initialMapper<EstateAsset>(el))

  return {
    ...estate,
    estateMembers,
    assets,
    flyers,
    ships,
    vehicles,
  }
}
