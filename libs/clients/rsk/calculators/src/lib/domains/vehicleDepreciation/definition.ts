import type { VehicleDepreciationResult } from '../../../../gen/fetch'
import {
  defineCalculator,
  defineInputFields,
  defineOutputFields,
} from '../../types/define'

const vehicleDepreciationInputFields = defineInputFields([
  { name: 'price', type: 'number', required: true, semantic: 'currency' },
  { name: 'purchaseMonth', type: 'number', required: true, semantic: 'month' },
  { name: 'purchaseYear', type: 'number', required: true, semantic: 'year' },
  { name: 'arrivalMonth', type: 'number', required: true, semantic: 'month' },
  { name: 'arrivalYear', type: 'number', required: true, semantic: 'year' },
] as const)

const vehicleDepreciationOutputFields = defineOutputFields([
  { name: 'kaupreikningur', kind: 'scalar', type: 'boolean' },
  { name: 'verd', kind: 'scalar', type: 'number', semantic: 'currency' },
  { name: 'vsk', kind: 'scalar', type: 'number', semantic: 'currency' },
  { name: 'alagning', kind: 'scalar', type: 'number', semantic: 'currency' },
  { name: 'vorugjald', kind: 'scalar', type: 'number', semantic: 'currency' },
  { name: 'vatrygging', kind: 'scalar', type: 'number', semantic: 'currency' },
  {
    name: 'flutningsgjald',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'fyrstu12Manudir',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'naestu24Manudir',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'rest',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'totalFyrning',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  { name: 'finalAmount', kind: 'scalar', type: 'number', semantic: 'currency' },
] as const)

export const vehicleDepreciationCalculator = defineCalculator({
  key: 'vehicleDepreciation',
  inputFields: vehicleDepreciationInputFields,
  outputFields: vehicleDepreciationOutputFields,
} as const)

export interface VehicleDepreciationInput {
  price: number
  purchaseMonth: number
  purchaseYear: number
  arrivalMonth: number
  arrivalYear: number
}

export type VehicleDepreciationOutput = VehicleDepreciationResult
