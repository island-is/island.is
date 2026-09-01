import type {
  CalculatorFieldSection,
  CalculatorLocalizedText,
  CalculatorSectionField,
} from '@island.is/tax-calculators'

export interface AvailableField {
  key: string
  label: string
}

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
