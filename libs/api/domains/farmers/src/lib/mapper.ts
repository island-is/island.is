import { Farm } from '@island.is/clients/farmers'
import { FarmerLand } from './models/farmerLand.model'
import { isDefined } from '@island.is/shared/utils'

export const mapToFarmerLandCollection = (farmlands: Farm[]): FarmerLand[] => {
  return farmlands.map(mapToFarmerLand).filter(isDefined)
}

export const mapToFarmerLand = (farm: Farm): FarmerLand | undefined => {
  if (!farm.farmId || !farm.farmName) {
    return undefined
  }

  return {
    id: farm.farmId,
    name: farm.farmName,
  }
}
