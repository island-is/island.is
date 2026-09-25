import type { Locale } from '@island.is/shared/types'
import type {
  CalculatorConfig,
  CalculatorInputSection,
  CalculatorInputSectionField,
} from '@island.is/tax-calculators'

import type { InputContractField, InputFieldContract } from '../contract'
import { localized } from './text'
import { toTypedValue } from './values'

export interface ApplicableField {
  field: CalculatorInputSectionField
  contractField: InputContractField
  label: string
  disabled: boolean
}

export type ApplicableFields = Map<string, ApplicableField>

export const isUsedForCalculation = ({ disabled }: ApplicableField): boolean =>
  !disabled

export type FormValues = Record<string, unknown>

export const isDependencyMet = (
  contractField: InputContractField,
  contract: InputFieldContract,
  values: FormValues,
  enabledSectionFieldKeys: ReadonlySet<string>,
): boolean => {
  const { dependsOn } = contractField
  if (!dependsOn) return true

  if (!enabledSectionFieldKeys.has(dependsOn.fieldKey)) return false

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

  const enabledSectionFieldKeys = new Set<string>()
  for (const section of config.inputSections) {
    const state = sectionState(section, toggles)
    if (!state || state.disabled) continue
    for (const field of section.fields) {
      enabledSectionFieldKeys.add(field.key)
    }
  }

  for (const section of config.inputSections) {
    const state = sectionState(section, toggles)
    if (!state) continue

    for (const field of section.fields) {
      const contractField = contract.get(field.key)
      if (!contractField) continue

      const label = localized(field.label, locale)
      if (!label) continue

      if (
        !isDependencyMet(
          contractField,
          contract,
          values,
          enabledSectionFieldKeys,
        )
      )
        continue

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
    .filter(isUsedForCalculation)
    .every(({ contractField }) => {
      const raw = values[contractField.key]
      const typed = toTypedValue(raw, contractField.type)

      if (contractField.required) return typed !== undefined

      const isEmpty = raw === '' || raw === null || raw === undefined
      return isEmpty || typed !== undefined
    })
