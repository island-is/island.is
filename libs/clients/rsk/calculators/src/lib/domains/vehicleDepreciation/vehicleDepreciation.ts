import type { GetVehicleDepreciationData } from '../../../../gen/fetch'
import type { VehicleDepreciationInput } from './contract'

export const toVehicleDepreciationQuery = (
  input: VehicleDepreciationInput,
): GetVehicleDepreciationData['query'] => ({
  verd: input.price,
  kaupmanudur: input.purchaseMonth,
  kaupar: input.purchaseYear,
  komumanudur: input.arrivalMonth,
  komuar: input.arrivalYear,
})
