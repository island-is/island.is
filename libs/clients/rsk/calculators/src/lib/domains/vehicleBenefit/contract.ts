import type { CalculatorContract, CalculatorField } from '../../contracts/field'
import type { CalculatorOutputField } from '../../contracts/output'

const vehicleBenefitInputFields = [
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
] as const satisfies readonly CalculatorField[]

const vehicleBenefitOutputFields = [
  { name: 'purchaseYear', kind: 'scalar', type: 'number', semantic: 'year' },
  {
    name: 'purchasePrice',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'annualBenefit',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'monthlyBenefit',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
] as const satisfies readonly CalculatorOutputField[]

export const vehicleBenefitCalculator = {
  key: 'vehicleBenefit',
  inputFields: vehicleBenefitInputFields,
  outputFields: vehicleBenefitOutputFields,
} as const satisfies CalculatorContract<'vehicleBenefit'>

export interface VehicleBenefitInput {
  purchaseYear: number
  purchasePrice: number
  isElectric?: boolean
  employeePaysCharging?: boolean
  employeePaysRunningCosts?: boolean
}

export interface VehicleBenefitOutput {
  purchaseYear?: number
  purchasePrice?: number
  annualBenefit?: number
  monthlyBenefit?: number
}
