import type { VehicleBenefitInput } from '@island.is/clients/rsk/calculators'

import type { SubmittedValues } from '../../submission/submission'
import { booleanAt, requireNumberAt } from '../validation'

export const toVehicleBenefitInput = (
  values: SubmittedValues,
): VehicleBenefitInput => ({
  purchaseYear: requireNumberAt(values, 'purchaseYear'),
  purchasePrice: requireNumberAt(values, 'purchasePrice'),
  isElectric: booleanAt(values, 'isElectric'),
  employeePaysCharging: booleanAt(values, 'employeePaysCharging'),
  employeePaysRunningCosts: booleanAt(values, 'employeePaysRunningCosts'),
})
