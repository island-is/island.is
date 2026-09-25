import type {
  CalculatorInputSection,
  CalculatorInputSectionField,
  CalculatorLocalizedText,
  CalculatorOutputItemField,
  CalculatorOutputSection,
  CalculatorOutputSectionField,
} from '@island.is/tax-calculators'

import type { OutputContractItemField } from './contract'

export interface InputSectionActions {
  update: (patch: Partial<CalculatorInputSection>) => void
  remove: () => void
  addField: () => void
  updateField: (
    fieldIndex: number,
    patch: Partial<CalculatorInputSectionField>,
  ) => void
  removeField: (fieldIndex: number) => void
  enableToggle: () => void
  disableToggle: () => void
  setGate: (toggleKey: string) => void
  setToggleLabel: (label: CalculatorLocalizedText | undefined) => void
  toggleGateDisableOnly: () => void
}

export interface OutputSectionActions {
  update: (patch: Partial<CalculatorOutputSection>) => void
  remove: () => void
  addValueField: () => void
  addContentField: () => void
  updateField: (
    fieldIndex: number,
    patch: Partial<CalculatorOutputSectionField>,
  ) => void
  removeField: (fieldIndex: number) => void
  addItemField: (fieldIndex: number) => void
  addAllItemFields: (
    fieldIndex: number,
    keys: OutputContractItemField[],
  ) => void
  updateItemField: (
    fieldIndex: number,
    itemIndex: number,
    patch: Partial<CalculatorOutputItemField>,
  ) => void
  removeItemField: (fieldIndex: number, itemIndex: number) => void
}
