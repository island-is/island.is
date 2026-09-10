import type { CalculatorContract, CalculatorField } from '../../contracts/field'
import type { CalculatorOutputField } from '../../contracts/output'

const vehicleTaxInputFields = [
  { name: 'year', type: 'number', required: true, semantic: 'year' },
  { name: 'licensePlate', type: 'string', required: true },
  {
    name: 'period',
    type: 'select',
    required: true,
    options: [{ value: 'firstHalf' }, { value: 'secondHalf' }],
  },
  { name: 'periodSplitDate', type: 'date', required: false },
] as const satisfies readonly CalculatorField[]

const vehicleTaxOutputFields = [
  { name: 'periodLabel', kind: 'scalar', type: 'string' },
  { name: 'feeYear', kind: 'scalar', type: 'number', semantic: 'year' },
  { name: 'vehicleWeight', kind: 'scalar', type: 'number' },
  { name: 'co2', kind: 'scalar', type: 'number' },
  { name: 'nedc', kind: 'scalar', type: 'number' },
  { name: 'wltp', kind: 'scalar', type: 'number' },
  { name: 'vehicleTax', kind: 'scalar', type: 'number', semantic: 'currency' },
  {
    name: 'recyclingFee',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'totalVehicleTax',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
] as const satisfies readonly CalculatorOutputField[]

export const vehicleTaxCalculator = {
  key: 'vehicleTax',
  inputFields: vehicleTaxInputFields,
  outputFields: vehicleTaxOutputFields,
} as const satisfies CalculatorContract<'vehicleTax'>

export interface VehicleTaxInput {
  year: number
  licensePlate: string
  period: 'firstHalf' | 'secondHalf'
  periodSplitDate?: string
}

export interface VehicleTaxOutput {
  periodLabel?: string
  feeYear?: number
  vehicleWeight?: number
  co2?: number
  nedc?: number
  wltp?: number
  vehicleTax?: number
  recyclingFee?: number
  totalVehicleTax?: number
}
