import type { Locale } from '@island.is/shared/types'
import type {
  CalculatorConfig,
  CalculatorInputSection,
  CalculatorInputSectionField,
} from '@island.is/tax-calculators'

import type { InputContractField, InputFieldContract } from './contract'
import { localized } from './text'
import { toTypedValue } from './values'

export interface ApplicableField {
  field: CalculatorInputSectionField
  contractField: InputContractField
  label: string
  disabled: boolean
}

export type ApplicableFields = Map<string, ApplicableField>

export const isInPlay = ({ disabled }: ApplicableField): boolean => !disabled

export type FormValues = Record<string, unknown>

export const isDependencyMet = (
  contractField: InputContractField,
  contract: InputFieldContract,
  values: FormValues,
): boolean => {
  const { dependsOn } = contractField
  if (!dependsOn) return true

  const targetType = contract.get(dependsOn.fieldKey)?.type
  if (!targetType) return false

  return (
    toTypedValue(values[dependsOn.fieldKey], targetType) === dependsOn.equals
  )
}

const sectionState = (
  section: CalculatorInputSection,
  toggles: Record<string, boolean>,
): { disabled: boolean } | null => {
  if (section.toggle && !toggles[section.toggle.key]) return null

  if (section.gate && !toggles[section.gate.toggle]) {
    return section.gate.disableOnly ? { disabled: true } : null
  }

  return { disabled: false }
}

export const collectApplicableFields = (
  config: CalculatorConfig,
  contract: InputFieldContract,
  toggles: Record<string, boolean>,
  values: FormValues,
  locale: Locale,
): ApplicableFields => {
  const applicable: ApplicableFields = new Map()

  for (const section of config.inputSections) {
    const state = sectionState(section, toggles)
    if (!state) continue

    for (const field of section.fields) {
      const contractField = contract.get(field.key)
      if (!contractField) continue

      const label = localized(field.label, locale)
      if (!label) continue

      if (!isDependencyMet(contractField, contract, values)) continue

      applicable.set(field.key, {
        field,
        contractField,
        label,
        disabled: state.disabled,
      })
    }
  }

  return applicable
}

export const canSubmit = (
  applicable: ApplicableFields,
  values: FormValues,
): boolean =>
  [...applicable.values()]
    .filter(isInPlay)
    .every(
      ({ contractField }) =>
        !contractField.required ||
        toTypedValue(values[contractField.key], contractField.type) !==
          undefined,
    )
