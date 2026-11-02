import type { GetVehicleTaxData } from '../../../../gen/fetch'
import { Gjaldtimabil } from '../../../../gen/fetch'
import {
  defineCalculator,
  defineInputFields,
  defineOutputFields,
  enumOptions,
} from '../../types/define'

const vehicleTaxInputFields = defineInputFields([
  { name: 'ar', type: 'number', required: true, semantic: 'year' },
  { name: 'bilnumer', type: 'string', required: true },
  {
    name: 'gjaldtimabil',
    type: 'select',
    required: true,
    options: enumOptions(Gjaldtimabil),
  },
  { name: 'gjaldskipting', type: 'date', required: false },
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

export type VehicleTaxInput = GetVehicleTaxData['query']

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
