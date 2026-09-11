import type { CalculatorContract, CalculatorField } from '../../contracts/field'
import type { CalculatorOutputField } from '../../contracts/output'

const vehicleDepreciationInputFields = [
  { name: 'price', type: 'number', required: true, semantic: 'currency' },
  { name: 'purchaseMonth', type: 'number', required: true, semantic: 'month' },
  { name: 'purchaseYear', type: 'number', required: true, semantic: 'year' },
  { name: 'arrivalMonth', type: 'number', required: true, semantic: 'month' },
  { name: 'arrivalYear', type: 'number', required: true, semantic: 'year' },
] as const satisfies readonly CalculatorField[]

const vehicleDepreciationOutputFields = [
  { name: 'hasPurchaseInvoice', kind: 'scalar', type: 'boolean' },
  { name: 'price', kind: 'scalar', type: 'number', semantic: 'currency' },
  { name: 'vat', kind: 'scalar', type: 'number', semantic: 'currency' },
  { name: 'markup', kind: 'scalar', type: 'number', semantic: 'currency' },
  { name: 'exciseFee', kind: 'scalar', type: 'number', semantic: 'currency' },
  { name: 'insurance', kind: 'scalar', type: 'number', semantic: 'currency' },
  {
    name: 'transportFee',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'first12MonthsDepreciation',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'next24MonthsDepreciation',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'remainingValue',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'totalDepreciation',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  { name: 'finalAmount', kind: 'scalar', type: 'number', semantic: 'currency' },
] as const satisfies readonly CalculatorOutputField[]

export const vehicleDepreciationCalculator = {
  key: 'vehicleDepreciation',
  inputFields: vehicleDepreciationInputFields,
  outputFields: vehicleDepreciationOutputFields,
} as const satisfies CalculatorContract<'vehicleDepreciation'>

export interface VehicleDepreciationInput {
  price: number
  purchaseMonth: number
  purchaseYear: number
  arrivalMonth: number
  arrivalYear: number
}

export interface VehicleDepreciationOutput {
  hasPurchaseInvoice?: boolean
  price?: number
  vat?: number
  markup?: number
  exciseFee?: number
  insurance?: number
  transportFee?: number
  first12MonthsDepreciation?: number
  next24MonthsDepreciation?: number
  remainingValue?: number
  totalDepreciation?: number
  finalAmount?: number
}
