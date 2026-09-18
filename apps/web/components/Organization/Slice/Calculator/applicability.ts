import type { Locale } from '@island.is/shared/types'
import type {
  CalculatorConfig,
  CalculatorInputSection,
  CalculatorInputSectionField,
} from '@island.is/tax-calculators'

import type { InputContractField, InputFieldContract } from './contract'
import { localized } from './text'
import { toTypedValue } from './values'

/* `disabled` is the one case where the renderer and the serializer want
 * different answers: a `disableOnly` section renders its fields but they are
 * not in play. Every other exclusion drops the entry outright. */
export interface ApplicableField {
  field: CalculatorInputSectionField
  contractField: InputContractField
  label: string
  disabled: boolean
}

export type ApplicableFields = Map<string, ApplicableField>

export const isInPlay = ({ disabled }: ApplicableField): boolean => !disabled

export type FormValues = Record<string, unknown>

/* Resolved against the target's metadata `type`: form state holds a string
 * where `equals` holds the declared scalar, so a `number` dependency compared
 * raw would never match. */
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

/* Either way the section is out of play: `disableOnly` is presentational, and
 * letting it decide what reaches RSK would make two configs of one calculator
 * send different requests from identical input. Null means gone, not dead. */
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

/* The single answer to "is this field in play", for renderer and serializer
 * alike -- deciding it twice is how a field renders enabled and is then dropped
 * from the request. Omissions are silent; diagnostics warns once. */
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

      /* A raw key must never reach the public page. */
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

/* Gated on computed sufficiency, not react-hook-form validation: `required` on
 * `InputController` reaches the native input only, so `handleSubmit` would
 * accept an empty required field. */
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
