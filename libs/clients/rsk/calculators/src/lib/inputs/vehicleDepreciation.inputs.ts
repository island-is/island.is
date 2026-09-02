import type { GetVehicleDepreciationData } from '../../../gen/fetch'

export interface VehicleDepreciationInput {
  price: number
  purchaseMonth: number
  purchaseYear: number
  arrivalMonth: number
  arrivalYear: number
}

export type VehicleDepreciationKey = keyof VehicleDepreciationInput

export const toVehicleDepreciationQuery = (
  input: VehicleDepreciationInput,
): GetVehicleDepreciationData['query'] => ({
  verd: input.price,
  kaupmanudur: input.purchaseMonth,
  kaupar: input.purchaseYear,
  komumanudur: input.arrivalMonth,
  komuar: input.arrivalYear,
})
