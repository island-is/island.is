import type { GetVehicleTaxData } from '../../../../gen/fetch'
import type { VehicleTaxInput } from './contract'

const RSK_VALUE_BY_PERIOD: Record<VehicleTaxInput['period'], boolean> = {
  firstHalf: false,
  secondHalf: true,
}

export const toVehicleTaxQuery = (
  input: VehicleTaxInput,
): GetVehicleTaxData['query'] => ({
  ar: input.year,
  bilnumer: input.licensePlate,
  gjaldtimabil: RSK_VALUE_BY_PERIOD[input.period],
  gjaldskipting: input.periodSplitDate
    ? new Date(input.periodSplitDate)
    : undefined,
})
