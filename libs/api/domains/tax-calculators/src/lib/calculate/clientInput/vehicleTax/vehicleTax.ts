import type { VehicleTaxInput } from '@island.is/clients/rsk/calculators'
import { Gjaldtimabil } from '@island.is/clients/rsk/calculators'

import type { SubmittedValues } from '../../submission/submission'
import {
  dateAt,
  requireNumberAt,
  requireOptionAt,
  requireStringAt,
} from '../validation'

export const toVehicleTaxInput = (
  values: SubmittedValues,
): VehicleTaxInput => ({
  ar: requireNumberAt(values, 'ar'),
  bilnumer: requireStringAt(values, 'bilnumer'),
  gjaldtimabil: requireOptionAt(
    values,
    'gjaldtimabil',
    Object.values(Gjaldtimabil),
  ),
  gjaldskipting: dateAt(values, 'gjaldskipting'),
})
