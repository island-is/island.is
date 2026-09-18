import type { Locale } from '@island.is/shared/types'
import type {
  CalculatorConfig,
  CalculatorInputSection,
  CalculatorInputSectionField,
} from '@island.is/tax-calculators'

import type { InputContractField, InputFieldContract } from './contract'
import { localized } from './text'
import { toTypedValue } from './values'

/* One configured field that survived every exclusion below, carrying what the
 * renderer and the serializer both need so neither looks it up again.
 *
 * `disabled` is the one case where the two want different answers: a section
 * gated with `disableOnly` stays visible with its controls dead, so the field
 * renders but is not in play. Every other exclusion drops the entry outright,
 * so "in play" is `!disabled` and nothing else. */
export interface ApplicableField {
  field: CalculatorInputSectionField
  contractField: InputContractField
  label: string
  disabled: boolean
}

/* Keyed by field key, which the config schema already guarantees is unique
 * across every input section. */
export type ApplicableFields = Map<string, ApplicableField>

export const isInPlay = ({ disabled }: ApplicableField): boolean => !disabled

export type FormValues = Record<string, unknown>

/* Resolved against the target's metadata `type`, because form state holds a
 * string where `equals` holds the scalar metadata declares: a dependency on a
 * `number` field compared raw would never match, hiding its dependent forever.
 *
 * A target missing from the contract is a publication bug the domain rejects
 * anyway, and treating the dependency as unmet is the safe reading of it. */
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

/* A shut gate removes the section outright, unless the editor asked for it to
 * stay visible with its controls dead. Either way the section is out of play:
 * `disableOnly` is a presentational choice by the editor -- a greyed-out
 * preview of what a toggle unlocks -- and letting it decide what reaches RSK
 * would make two configs of one calculator send different requests from
 * identical input.
 *
 * Returns null when the section is gone entirely, rather than merely dead. */
const sectionState = (
  section: CalculatorInputSection,
  toggles: Record<string, boolean>,
): { disabled: boolean } | null => {
  /* A section's own toggle, unlike a gate, has no `disableOnly`: off means the
   * body is not rendered at all. */
  if (section.toggle && !toggles[section.toggle.key]) return null

  if (section.gate && !toggles[section.gate.toggle]) {
    return section.gate.disableOnly ? { disabled: true } : null
  }

  return { disabled: false }
}

/* The single answer to "is this field in play", for the renderer and the
 * serializer alike. Deciding it twice -- the field on its own visibility, the
 * serializer on its own rules -- is how a field comes to render enabled and
 * then be dropped from the request without the visitor knowing.
 *
 * Every omission here is silent on purpose: the warning for each is emitted
 * once from the diagnostics effect, where StrictMode's double render cannot
 * repeat it. */
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

      /* A raw key must never reach the public page, so an unlabelled field is
       * dropped rather than labelled with its key. */
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

/* Submit is gated on computed sufficiency rather than on react-hook-form's own
 * validation: `required` on `InputController` reaches the native input only,
 * and validation comes from a separate `rules` prop, so `handleSubmit` would
 * otherwise accept an empty required field.
 *
 * A calculator whose every field is optional -- `withholdingTax` -- is enabled
 * as soon as metadata loads. That is correct: RSK supplies its own defaults for
 * anything absent. */
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
