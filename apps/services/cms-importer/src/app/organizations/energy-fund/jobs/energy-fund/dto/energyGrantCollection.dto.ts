import { EnergyGrantDto } from './energyGrant.dto'

export interface EnergyGrantCollectionDto {
  grants: Array<EnergyGrantDto>
  totalAmount: number
}
