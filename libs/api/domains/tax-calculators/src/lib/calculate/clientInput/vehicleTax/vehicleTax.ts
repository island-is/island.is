import { VEHICLE_TAX_PERIODS } from '@island.is/clients/rsk/calculators'
import type { VehicleTaxInput } from '@island.is/clients/rsk/calculators'

import type { SubmittedValues } from '../../submission/submission'
import {
  requireNumberAt,
  requireOptionAt,
  requireStringAt,
  stringAt,
} from '../validation'

export const toVehicleTaxInput = (
  values: SubmittedValues,
): VehicleTaxInput => ({
  year: requireNumberAt(values, 'year'),
  licensePlate: requireStringAt(values, 'licensePlate'),
  period: requireOptionAt(values, 'period', VEHICLE_TAX_PERIODS),
  periodSplitDate: stringAt(values, 'periodSplitDate'),
})
