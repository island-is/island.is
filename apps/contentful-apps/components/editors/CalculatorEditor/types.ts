import type {
  CalculatorFieldSection,
  CalculatorLocalizedText,
  CalculatorSectionField,
} from '@island.is/tax-calculators'

import type { GetTaxCalculatorFieldsForContentfulAppQuery } from '../../../graphql/schema'

/* Read off the generated query type rather than the schema's `TaxCalculatorField`
 * directly, so this follows the query's own selection set -- adding a field to
 * the query widens this automatically, and removing one narrows it. */
export type ContractField = NonNullable<
  GetTaxCalculatorFieldsForContentfulAppQuery['taxCalculatorFields']
>[number]

/* The calculator's input contract, keyed by field key. A map rather than the
 * array the query returns, because every row needs to look up the one field
 * its `key` points at -- and needs to know when that lookup misses, which is
 * how a key the backend no longer returns gets flagged instead of silently
 * looking like an unselected row. */
export type FieldContract = Map<string, ContractField>

export interface SectionActions {
  update: (patch: Partial<CalculatorFieldSection>) => void
  remove: () => void
  addField: () => void
  updateField: (
    fieldIndex: number,
    patch: Partial<CalculatorSectionField>,
  ) => void
  removeField: (fieldIndex: number) => void
  enableToggle: () => void
  disableToggle: () => void
  setGate: (toggleKey: string) => void
  setToggleLabel: (label: CalculatorLocalizedText | undefined) => void
  toggleGateDisableOnly: () => void
}
