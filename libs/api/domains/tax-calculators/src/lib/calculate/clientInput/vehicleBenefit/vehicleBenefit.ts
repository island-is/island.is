import type { VehicleBenefitInput } from '@island.is/clients/rsk/calculators'

import type { SubmittedValues } from '../../submission/submission'
import { requireBooleanAt, requireNumberAt } from '../validation'

export const toVehicleBenefitInput = (
  values: SubmittedValues,
): VehicleBenefitInput => ({
  kaupar: requireNumberAt(values, 'kaupar'),
  kaupverd: requireNumberAt(values, 'kaupverd'),
  rafbill: requireBooleanAt(values, 'rafbill'),
  starfsmadurGreidirHledslu: requireBooleanAt(
    values,
    'starfsmadurGreidirHledslu',
  ),
  starfsmadurGreidirRekstrarkostnad: requireBooleanAt(
    values,
    'starfsmadurGreidirRekstrarkostnad',
  ),
})
