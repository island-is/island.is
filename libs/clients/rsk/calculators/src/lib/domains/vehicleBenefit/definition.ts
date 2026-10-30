import type { VehicleBenefitResult } from '../../../../gen/fetch'
import {
  defineCalculator,
  defineInputFields,
  defineOutputFields,
} from '../../types/define'

const vehicleBenefitInputFields = defineInputFields([
  { name: 'purchaseYear', type: 'number', required: true, semantic: 'year' },
  {
    name: 'purchasePrice',
    type: 'number',
    required: true,
    semantic: 'currency',
  },
  { name: 'isElectric', type: 'boolean', required: false },
  { name: 'employeePaysCharging', type: 'boolean', required: false },
  { name: 'employeePaysRunningCosts', type: 'boolean', required: false },
] as const)

const vehicleBenefitOutputFields = defineOutputFields([
  { name: 'kaupar', kind: 'scalar', type: 'number', semantic: 'year' },
  {
    name: 'kaupverd',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'arshlunnindi',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'manadarhlunnindi',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
] as const)

export const vehicleBenefitCalculator = defineCalculator({
  key: 'vehicleBenefit',
  inputFields: vehicleBenefitInputFields,
  outputFields: vehicleBenefitOutputFields,
} as const)

export interface VehicleBenefitInput {
  purchaseYear: number
  purchasePrice: number
  isElectric?: boolean
  employeePaysCharging?: boolean
  employeePaysRunningCosts?: boolean
}

export type VehicleBenefitOutput = VehicleBenefitResult
