import {
  defineCalculator,
  defineInputFields,
  defineOutputFields,
} from '../../types/define'

export const VEHICLE_TAX_PERIODS = ['firstHalf', 'secondHalf'] as const
export type VehicleTaxPeriod = typeof VEHICLE_TAX_PERIODS[number]

const vehicleTaxInputFields = defineInputFields([
  { name: 'year', type: 'number', required: true, semantic: 'year' },
  { name: 'licensePlate', type: 'string', required: true },
  {
    name: 'period',
    type: 'select',
    required: true,
    options: VEHICLE_TAX_PERIODS.map((value) => ({ value })),
  },
  { name: 'periodSplitDate', type: 'date', required: false },
] as const)

const vehicleTaxOutputFields = defineOutputFields([
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
] as const)

export const vehicleTaxCalculator = defineCalculator({
  key: 'vehicleTax',
  inputFields: vehicleTaxInputFields,
  outputFields: vehicleTaxOutputFields,
} as const)

export interface VehicleTaxInput {
  year: number
  licensePlate: string
  period: VehicleTaxPeriod
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
