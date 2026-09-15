import type { VehicleTaxResult } from '../../../../gen/fetch'
import type { VehicleTaxOutput } from './contract'

export const toVehicleTaxOutput = (
  result: VehicleTaxResult,
): VehicleTaxOutput => ({
  periodLabel: result.timabil ?? undefined,
  feeYear: result.gjaldar ?? undefined,
  vehicleWeight: result.eiginthyngd ?? undefined,
  co2: result.co2 ?? undefined,
  nedc: result.nedc ?? undefined,
  wltp: result.wltp ?? undefined,
  vehicleTax: result.bifreidagjold ?? undefined,
  recyclingFee: result.urvinnslugjald ?? undefined,
  totalVehicleTax: result.bifreidagjoldAlls ?? undefined,
})
