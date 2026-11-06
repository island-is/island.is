import type { VehicleBenefitResult } from '../../../../gen/fetch'
import type { VehicleBenefitOutput } from './definition'

export const toVehicleBenefitOutput = (
  result: VehicleBenefitResult,
): VehicleBenefitOutput => ({
  purchaseYear: result.kaupar ?? undefined,
  purchasePrice: result.kaupverd ?? undefined,
  annualBenefit: result.arshlunnindi ?? undefined,
  monthlyBenefit: result.manadarhlunnindi ?? undefined,
})
