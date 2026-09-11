import type { VehicleDepreciationResult } from '../../../../gen/fetch'
import type { VehicleDepreciationOutput } from './contract'

export const toVehicleDepreciationOutput = (
  result: VehicleDepreciationResult,
): VehicleDepreciationOutput => ({
  hasPurchaseInvoice: result.kaupreikningur ?? undefined,
  price: result.verd ?? undefined,
  vat: result.vsk ?? undefined,
  markup: result.alagning ?? undefined,
  exciseFee: result.vorugjald ?? undefined,
  insurance: result.vatrygging ?? undefined,
  transportFee: result.flutningsgjald ?? undefined,
  first12MonthsDepreciation: result.fyrstu12Manudir ?? undefined,
  next24MonthsDepreciation: result.naestu24Manudir ?? undefined,
  remainingValue: result.rest ?? undefined,
  totalDepreciation: result.totalFyrning ?? undefined,
  finalAmount: result.finalAmount ?? undefined,
})
