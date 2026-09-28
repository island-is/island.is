import type { GetVehicleTaxData } from '../../../../gen/fetch'
import { toValidatedDate } from '../../utils/toValidatedDate'
import type { VehicleTaxInput } from './definition'

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
    ? toValidatedDate(input.periodSplitDate)
    : undefined,
})
