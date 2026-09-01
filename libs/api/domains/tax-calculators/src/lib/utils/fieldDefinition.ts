import { TaxCalculatorFieldKind } from '../models/enums'

export interface FieldDefinition {
  key: string
  label: string
  kind: TaxCalculatorFieldKind
  required: boolean
  unit?: string
  min?: number
  max?: number
  options?: { value: string; label: string }[]
}

// 32-bit signed int max. A generic overflow guard for NUMBER fields with no
// real business-defined upper bound -- not a business rule itself.
export const MAX_SANE_NUMBER_VALUE = 2_147_483_647
