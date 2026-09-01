import { CalculatorField } from '../models/field.model'

/* Derived, not restated: a property added to CalculatorField that this
 * shape does not carry becomes a compile error in buildFieldModels rather
 * than a field that silently resolves to null for every calculator. */
export type FieldDefinition = Pick<
  CalculatorField,
  'key' | 'label' | 'kind' | 'required' | 'unit' | 'min' | 'max' | 'options'
>

// 32-bit signed int max. A generic overflow guard for NUMBER fields with no
// real business-defined upper bound -- not a business rule itself.
export const MAX_SANE_NUMBER_VALUE = 2_147_483_647
