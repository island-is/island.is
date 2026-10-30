import type { GetVehicleTaxData, VehicleTaxResult } from '../../../../gen/fetch'
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
  { name: 'timabil', kind: 'scalar', type: 'string' },
  { name: 'gjaldar', kind: 'scalar', type: 'number', semantic: 'year' },
  { name: 'eiginthyngd', kind: 'scalar', type: 'number' },
  { name: 'co2', kind: 'scalar', type: 'number' },
  { name: 'nedc', kind: 'scalar', type: 'number' },
  { name: 'wltp', kind: 'scalar', type: 'number' },
  {
    name: 'bifreidagjold',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'urvinnslugjald',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'bifreidagjoldAlls',
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

export type VehicleTaxOutput = VehicleTaxResult
